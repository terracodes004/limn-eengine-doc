function runn(){
    // 1. Toggle your loading dialog screen
    $('dialog').fadeToggle(500);
    let use = "";
    
    // 2. Safely get the engine string fetched by your XMLHttpRequests
    switch (document.querySelector("select").value) {
        case "v2":
            use = (typeof v2t !== 'undefined') ? v2t : "";
            break;
        case "v3":
            use = (typeof v3t !== 'undefined') ? v3t : "";
            break;
        default:
            break;
    }
    
    // 3. Grab what the user typed inside your editor text box
    let userEditorCode = document.querySelector('textarea').value; 

    // 4. Assemble the complete HTML document inside the 'code' variable
    code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <script>
        // Inject the core engine framework rules (v2 or v3)
        ${use}
    </script>
</head>
<body>
    <script>
        try {
            // Inject and run the user's canvas game setup code
            ${userEditorCode}
        } catch(err) {
            // Keep the loader from locking up if there's a typo in the canvas code
            alert("Runtime Error: " + err.message);
        }
    </script>
</body>
</html>`;

    // 5. Safely push the compiled environment into your preview iframe sandbox
    document.querySelector('iframe').srcdoc = code;
}
