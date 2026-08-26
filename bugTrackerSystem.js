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
    showRedErrorPopup(msg + " (Line: " + line + ")");
  };

  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: "Kr4_luQm2zOBqZVQS",
    });
  } else {
    console.error("EmailJS script is not loaded!");
  }

  const ENCODED_BUG_CONFIG = "eyJkaXNjb3JkV2ViaG9va1VybCI6Imh0dHBzOi8vZGlzY29yZC5jb20vYXBpL3dlYmhvb2tzLzE1NDA2OTg1NjcwMDQzODk0MDgvNXJLLXpwUEtjU25ITGR2d0U5d1BtX1NsUVhYQWJLSzNzYnotS3RsMEhrQW1TYkJiY2FWN2FIZkdnME1qci1mbTEiLCJlbWFpbENvbmZpZyI6eyJzZXJ2aWNlSWQiOiJzZXJ2aWNlXzU2MzYycmUiLCJ0ZW1wbGF0ZUlkIjoidGVtcGxhdGVfeGUzYWUzZSJ9fQ==";
  const BUG_CONFIG = JSON.parse(atob(ENCODED_BUG_CONFIG));

  function logBugReport(description, errorDetails = {}) {
    const bugReport = {
      description: description,
      error: errorDetails.message || 'Manual submission',
      file: errorDetails.filename || 'N/A',
      line: errorDetails.lineno || 'N/A',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    let reports = JSON.parse(localStorage.getItem('limn_offline_bugs') || '[]');
    reports.push(bugReport);
    localStorage.setItem('limn_offline_bugs', JSON.stringify(reports));
    
    if (navigator.onLine) {
      syncBugReports();
    }
  }

  window.addEventListener('error', (event) => {
    logBugReport('Unhandled Runtime Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logBugReport('Unhandled Promise Rejection', {
      message: event.reason ? event.reason.message : 'Unknown async error',
      filename: 'Async/Promise',
      lineno: 'N/A'
    });
  });

  async function syncBugReports() {
    const reports = JSON.parse(localStorage.getItem('limn_offline_bugs') || '[]');
    if (reports.length === 0) return;

    try {
      const [discordSuccess, emailSuccess] = await Promise.all([
        sendToDiscord(reports),
        sendToEmail(reports)
      ]);

      if (discordSuccess || emailSuccess) {
        localStorage.removeItem('limn_offline_bugs');
      }
    } catch (error) {
      console.error('Sync attempt failed:', error);
    }
  }

  async function sendToDiscord(reports) {
    const descriptionText = reports.map(r => 
      `• **Time:** ${r.timestamp}\n  **Error:** ${r.error}\n  **File:** ${r.file}:${r.line}\n  **Desc:** ${r.description}`
    ).join('\n\n');

    const response = await fetch(BUG_CONFIG.discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🚨 **Limn Engine - Offline Bug Report(s):**\n${descriptionText}`
      })
    });
    return response.ok;
  }

  async function sendToEmail(reports) {
    if (typeof emailjs === 'undefined') return false;
    
    const bugSummary = reports.map(r => 
      `Error: ${r.error} | File: ${r.file}:${r.line}`
    ).join('\n');

    try {
      const response = await emailjs.send(
        BUG_CONFIG.emailConfig.serviceId, 
        BUG_CONFIG.emailConfig.templateId, 
        {
          to_email: 'evolvedtech004@gmail.com', 
          description: reports[0].description,
          errorDetails: bugSummary,
          timestamp: reports[0].timestamp,
          url: window.location.href
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  window.addEventListener('online', () => {
    syncBugReports();
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
        logBugReport('User clicked bug button', { message: userDescription });
        alert('Bug report saved! It will be sent automatically.');
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
  
