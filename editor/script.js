let files = {};
let filesName = [];

if (!localStorage.getItem("files") || !localStorage.getItem("filename")) {
    localStorage.setItem("files", JSON.stringify({}));
    localStorage.setItem("filename", "");
    files = {};
    filesName = [];
} else {
    try {
        files = JSON.parse(localStorage.getItem("files")) || {};
    } catch (e) {
        files = {};
    }
    let rawNames = localStorage.getItem("filename");
    filesName = rawNames ? rawNames.split(",").filter(Boolean) : [];
}

let np;
let dbtn;
let btn;

function checkAuth() {
    return localStorage.getItem("isLoggedIn") === "true"; 
}

const editor = document.getElementById("js");
if (editor) {
    editor.addEventListener('keydown', (e) => {
        const pairs = {
            '(': ')',
            '<': '>',
            '"': '"',
            "'": "'",
            '[': ']'
        };

        if (pairs[e.key]) {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.setRangeText(pairs[e.key], start, end, 'preserve');
        } else if (e.key === "{") {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.setRangeText('\n  \n}', start, end, 'preserve');
        }
    });
}

filesName.forEach(e => {
    if (e) {
        createFileUI(e);
    }
});

function createFileUI(name) {
    np = document.createElement('p');
    btn = document.createElement('button');
    btn.innerHTML = name;
    btn.title = "Click to open. Double click to delete";
    
    btn.addEventListener('click', () => {
        document.querySelector('textarea').value = files[name] || "";
        document.querySelector('h5').innerText = name;
    });
    
    btn.addEventListener("dblclick", () => del(name, np));

    dbtn = document.createElement('button');
    dbtn.innerHTML = "⬇️";
    dbtn.title = "Click to download";
    dbtn.addEventListener("click", () => down(name));

    np.appendChild(btn);
    np.appendChild(dbtn);
    
    document.getElementById('file').appendChild(np);
}

function saveAs() {
    if (!checkAuth()) {
        alert("⚠️ You must sign up or log in to save your files!");
        window.location.href = "/signup/frontend/index.html";
        return;
    }

    let name = prompt('Input file name');
    if (name === null || name.trim() === "" || name.includes(",")) {
        alert("⚠️ Save Unsuccessful (Invalid name or contains commas)");
    } else {
        document.querySelector('h5').innerText = name;
    
        files[name] = document.querySelector('textarea').value;
        if (!filesName.includes(name)) {
            filesName.push(name);
        }
        
        localStorage.setItem("filename", filesName.join(","));
        localStorage.setItem("files", JSON.stringify(files));
        
        createFileUI(name);
        alert("Saved Successfully ✅");
    }
}

function save() {
    if (!checkAuth()) {
        alert("⚠️ You must sign up or log in to save your files!");
        window.location.href = "/signup/frontend/index.html";
        return;
    }

    let currentFileName = document.querySelector('h5').innerText;
    if (currentFileName === "*Untitled*" || !currentFileName) {
        saveAs();
    } else {
        files[currentFileName] = document.querySelector('textarea').value;
        localStorage.setItem("files", JSON.stringify(files));
        alert("Saved Successfully ✅");
    }
}

function del(name, element) {
    let con = confirm("⚠️ Are you sure you want to delete this file?");
    if (con) {
        delete files[name];
        filesName = filesName.filter(e => e !== name);
        
        localStorage.setItem("filename", filesName.join(","));
        localStorage.setItem("files", JSON.stringify(files));
        
        element.remove();
        console.log("File deleted");
    } else {
        alert("File is still available ✅😁");
    }
}

document.querySelector("textarea").addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        if (e.shiftKey && (e.key === "S" || e.key === "s")) {
            e.preventDefault();
            saveAs();
        } else if (e.key === "s" || e.key === "S") {
            e.preventDefault();
            save();
        }
    }
});

function down(filename) {
    const data = document.querySelector("textarea").value;
    const blob = new Blob([data], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith('.js') ? filename : filename + ".js";
    a.click();
    URL.revokeObjectURL(url);
}
