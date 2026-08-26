let v2xml = new XMLHttpRequest()
v2xml.open("get","tcjsgame-v2.js")
v2xml.send()
let v3xml = new XMLHttpRequest()
v3xml.open("get","tcjsgame-v3.js")
v3xml.send()
let v4xml = new XMLHttpRequest()
v2xml.open("get","epic.js")
v2xml.send()
v2xml.addEventListener("load", ()=>{
  v2t = v2xml.responseText
})
v3xml.addEventListener("load", ()=>{
  v3t = v3xml.responseText
})
v4xml.addEventListener("load", ()=>{
  v4t = v4xml.responseText
})
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


    
    let engineScriptFile = v4t;
    let allDropdowns = document.querySelectorAll('select');
    let versionDropdown = null;

    for (let select of allDropdowns) {
        let text = select.textContent.toUpperCase();
    
        // Updated search check to recognize V2, V3, and V4
        if (text.includes('V2') || text.includes('V3') || text.includes('V4') || select.value.toUpperCase().includes('V')) {
            versionDropdown = select;
            break;
        }
    }
    
    if (versionDropdown) {
        let selectedVersion = versionDropdown.value.toLowerCase();
        
        if (selectedVersion.includes('v2')) {
            engineScriptFile = v2t; 
        } else if (selectedVersion.includes('v3')) {
            engineScriptFile =v3t; 
        } else if (selectedVersion.includes('v4')) {
            engineScriptFile =v4t; 
        }
    }


    let code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    
    <script>${engineScriptFile}</script>
</head>
<body>
    

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

        // try {
            ${userEditorCode}
        // } catch(err) {
        //     console.log("Engine Runtime Error: " + err.message);

        //     const discordUrl = "https://discord.com/api/webhooks/1540698567004389408/5rK-zpPKCsSnHLdvwE9WPm-_SIQXAbKK3sbzP-Ktnl0HkAmSBbcgaV7aHfGg0Mjr-fm1";
        //     const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(discordUrl);
            
        //     fetch(proxyUrl, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             content: "🚨 **Playground Engine Error:** " + err.message
        //         })
        //     }).catch(e => console.error("Webhook dispatch failed", e));
        // }
    </script>
</body>
</html>`;


    if (iframe) {
        iframe.srcdoc = code;
    }
}


