function runn(){
    $('dialog').fadeIn(300);
    
    let iframe = document.querySelector('iframe');
    if (iframe) {
        iframe.style.width = "100%";
        iframe.style.height = "70vh"; 
        iframe.style.border = "none";
        iframe.style.display = "block";
    }
    
    let textareaElement = document.querySelector('textarea');
    if (!textareaElement) return;
    let userEditorCode = textareaElement.value;

    if (iframe) {
        iframe.srcdoc = userEditorCode;
    }
}
