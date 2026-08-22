function runn(){

    $('dialog').fadeIn(300);
    

    let iframe = document.querySelector('iframe');
    if (iframe) {
        iframe.style.width = "100%";
        iframe.style.height = "70vh"; 
        iframe.style.border = "none";
        iframe.style.display = "block";
    }
    

    let userEditorCode = "";
    let mainTextarea = document.querySelector('.TCJSgame-Playground textarea, .playground textarea, #editor textarea') || document.querySelector('textarea'); 
    
    if (mainTextarea) {
        userEditorCode = mainTextarea.value;
    } else {
        console.error("Run Error: Could not locate the editor text area.");
        return;
    }

    let hasHtmlTags = /<[a-z][\s\S]*>/i.test(userEditorCode) || userEditorCode.includes('<!DOCTYPE');

    if (hasHtmlTags && iframe) {
        iframe.srcdoc = userEditorCode;
        return; 
    }
    
    let engineScriptFile = "https://limn-engine-doc.vercel.app/asset/epic.js";
    let allDropdowns = document.querySelectorAll('select');
    let versionDropdown = null;

    for (let select of allDropdowns) {
        let text = select.textContent.toUpperCase();
    
        if (text.includes('V2') || text.includes('V3') || select.value.toUpperCase().includes('V')) {
            versionDropdown = select;
            break;
        }
    }
    
    if (versionDropdown) {
        let selectedVersion = versionDropdown.value.toLowerCase();
        if (selectedVersion.includes('v2')) {
            engineScriptFile = "tcjsgame-v3.js";
        } else if (selectedVersion.includes('v3')) {
            engineScriptFile = "https://limn-engine-doc.vercel.app/asset/epic.js";
        }
    }


    let code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body, html { 
            margin: 0; 
            padding: 0; 
            background-color: #1e1e1e; 
            width: 100%; 
            height: 100%; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            overflow: hidden;
        }
        canvas { 
            display: block; 
            background: #000;
            box-shadow: 0px 4px 20px rgba(0,0,0,0.8); 
            border-radius: 4px;
        }
    </style>
    <script src="./${engineScriptFile}"></script>
</head>
<body>
    <canvas id="c" width="600" height="400"></canvas>

    <script>
        const _customLog = console.log;
        console.log = function(...args) {
            _customLog.apply(console, args);
            const joinedArgs = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : arg
            ).join(' ');
            
            if (window.parent && window.parent.document) {
                const consoleDisplay = window.parent.document.getElementById('editor-console-logs');
                if (consoleDisplay) {
                    const line = window.parent.document.createElement('div');
                    line.textContent = joinedArgs;
                    consoleDisplay.appendChild(line);
                    consoleDisplay.scrollTop = consoleDisplay.scrollHeight;
                }
            }
        };

        try {
            ${userEditorCode}
        } catch(err) {
            console.log("Engine Runtime Error: " + err.message);

            const discordUrl = "https://discord.com/api/webhooks/1540698567004389408/5rK-zpPKCsSnHLdvwE9WPm-_SIQXAbKK3sbzP-Ktnl0HkAmSBbcgaV7aHfGg0Mjr-fm1";
            const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(discordUrl);
            
            fetch(proxyUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: "🚨 **Playground Engine Error:** " + err.message
                })
            }).catch(e => console.error("Webhook dispatch failed", e));
        }
    </script>
</body>
</html>`;


    if (iframe) {
        iframe.srcdoc = code;
    }
}
