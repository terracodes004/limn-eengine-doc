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
    try {
        let { data: { session }, error } = await supabase.auth.getSession();
        if (!session) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const retryResult = await supabase.auth.getSession();
            session = retryResult.data.session;
        }
        return session;
    } catch (err) {
        console.error("Auth check failed:", err);
        return null;
    }
}

async function loadUserData() {
    const session = await checkAuth();
    if (session) {
        try {
            const userId = session.user.id;
            const { data, error } = await supabase
                .from('user_documents')
                .select('files, filenames')
                .eq('user_id', userId)
                .maybeSingle();

            if (data) {
                files = data.files || {};
                filesName = data.filenames || [];
            }
        } catch (err) {
            console.error("Cloud load failed, falling back to local storage:", err);
        }
    }

    if (!filesName || filesName.length === 0) {
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
    }

    const fileContainer = document.getElementById('file');
    if (fileContainer) fileContainer.innerHTML = '';

    filesName.forEach(e => {
        if (e) {
            createFileUI(e);
        }
    });
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
        const textarea = document.querySelector('textarea');
        const h5 = document.querySelector('h5');
        if (textarea) textarea.value = files[name] || "";
        if (h5) h5.innerText = name;
    });
    
    btn.addEventListener("dblclick", () => del(name, np));

    dbtn = document.createElement('button');
    dbtn.innerHTML = "⬇️";
    dbtn.title = "Click to download";
    dbtn.addEventListener("click", () => down(name));

    np.appendChild(btn);
    np.appendChild(dbtn);
    
    const fileListEl = document.getElementById('file');
    if (fileListEl) fileListEl.appendChild(np);
}

async function persistData() {
    const session = await checkAuth();
    if (session) {
        try {
            await supabase.from('user_documents').upsert({
                user_id: session.user.id,
                files: files,
                filenames: filesName,
                updated_at: new Date()
            }, { onConflict: 'user_id' });
        } catch (err) {
            console.error("Cloud sync failed, saving locally:", err);
        }
    }
    localStorage.setItem("filename", filesName.join(","));
    localStorage.setItem("files", JSON.stringify(files));
}

window.saveAs = async function() {
    const session = await checkAuth();
    if (!session) {
        alert("⚠️ You must sign up or log in to save your files!");
        window.location.href = "/signup/frontend/index.html";
        return;
    }

    let name = prompt('Input file name');
    if (name === null || name.trim() === "" || name.includes(",")) {
        alert("⚠️ Save Unsuccessful (Invalid name or contains commas)");
        return;
    }

    const h5 = document.querySelector('h5');
    const textarea = document.querySelector('textarea');
    
    if (h5) h5.innerText = name;
    if (textarea) {
        files[name] = textarea.value;
    }

    if (!filesName.includes(name)) {
        filesName.push(name);
    }
    
    await persistData();
    createFileUI(name);
    alert("Saved Successfully ✅");
};

window.save = async function() {
    const session = await checkAuth();
    if (!session) {
        alert("⚠️ You must sign up or log in to save your files!");
        window.location.href = "/signup/frontend/index.html";
        return;
    }

    const h5 = document.querySelector('h5');
    const textarea = document.querySelector('textarea');
    let currentFileName = h5 ? h5.innerText : "*Untitled*";

    if (currentFileName === "*Untitled*" || !currentFileName) {
        window.saveAs();
    } else {
        if (textarea) {
            files[currentFileName] = textarea.value;
        }
        await persistData();
        alert("Saved Successfully ✅");
    }
};

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

const textareaEl = document.querySelector("textarea");
if (textareaEl) {
    textareaEl.addEventListener("keydown", (e) => {
        if (e.ctrlKey) {
            if (e.shiftKey && (e.key === "S" || e.key === "s")) {
                e.preventDefault();
                window.saveAs();
            } else if (e.key === "s" || e.key === "S") {
                e.preventDefault();
                window.save();
            }
        }
    });
}

window.down = function(filename) {
    const textarea = document.querySelector("textarea");
    const data = textarea ? textarea.value : "";
    const blob = new Blob([data], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith('.js') ? filename : filename + ".js";
    a.click();
    URL.revokeObjectURL(url);
};
            
