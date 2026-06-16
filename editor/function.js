function runn(e){
    // Prevent the page from reloading if this was triggered by a button/form click
    if (e && e.preventDefault) {
        e.preventDefault();
    }

    // 1. Show the loading screen overlay
    $('dialog').fadeIn(300); 
    
    // 2. Grab the code from the single text area box
    let userEditorCode = document.querySelector('textarea').value; 

    // 3. AUTOMATIC DETECTION: Check if the user typed raw HTML tags
    let hasHtmlTags = /<[a-z][\s\S]*>/i.test(userEditorCode) || userEditorCode.includes('<!DOCTYPE');

    if (hasHtmlTags) {
        // Run it directly as a complete single-page web app (HTML + CSS + JS)
        document.querySelector('iframe').srcdoc = userEditorCode;
        
        // Hide the loader
        $('dialog').fadeOut(300);
        return; 
    }
    
    // 4. ENGINE MODE: If it's pure JS, assume they are writing Limn Engine code!
    let engineScriptFile = "tcjsgame-v3.js"; 

    // 5. Build the canvas environment wrapper for their Limn Game code
    let code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body, html { margin: 0; padding: 0; background-color: #000; height: 100%; width: 100%; }
        canvas { display: block; margin: 0 auto; background: green; }
    </style>
    <script src="./${engineScriptFile}"></script>
</head>
<body>
    <canvas id="c" width="600" height="400"></canvas>

    <script>
        // Run code immediately after DOM is parsed so it doesn't vanish
        try {
            ${userEditorCode}
        } catch(err) {
            alert("Engine Runtime Error: " + err.message);
        }
        
        // Tell the parent window to turn off the loading screen
        if (window.parent && window.parent.$) {
            window.parent.$('dialog').fadeOut(300);
        }
    </script>
</body>
</html>`;

    // 6. Direct the package stack into your preview sandbox iframe container
    document.querySelector('iframe').srcdoc = code;
}
