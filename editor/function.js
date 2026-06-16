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
    
    let engineScriptFile = "tcjsgame-v3.js";
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
            engineScriptFile = "tcjsgame-v2.js";
        } else if (selectedVersion.includes('v3')) {
            engineScriptFile = "tcjsgame-v3.js";
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
        try {
            ${userEditorCode}
        } catch(err) {
            alert("Engine Runtime Error: " + err.message);
        }
    </script>
</body>
</html>`;


    if (iframe) {
        iframe.srcdoc = code;
    }
}
