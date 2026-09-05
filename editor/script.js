import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pjtpesdhjfvcidfkxord.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdHBlc2RoamZ2Y2lkZmt4b3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDUyNDUsImV4cCI6MjEwMzcyMTI0NX0.110aDXEqJ4PxjKWNv1Z2YNR8frklg3WW1u0HePDoN38';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let files = {};
let filesName = [];
let np;
let dbtn;
let btn;

async function checkAuth() {
    let { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const retryResult = await supabase.auth.getSession();
        session = retryResult.data.session;
    }
    return session;
}

async function loadUserData() {
    const session = await checkAuth();
    if (session) {
        const userId = session.user.id;
        const { data, error } = await supabase
            .from('user_documents')
            .select('files, filenames')
            .eq('user_id', userId)
            .maybeSingle();

        if (data) {
            files = data.files || {};
            filesName = data.filenames || [];
            
            const fileContainer = document.getElementById('file');
            if (fileContainer) fileContainer.innerHTML = '';
            
            filesName.forEach(e => {
                if (e) {
                    createFileUI(e);
                }
            });
        }
    } else {
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

        filesName.forEach(e => {
            if (e) {
                createFileUI(e);
            }
        });
    }
}

loadUserData();

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

async function persistData() {
    const session = await checkAuth();
    if (session) {
        await supabase.from('user_documents').upsert({
            user_id: session.user.id,
            files: files,
            filenames: filesName,
            updated_at: new Date()
        }, { onConflict: 'user_id' });
    } else {
        localStorage.setItem("filename", filesName.join(","));
        localStorage.setItem("files", JSON.stringify(files));
    }
}

async function saveAs() {
    const session = await checkAuth();
    if (!session) {
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
        
        await persistData();
        createFileUI(name);
        alert("Saved Successfully ✅");
    }
}

async function save() {
    const session = await checkAuth();
    if (!session) {
        alert("⚠️ You must sign up or log in to save your files!");
        window.location.href = "/signup/frontend/index.html";
        return;
    }

    let currentFileName = document.querySelector('h5').innerText;
    if (currentFileName === "*Untitled*" || !currentFileName) {
        saveAs();
    } else {
        files[currentFileName] = document.querySelector('textarea').value;
        await persistData();
        alert("Saved Successfully ✅");
    }
}

async function del(name, element) {
    let con = confirm("⚠️ Are you sure you want to delete this file?");
    if (con) {
        delete files[name];
        filesName = filesName.filter(e => e !== name);
        
        await persistData();
        
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
