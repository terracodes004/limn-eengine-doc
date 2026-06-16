function runn(){
    // 1. Open the dialog box so the iframe is visible
    $('dialog').fadeIn(300);
    
    // 2. Grab the code from your text area
    let userEditorCode = document.querySelector('textarea').value; 

    // 3. Check if the user typed raw HTML tags
    let hasHtmlTags = /<[a-z][\s\S]*>/i.test(userEditorCode) || userEditorCode.includes('<!DOCTYPE');

    if (hasHtmlTags) {
        // Run it directly inside your existing iframe
        document.querySelector('iframe').srcdoc = userEditorCode;
        return; 
    }
    
    // 4. ENGINE MODE: If it's pure JS, wrap it with the canvas element
    let engineScriptFile = "tcjsgame-v3.js"; 

    let code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body, html { margin: 0; padding: 0; background-color: green; }
        canvas { display: block; margin: 0 auto; }
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

    // 5. Inject the compiled code into the iframe
    document.querySelector('iframe').srcdoc = code;
}
