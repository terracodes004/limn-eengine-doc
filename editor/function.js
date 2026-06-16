function runn(){
    // 1. Toggle the loading dialog display setup
    $('dialog').fadeToggle(500);
    let use = "";
    
    // 2. Safely read the engine version chosen in your dropdown menu selector
    switch (document.querySelector("select").value) {
        case "v2":
            use = (typeof v2t !== 'undefined' && v2t) ? v2t : "";
            break;
        case "v3":
            use = (typeof v3t !== 'undefined' && v3t) ? v3t : "";
            break;
        default:
            break;
    }
    
    // 3. Fallback check: If the code string is still empty, warn the user
    if (!use) {
        alert("Engine core files are still downloading or missing. Please wait a second and try again!");
        $('dialog').fadeToggle(100); // Hide the loading screen immediately
        return;
    }
    
    // 4. Extract the user's canvas logic code from your text area box
    let userEditorCode = document.querySelector('textarea').value; 

    // 5. Structure the dynamic sandboxed environment inside the 'code' template
    code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body, html { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
        canvas { display: block; margin: 0 auto; }
    </style>
    <script>
        // Inject the core engine framework rules safely (v2 or v3)
        ${use}
    </script>
</head>
<body>
    <script>
        try {
            // Run the custom canvas logic typed by the user
            ${userEditorCode}
            
            // Success! Tell the main editor UI layer to hide the loading overlay dialog
            window.parent.$('dialog').fadeOut(300);
        } catch(err) {
            // Catch typos gracefully so the engine spinner doesn't run forever
            alert("Runtime Error: " + err.message);
            window.parent.$('dialog').fadeOut(100);
        }
    </script>
</body>
</html>`;

    // 6. Inject the fully operational sandbox framework stack straight to the iframe
    document.querySelector('iframe').srcdoc = code;
}
