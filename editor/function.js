function runn(){
    // 1. Show the loading screen overlay
    $('dialog').fadeToggle(500);
    
    // 2. Grab the code from the single text area box
    let userEditorCode = document.querySelector('textarea').value; 

    // 3. AUTOMATIC DETECTION: Check if the user typed raw HTML tags
    // This looks for things like <script>, <canvas>, <div>, or <!DOCTYPE
    let hasHtmlTags = /<[a-z][\s\S]*>/i.test(userEditorCode) || userEditorCode.includes('<!DOCTYPE');

    if (hasHtmlTags) {
        // Run it directly as a complete single-page web app (HTML + CSS + JS)
        document.querySelector('iframe').srcdoc = userEditorCode;
        
        // Instantly clear the loader since no extra engine compiles are needed
        window.parent.$('dialog').fadeOut(300);
        return; 
    }
    
    // 4. ENGINE MODE: If it's pure JS, assume they are writing Limn Engine code!
    // Change "tcjsgame-v3.js" to whatever your exact Limn library filename is
    let engineScriptFile = "tcjsgame-v3.js"; 

    // 5. Build the canvas environment wrapper for their Limn Game code
    code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body, html { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
        canvas { display: block; margin: 0 auto; }
    </style>
    
    <script src="./${engineScriptFile}"></script>
</head>
<body>
    <script>
        window.addEventListener('load', () => {
            try {
                // Execute their pure Limn Engine game code safely
                ${userEditorCode}
                
                // Close loading screen overlay
                window.parent.$('dialog').fadeOut(300);
            } catch(err) {
                alert("Engine Runtime Error: " + err.message);
                window.parent.$('dialog').fadeOut(100);
            }
        });
    </script>
</body>
</html>`;

    // 6. Direct the package stack into your preview sandbox iframe container
    document.querySelector('iframe').srcdoc = code;
}
