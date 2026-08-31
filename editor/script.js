let files = {};
let filesName = [];

if (!localStorage.files || !localStorage.filename) {
    localStorage.files = JSON.stringify({});
    localStorage.filename = "";
    files = {};
    filesName = [];
} else {
    try {
        files = JSON.parse(localStorage.getItem("files")) || {};
    } catch (e) {
        files = {};
    }
    let rawNames = localStorage.getItem("filename");
    filesName = rawNames ? rawNames.split(",") : [];
}

let np;
let dbtn;
let btn;

function checkAuth() {
    return localStorage.getItem("isLoggedIn") === "true"; 
}

document.getElementById("js").addEventListener('keypress', (e) => {
    console.log(e.key);
    
    if (e.key === "(") {
        document.getElementById("js").setRangeText(')', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd);
    }
    if (e.key === "<") {
        document.getElementById("js").setRangeText('>', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd);
    }
    if (e.key === "\"") {
        document.getElementById("js").setRangeText('\"', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd);
    }
    if (e.key === "\'") {
        document.getElementById("js").setRangeText('\'', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd);
    }
    if (e.key === "[") {
        document.getElementById("js").setRangeText(']', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd);
    }
    if (e.key === "{") {
        document.getElementById("js").setRangeText('\n  \n}', document.getElementById("js").selectionStart, document.getElementById("js").selectionEnd);
    }
});

filesName.forEach(e => {
    if (e) {
        np = document.createElement('p');
        btn = document.createElement('button');
        btn.innerHTML = e;
        btn.addEventListener('click', () => {
            document.querySelector('textarea').value = files[e];
            document.querySelector('h5').innerText = e;
        });
        
        dbtn = document.createElement('button');
        dbtn.innerHTML = "⬇️";
        dbtn.title = "Click to download";
        dbtn.addEventListener("click", () => {
            down(e);
        });
        
        btn.addEventListener("dblclick", () => del(e, np));
        btn.title = "Click to open. Double click to delete";
        
        np.appendChild(btn);
        np.appendChild(dbtn);
        
        document.getElementById('file').appendChild(np);
    }
});

function saveAs() {
    if (!checkAuth()) {
        alert("⚠️ You must sign up or log in to save your files!");
        window.location.href = "../Signup%20page/frontend/index.html";
        return;
    }

    let name = prompt('Input file name');
    if (name === null || name.trim() === "" || name.split(",").length > 1) {
        alert("⚠️ Saved Unsuccessful");
    } else {
        document.querySelector('h5').innerText = name;
    
        files[name] = document.querySelector('textarea').value;
        filesName.push(name);
        localStorage.filename = filesName.toString();
        localStorage.files = JSON.stringify(files);
        
        np = document.createElement('p');
        btn = document.createElement('button');
        dbtn = document.createElement('button');
        dbtn.innerHTML = "⬇️";
        dbtn.title = "Click to download";
        dbtn.addEventListener("click", () => {
            down(name);
        });
        
        btn.innerHTML = name;
        btn.addEventListener('click', () => {
            document.querySelector('textarea').value = files[name];
            document.querySelector('h5').innerText = name;
        });
        btn.addEventListener("dblclick", () => del(name, np));
        btn.title = "Click to open. Double click to delete";

        np.appendChild(btn);
        np.appendChild(dbtn);

        document.getElementById('file').appendChild(np);
        alert("Saved Successfully ✅");
    }
}

function save() {
    if (!checkAuth()) {
        alert("⚠️ You must sign up or log in to save your files!");
        window.location.href = "../Signup%20page/frontend/index.html";
        return;
    }

    let currentFileName = document.querySelector('h5').innerText;
    if (currentFileName === "*Untitled*") {
        saveAs();
    } else {
        files[currentFileName] = document.querySelector('textarea').value;
        localStorage.files = JSON.stringify(files);
        alert("Saved Successfully");
    }
}

function del(name, element) {
    let con = confirm("⚠️ Are you sure you want to delete this file?");
    if (con) {
        delete files[name];
        filesName = filesName.filter(e => e !== name);
        
        localStorage.filename = filesName.toString();
        localStorage.files = JSON.stringify(files);
        
        element.remove();
        console.log("done");
    } else {
        alert("File is still available ✅😁");
    }
}

document.querySelector("textarea").addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        if (e.shiftKey) {
            if (e.key === "S" || e.key === "s") {
                saveAs();
            }
        } else if (e.key === "s") {
            save();
        }
    }
});

let data;
let blob;
let url;
let a;

function down(filename) {
    data = document.querySelector("textarea").value;
    blob = new Blob([data], { type: "text/plain" });
    url = URL.createObjectURL(blob);
    a = document.createElement("a");
    a.href = url;
    a.download = filename + ".js";
    a.click();
    URL.revokeObjectURL(url);
}

