document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('nav-burger');
  const asideNav = document.querySelector('aside');

  if (burgerBtn && asideNav) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      asideNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (asideNav.classList.contains('open') && !asideNav.contains(e.target)) {
        asideNav.classList.remove('open');
      }
    });
  }

  const navLinks = document.querySelectorAll('nav ul li a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPath) {
      link.parentElement.classList.add('active');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach((pre) => {
    pre.style.position = 'relative';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerText = '📋 Copy';
    
    Object.assign(copyBtn.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: 'var(--surface, #05083d)',
      color: 'var(--accent2, #7fffb2)',
      border: '1px solid var(--border, rgba(255,99,140,0.2))',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '11px',
      fontFamily: "'Space Mono', monospace",
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    });

    copyBtn.addEventListener('click', async () => {
      const codeText = pre.querySelector('code')?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        copyBtn.innerText = '✅ Copied!';
        copyBtn.style.color = '#7fffb2';

        setTimeout(() => {
          copyBtn.innerText = '📋 Copy';
          copyBtn.style.color = 'var(--accent2, #7fffb2)';
        }, 2000);
      } catch (err) {
        copyBtn.innerText = '❌ Failed';
      }
    });

    pre.appendChild(copyBtn);
  });
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');

      window.addEventListener('online', () => {
        registration.update();
      });

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New PWA version found. Reloading...');
            window.location.reload();
          }
        });
      });
    } catch (err) {
      console.error('Service worker registration failed:', err);
    }
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
        
