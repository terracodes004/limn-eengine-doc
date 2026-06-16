function runn(){
    $('dialog').fadeIn(300);
    
    
    let iframe = document.querySelector('iframe');
    iframe.style.width = "620px";  // Fits the 600px width + padding
    iframe.style.height = "420px"; // Fits the 400px height + padding
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.margin = "0 auto";
    
    
    let userEditorCode = document.querySelector('textarea').value; 

    
    let hasHtmlTags = /<[a-z][\s\S]*>/i.test(userEditorCode) || userEditorCode.includes('<!DOCTYPE');

    if (hasHtmlTags) {
        
        iframe.srcdoc = userEditorCode;
        return; 
    }
    
 
    let engineScriptFile = "tcjsgame-v3.js"; 

  
    let code = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <style>
        body, html { 
            margin: 0; 
            padding: 0; 
            background-color: #222; 
            width: 100%; 
            height: 100%; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
        }
        canvas { 
            display: block; 
            box-shadow: 0px 4px 10px rgba(0,0,0,0.5); 
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

    
    iframe.srcdoc = code;
}
