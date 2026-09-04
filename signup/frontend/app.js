import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pjtpesdhjfvcidfkxord.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdHBlc2RoamZ2Y2lkZmt4b3JkIiwicm9sZSI6ImFub24i; // truncated for safety, keep your full key here

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const messageEl = document.getElementById('message');

const homeRedirect = window.location.origin + '/index.html';
const callbackPath = window.location.origin + '/signup/frontend/callback.html';

function showMessage(text, type = 'error') {
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = type;
        messageEl.style.display = 'block';
    }
}

async function checkUserRouting() {
    // Give localStorage a micro-moment to settle after redirect
    let { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session) {
        // Quick retry if session isn't found immediately after a redirect
        await new Promise(resolve => setTimeout(resolve, 300));
        const retryResult = await supabase.auth.getSession();
        session = retryResult.data.session;
    }

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

        const currentPath = window.location.pathname;
        if (userData && userData.subscribed && currentPath !== '/' && currentPath !== '/index.html' && currentPath !== '') {
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

// Keep the rest of your button event listeners below...
