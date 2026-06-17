
let filesName = localStorage.filename ? localStorage.filename.split(',').filter(Boolean) : [];
let files = localStorage.files ? JSON.parse(localStorage.files) : {};


document.getElementById("js").addEventListener('keypress', (e)=>{
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


let dbtn;
let btn;


filesName.forEach(e => {
    if (e) {
        createFileUIElement(e);
    }
});

// Helper Function to cleanly generate Sidebar File Items
function createFileUIElement(fileNameStr) {
    let np = document.createElement('p');
    let fileBtn = document.createElement('button');
    fileBtn.innerHTML = fileNameStr;
    
    fileBtn.addEventListener('click', () => {
        document.querySelector('textarea').value = files[fileNameStr] || "";
        document.querySelector('h5').innerText = fileNameStr;
    });

    let downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = "⬇️";
    downloadBtn.title = "Click to download";
    downloadBtn.addEventListener("click", () => {
        down(fileNameStr);
    });

    fileBtn.addEventListener("dblclick", () => del(fileNameStr, np));
    fileBtn.title = "Click to open. Double click to delete";
    
    np.appendChild(fileBtn);
    np.appendChild(downloadBtn);
    document.getElementById('file').appendChild(np);
}

// SAVE AS FUNCTION
function saveAs() {
    let name = prompt('Input file name');
    
    if (!name || name.trim() === "" || name === "null" || name.split(",").length > 1) {
        alert("⚠️ Save Unsuccessful: Invalid file name.");
        return;
    }

    name = name.trim();

    if (!filesName.includes(name)) {
        filesName.push(name);
    }
    
    files[name] = document.querySelector('textarea').value;
    localStorage.filename = filesName.toString();
    localStorage.files = JSON.stringify(files);
    
    document.querySelector('h5').innerText = name;

    createFileUIElement(name);
    alert("Saved Successfully ✅");
}

// QUICK SAVE FUNCTION
function save() {
    let currentFileName = document.querySelector('h5').innerText;
    
    if (currentFileName === "*Untitled*" || currentFileName.trim() === "") {
        saveAs();
    } else {
        files[currentFileName] = document.querySelector('textarea').value;
        localStorage.files = JSON.stringify(files);
        alert("Saved Successfully ✅");
    }
}

// DELETE FUNCTION
function del(name, element) {
    let con = confirm("⚠️ Are you sure you want to delete this file?");
    if (con) {
        delete files[name];
        filesName = filesName.filter(e => e !== name);
        localStorage.filename = filesName.toString();
        localStorage.files = JSON.stringify(files);
        
        element.remove();
        
        if (document.querySelector('h5').innerText === name) {
            document.querySelector('h5').innerText = "*Untitled*";
            document.querySelector('textarea').value = "";
        }
    } else {
        alert("File is still available ✅😁");
    }
}

// GLOBAL SHORTCUT CONTROLLER (Intercepts browser saves securely)
document.querySelector("textarea").addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        if (e.shiftKey && (e.key === "S" || e.key === "s")) {
            e.preventDefault(); 
            saveAs();
        } 
        else if (e.key === "s" || e.key === "S") {
            e.preventDefault(); 
            save();
        }
    }
});

// DOWNLOAD LAYER
function down(filename) {
    let data = document.querySelector("textarea").value;
    let blob = new Blob([data], {type: "text/plain"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename + ".js";
    a.click();
    URL.revokeObjectURL(url);
}
