import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pjtpesdhjfvcidfkxord.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdHBlc2RoamZ2Y2lkZmt4b3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDUyNDUsImV4cCI6MjEwMzcyMTI0NX0.110aDXEqJ4PxjKWNv1Z2YNR8frklg3WW1u0HePDoN38';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const messageEl = document.getElementById('message');

const homeRedirect = window.location.origin + '/index.html';
const callbackPath = window.location.origin + '/callback';

function showMessage(text, type = 'error') {
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = type;
        messageEl.style.display = 'block';
    }
}

async function checkUserRouting() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (session) {
        const userMetadata = session.user.user_metadata;
        const fullName = userMetadata?.full_name || userMetadata?.name || session.user.email.split('@')[0];

        const userBanner = document.getElementById('user-banner');
        const nameSpan = document.getElementById('persistent-name');
        
        if (userBanner && nameSpan) {
            nameSpan.textContent = fullName;
            userBanner.innerHTML = `<span>👋 Welcome back, <strong>${fullName}</strong>!</span>`;
            userBanner.style.display = 'inline-flex';
        }

        const signInBtn = document.querySelector('.btn-signin');
        if (signInBtn) signInBtn.style.display = 'none';

        const { data: userData } = await supabase
            .from('users')
            .select('subscribed')
            .eq('id', session.user.id)
            .maybeSingle();

        if (userData && userData.subscribed && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            window.location.href = homeRedirect;
            return;
        }

        const stepGoogle = document.getElementById('step-google');
        const stepEmail = document.getElementById('step-email');
        if (stepGoogle) stepGoogle.classList.add('hidden');
        if (stepEmail) stepEmail.classList.remove('hidden');
    } else {
        const stepGoogle = document.getElementById('step-google');
        const stepEmail = document.getElementById('step-email');
        if (stepGoogle) stepGoogle.classList.remove('hidden');
        if (stepEmail) stepEmail.classList.add('hidden');
    }
}

checkUserRouting();

const googleLoginBtn = document.getElementById('google-login-btn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        showMessage('⏳ Connecting to Google...', 'success');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: callbackPath }
        });
        if (error) {
            showMessage('❌ OAuth Error: ' + error.message, 'error');
        }
    });
} else {
    showMessage('⚠️ Error: Google button ID not found in HTML!', 'error');
}

const sendEmailBtn = document.getElementById('send-email-btn');
if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', async () => {
        const emailInput = document.getElementById('email-input');
        const email = emailInput ? emailInput.value.trim() : '';
        if (!email) return showMessage('Enter a valid email address', 'error');

        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: { emailRedirectTo: callbackPath }
        });
        
        if (!error) {
            showMessage('✅ Verification code sent to your email!', 'success');
            const otpSection = document.getElementById('otp-section');
            if (otpSection) otpSection.classList.remove('hidden');
        } else {
            showMessage('❌ ' + error.message, 'error');
        }
    });
}

const verifyEmailBtn = document.getElementById('verify-email-btn');
if (verifyEmailBtn) {
    verifyEmailBtn.addEventListener('click', async () => {
        const emailInput = document.getElementById('email-input');
        const otpInput = document.getElementById('otp-input');
        const email = emailInput ? emailInput.value.trim() : '';
        const token = otpInput ? otpInput.value.trim() : '';

        if (!token) return showMessage('Enter the verification code', 'error');

        const { error } = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'email'
        });
        
        if (!error) {
            showMessage('🎉 Email verified! Redirecting...', 'success');
            setTimeout(() => { window.location.href = homeRedirect; }, 1500);
        } else {
            showMessage('❌ ' + error.message, 'error');
        }
    });
}
