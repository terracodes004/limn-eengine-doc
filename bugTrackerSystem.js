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

  const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1542171975500435548/Ul4GkAgi3e7JIlD7dSwzlP1Z0v18PeSpbFogwZNs43jXPRlokIuG6ck3JCsUS6_ZIQCr";

  async function sendToDiscord(errorText) {
    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🚨 **Lumina Engine Error:**\n${errorText}`
        })
      });

      if (response.ok) {
        alert("Success! the message will be sent when you are online.");
      } else {
        const text = await response.text();
        alert("Message rejected! Status: " + response.status + " - " + text);
      }
    } catch (err) {
      alert("Network Error / Blocked: " + err.message);
    }
  }

  window.onerror = function(msg, url, line) {
    const errorMsg = `${msg} (Line: ${line})`;
    showRedErrorPopup(errorMsg);
    sendToDiscord(errorMsg);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const errorMsg = `Unhandled Promise: ${event.reason ? event.reason.message : 'Unknown'}`;
    showRedErrorPopup(errorMsg);
    sendToDiscord(errorMsg);
  });

  const originalConsoleError = console.error;
  console.error = function(...args) {
    originalConsoleError.apply(console, args);
    const errorMsg = args.join(" ");
    showRedErrorPopup(errorMsg);
    sendToDiscord("Console Error: " + errorMsg);
  };

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
        
