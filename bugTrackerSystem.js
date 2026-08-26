(function(){
  function showRedErrorPopup(message) {
    const existing = document.getElementById('limn-error-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'limn-error-banner';
    banner.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ff4757;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      max-width: 90%;
      text-align: center;
      border: 2px solid #fff;
    `;
    banner.innerHTML = `🚨 <strong>Run Error Caught:</strong><br><span style="font-weight: normal; font-size: 14px;">${message}</span>`;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '✕ Dismiss';
    closeBtn.style.cssText = `
      display: block;
      margin: 10px auto 0 auto;
      background: rgba(0,0,0,0.3);
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => banner.remove();
    banner.appendChild(closeBtn);

    document.body.appendChild(banner);
  }

  window.onerror = function(msg, url, line) {
    const errorMsg = `${msg} (Line: ${line})`;
    showRedErrorPopup(errorMsg);
    sendToDiscord(errorMsg);
  };

  // Securely encoded configuration with your brand new webhook URL
  const ENCODED_CONFIG = "eyJkaXNjb3JkV2ViaG9va1VybCI6Imh0dHBzOi8vZGlzY29yZC5jb20vYXBpL3dlYmhvb2tzLzE1NDIxNzE5NzU1MDA0MzU1NDgvVWw0R2tBZ2kzZTdKSWxEN2RTd3psUDFaMHYxOFBlU3BiRm9nd1pOczQzalhQUmxvaUl1RzZjazNKQ3NVU18yWlFDciJ9";
  const BUG_CONFIG = JSON.parse(atob(ENCODED_CONFIG));

  async function sendToDiscord(errorText) {
    try {
      const response = await fetch(BUG_CONFIG.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **Lumina Engine Error:**\n${errorText}`
        })
      });

      if (response.ok) {
        alert("Success! Sent to Discord.");
      } else {
        const text = await response.text();
        alert("Discord rejected it! Status: " + response.status + " - " + text);
      }
    } catch (err) {
      alert("Network Error / Blocked: " + err.message);
    }
  }

  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = `Unhandled Promise: ${event.reason ? event.reason.message : 'Unknown'}`;
    showRedErrorPopup(errorMsg);
    sendToDiscord(errorMsg);
  });

  function createBugButton() {
    if (document.getElementById('limn-bug-btn')) return; 

    const bugButton = document.createElement('button');
    bugButton.id = 'limn-bug-btn';
    bugButton.innerText = 'Report a Bug 🐛';
    bugButton.style.cssText = 'position: fixed; bottom: 10px; right: 10px; z-index: 9999; padding: 8px 12px; background: #ff4757; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.3);';
    
    bugButton.addEventListener('click', () => {
      const userDescription = prompt("Briefly describe what went wrong:");
      if (userDescription) {
        sendToDiscord(`User Manual Report: ${userDescription}`);
      }
    });

    document.body.appendChild(bugButton);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBugButton);
  } else {
    createBugButton();
  }
})();
