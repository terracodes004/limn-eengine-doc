let v2xml = new XMLHttpRequest()
v2xml.open("get","tcjsgame-v2.js")
v2xml.send()
let v3xml = new XMLHttpRequest()
v3xml.open("get","tcjsgame-v3.js")
v3xml.send()
let code;
function runn(){
        $('dialog').fadeToggle(500)
        let use;
        switch (document.querySelector("select").value) {
            case "v2":
                use = v2t
                break;
            case "v3":
                use = v3t
            default:
                break;
        }
        code = `<!DOCTYPE html>\n<html lang='en'>\n<head>\n<meta charset='UTF-8'>\n<meta name='viewport' content='width=device-width, initial-scale=1.0'>\n<title>Document</title>\n<script>${use}</script></head>\n<body><script>${document.querySelector('textarea').value}</script>\n</body>\n</html>`
        document.querySelector('iframe').srcdoc = code
        cocode = code.replace(/console.log/g, "document.writeln")
        document.getElementById("nn").srcdoc = cocode
                    
}
v2xml.addEventListener("load", ()=>{
  v2t = v2xml.responseText
})
v3xml.addEventListener("load", ()=>{
  v3t = v3xml.responseText
})
let files = {}
let filesName = [];
if(!localStorage.files){
  localStorage.files = []
  localStorage.filename = []
files = {}
}else{
    files = JSON.parse(localStorage.getItem("files"))
    filesName = localStorage.getItem("filename").split(",")
}
let np;
