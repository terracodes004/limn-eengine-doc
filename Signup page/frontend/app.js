import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pjtpesdhjfvcidfkxord.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdHBlc2RoamZ2Y2lkZmt4b3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDUyNDUsImV4cCI6MjEwMzcyMTI0NX0.110aDXEqJ4PxjKWNv1Z2YNR8frklg3WW1u0HePDoN38';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const messageEl = document.getElementById('message');

const homeRedirect = window.location.origin + '/';

async function checkUserRouting() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        const userMetadata = session.user.user_metadata;
        const fullName = userMetadata?.full_name || userMetadata?.name || session.user.email;
        console.log("Logged in user name:", fullName);

        const { data: userData } = await supabase
            .from('users')
            .select('subscribed')
            .eq('id', session.user.id)
            .maybeSingle();

        if (userData && userData.subscribed) {
            window.location.href = homeRedirect;
            return;
        }

        const stepGoogle = document.getElementById('step-google');
        const stepPhone = document.getElementById('step-phone');
        if (stepGoogle) stepGoogle.classList.add('hidden');
        if (stepPhone) stepPhone.classList.remove('hidden');
    } else {
        const stepGoogle = document.getElementById('step-google');
        const stepPhone = document.getElementById('step-phone');
        if (stepGoogle) stepGoogle.classList.remove('hidden');
        if (stepPhone) stepPhone.classList.add('hidden');
    }
}

checkUserRouting();

const googleLoginBtn = document.getElementById('google-login-btn');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + '/callback.html' }
        });
        if (error) showMessage(error.message, 'error');
    });
}

const sendOtpBtn = document.getElementById('send-otp-btn');
if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
        const phoneInput = document.getElementById('phone-input');
        const phone = phoneInput ? phoneInput.value.trim() : '';
        if (!phone) return showMessage('Enter a valid phone number', 'error');

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return showMessage('Please login first', 'error');

        const res = await fetch('/api/register-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, user_id: session.user.id })
        });
        const data = await res.json();
        
        if (res.ok) {
            showMessage('✅ OTP sent to your WhatsApp!', 'success');
            const otpSection = document.getElementById('otp-section');
            if (otpSection) otpSection.classList.remove('hidden');
        } else {
            showMessage('❌ ' + (data.error || 'Failed to send OTP'), 'error');
        }
    });
}

const verifyPhoneBtn = document.getElementById('verify-phone-btn');
if (verifyPhoneBtn) {
    verifyPhoneBtn.addEventListener('click', async () => {
        const phoneInput = document.getElementById('phone-input');
        const otpInput = document.getElementById('otp-input');
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const code = otpInput ? otpInput.value.trim() : '';
        if (!code || code.length !== 6) return showMessage('Enter a valid 6-digit code', 'error');

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return showMessage('Please login first', 'error');

        const res = await fetch('/api/verify-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, code, user_id: session.user.id })
        });
        const data = await res.json();
        
        if (res.ok) {
            showMessage('🎉 Verified! Redirecting to home...', 'success');
            setTimeout(() => {
                window.location.href = homeRedirect;
            }, 1500);
        } else {
            showMessage('❌ ' + (data.error || 'Verification failed'), 'error');
        }
    });
}

function showMessage(text, type) {
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = type;
    }
}

