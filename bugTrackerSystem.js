(function(){
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: "Kr4_luQm2zOBqZVQS",
    });
  } else {
    console.error("EmailJS script is not loaded!");
  }
})();

const BUG_CONFIG = {
  discordWebhookUrl: 'https://discord.com/api/webhooks/1542171975500435548/Ul4GkAgi3e7JIlD7dSwzlP1Z0v18PeSpbFogwZNs43jXPRlokIuG6ck3JCsUS6_ZIQCr',
  emailConfig: {
    serviceId: 'service_z5636re',
    templateId: 'template_xe3ae3e'
  }
};

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
  
  console.log('Bug logged locally. Total queued:', reports.length);

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

async function syncBugReports() {
  const reports = JSON.parse(localStorage.getItem('limn_offline_bugs') || '[]');
  if (reports.length === 0) return;

  console.log(`Syncing ${reports.length} offline bug report(s)...`);

  try {
    const [discordSuccess, emailSuccess] = await Promise.all([
      sendToDiscord(reports),
      sendToEmail(reports)
    ]);

    if (discordSuccess || emailSuccess) {
      localStorage.removeItem('limn_offline_bugs');
      console.log('Bug reports successfully sent and queue cleared!');
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
    console.log('EmailJS Success:', response);
    return true;
  } catch (error) {
    console.error('EmailJS Failed to send:', error);
    return false;
  }
}

window.addEventListener('online', () => {
  console.log('Connection restored! Flushing bug report queue...');
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
      alert('Bug report saved! It will be sent automatically when you are online.');
    }
  });

  document.body.appendChild(bugButton);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createBugButton);
} else {
  createBugButton();
      }
      
