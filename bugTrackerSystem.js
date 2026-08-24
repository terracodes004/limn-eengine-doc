(function(){
   emailjs.init({
     publicKey: "Kr4_luQm2zOBqZVQS",
   });
})();

const BUG_CONFIG = {
  discordWebhookUrl: 'https://discord.com/api/webhooks/1540698567004389408/5rK-zpPKcSnHLdvwE9wPm_SlQXXAbKK3sbzP-KtnI0HkAmSbBbcgaV7aHfGg0Mjr-fm1',
  emailConfig: {
    serviceId: 'Service_z5636re',
    templateId: 'Template_xe3ae3e'
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

  console.log(`Syncing ${reports.length} offline bug report(s) to Discord and Email...`);

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
    console.error('Sync attempt failed (likely still offline):', error);
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
  const bugSummary = reports.map(r => 
    `Error: ${r.error} | File: ${r.file}:${r.line}`
  ).join('\n');

  const response = await emailjs.send(
    BUG_CONFIG.emailConfig.serviceId, 
    BUG_CONFIG.emailConfig.templateId, 
    {
      description: reports[0].description,
      errorDetails: bugSummary,
      timestamp: reports[0].timestamp,
      url: window.location.href
    }
  );
  return response.status === 200;
}

window.addEventListener('online', () => {
  console.log('Connection restored! Flushing bug report queue...');
  syncBugReports();
});

document.addEventListener('DOMContentLoaded', () => {
  const bugButton = document.createElement('button');
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
});
    
