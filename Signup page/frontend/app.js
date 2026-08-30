import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const messageEl = document.getElementById('message');

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
            window.location.href = '../index.html';
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
                window.location.href = '../index.html';
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
            
