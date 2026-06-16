let dbtn;
document.getElementById("js").addEventListener('keypress', (e)=>{
    // if(e.key === "<"){
    //     document.getElementById("js").setRangeText('>', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd)
    // }
    console.log(e.key)
    
    if(e.key === "("){
        document.getElementById("js").setRangeText(')', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd)
        console.log("hjdaa")
    }
    if(e.key ===  "<"){
        document.getElementById("js").setRangeText('>', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd)
        console.log("hjhhhhhdaa")
    }
    if(e.key ===  "\""){
        document.getElementById("js").setRangeText('\"', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd)
    }
    if(e.key ===  "\'"){
        document.getElementById("js").setRangeText('\'', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd)
    }
    if(e.key ===  "["){
        document.getElementById("js").setRangeText(']', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd)
        console.log("hjdaffgfa")
    }
    if(e.key === "{"){
        document.getElementById("js").setRangeText('\n  \n}', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd)
    }
    
    
    
    
})
let btn;
filesName.forEach(e=>{
    if(e){

    
  np = document.createElement('p')
  btn = document.createElement('button')
  btn.innerHTML = e
  btn.addEventListener('click', ()=>{
    document.querySelector('textarea').value = files[e]
    document.querySelector('h5').innerText = e
  })
dbtn = document.createElement('button')
dbtn.innerHTML = "⬇️"
dbtn.title = "Click to download"
dbtn.addEventListener("click", ()=>{
    down(e)
})
  btn.addEventListener("dblclick", () => del(e, np))
  btn.title = "Click to open. Double click to delete"
  np.appendChild(btn)
  np.appendChild(dbtn)
  
  document.getElementById('file').appendChild(np)
}
})
function saveAs(){
    name = prompt('Input file name')
    if(name == "null" ||  name.split(",").length > 1){
 alert("⚠️Saved Unsuccessful")
        
        
    }else{
       document.querySelector('h5').innerText = name
    
        console.log(name)
        files[name] = $('textarea').val()
        filesName.push(name)
        localStorage.filename = filesName.toString()
        localStorage.files = JSON.stringify(files)
         np = document.createElement('p')
btn = document.createElement('button')
dbtn = document.createElement('button')
dbtn.innerHTML = "⬇️"
dbtn.title = "Click to download"
dbtn.addEventListener("click", ()=>{
    down(name)
})
btn.innerHTML = name
btn.addEventListener('click', ()=>{
document.querySelector('textarea').value = files[name]
document.querySelector('h5').innerText = name
})
btn.addEventListener("dblclick", () => del(name, np))
btn.title = "Click to open. Double click to delete"

np.appendChild(btn)
np.appendChild(dbtn)

document.getElementById('file').appendChild(np)
alert("Saved Successfully ✅")
    }
}
function save() {
    if(document.querySelector('h5').innerText == "*Untitled*"){
        saveAs()
    }else{
    files[document.querySelector('h5').innerText] = document.querySelector('textarea').value
    localStorage.files = JSON.stringify(files)
    console.log("dj")
    }
    alert("Saved Successfully")

}
function del(name, element){
    con = confirm("⚠️Are you sure you want to delete this file?")
    if(con){
        delete files[name]
        delete filesName[filesName.indexOf(name)]
        nf = []
        filesName.forEach(e=>{
            if(e){
                nf.push(e)
            }
        })
        filesName = nf
        localStorage.filename = filesName.toString()

        localStorage.files = JSON.stringify(files)
        console.log(element)
        element.remove()
        console.log("done")
    }else{
        alert("File is still avaliable✅😁")
    }
    
}
document.querySelector("textarea").addEventListener("keydown", (e)=>{

    if(e.ctrlKey){
        if(e.shiftKey){
            if(e.key == "S"){
                console.log("shv")
                saveAs()

            }
        }
        if(e.key == "s"){
            save()
        }
        
    }
})
let data;
let blob;
let url;
let a;
function down(filename){
    data = document.querySelector("textarea").value
    blob = new Blob([data], {type:"text/plain"});
    url = URL.createObjectURL(blob)
    a = document.createElement("a")
    a.href = url
    a.download = filename+".js"
    a.click()
    URL.revokeObjectURL(url)
}