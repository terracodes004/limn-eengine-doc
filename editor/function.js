function runn(){
    $('dialog').fadeIn(300);
    let iframe = document.querySelector('iframe');
    if (iframe) {
        iframe.setAttribute('sandbox', 'allow-scripts');
        iframe.style.width = "100%";
        iframe.style.height = "70vh"; 
        iframe.style.border = "none";
        iframe.style.display = "block";
    }
    let textareaElement = document.querySelector('textarea');
    if (!textareaElement) return;
    let userEditorCode = textareaElement.value; 

    if (userEditorCode.includes('<html') || userEditorCode.includes('<!DOCTYPE')) {
        if (iframe) iframe.srcdoc = userEditorCode;
        return; 
    }
    
    let engineScriptFile = "tcjsgame-v3.js"; 
    let code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body, html { margin: 0; padding: 0; background-color: #1e1e1e; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; }
        canvas { display: block; background: #000; box-shadow: 0px 4px 20px rgba(0,0,0,0.8); border-radius: 4px; }
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
