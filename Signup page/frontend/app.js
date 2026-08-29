import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const messageEl = document.getElementById('message');

// --- Session & Routing Check on Load ---
async function checkUserRouting() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // Check if user is already fully registered/verified in the database
        const { data: userData } = await supabase
            .from('users')
            .select('subscribed')
            .eq('id', session.user.id)
            .maybeSingle();

        if (userData && userData.subscribed) {
            // Already subscribed, redirect straight to home page
            window.location.href = '/home.html';
            return;
        }

        // Logged in with Google, but needs phone verification
        document.getElementById('step-google').classList.add('hidden');
        document.getElementById('step-phone').classList.remove('hidden');
    } else {
        // Not logged in, show Google login step first
        document.getElementById('step-google').classList.remove('hidden');
        document.getElementById('step-phone').classList.add('hidden');
    }
}

checkUserRouting();

// --- Step 1: Google Login ---
document.getElementById('google-login-btn').addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/callback.html' }
    });
    if (error) showMessage(error.message, 'error');
});

// --- Step 2: Send OTP ---
document.getElementById('send-otp-btn').addEventListener('click', async () => {
    const phone = document.getElementById('phone-input').value.trim();
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
        document.getElementById('otp-section').classList.remove('hidden');
    } else {
        showMessage('❌ ' + (data.error || 'Failed to send OTP'), 'error');
    }
});

// --- Step 3: Verify OTP ---
document.getElementById('verify-phone-btn').addEventListener('click', async () => {
    const phone = document.getElementById('phone-input').value.trim();
    const code = document.getElementById('otp-input').value.trim();
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
            window.location.href = '/home.html';
        }, 1500);
    } else {
        showMessage('❌ ' + (data.error || 'Verification failed'), 'error');
    }
});

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = type;
}
