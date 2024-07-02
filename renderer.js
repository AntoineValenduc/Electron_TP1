document.getElementById("saveNote").addEventListener("click", () => {
    const noteContent = document.getElementById("noteInput").value;
    if (noteContent) {
        const result = window.electronAPI.saveNote(noteContent);
        if (result.success) {
            document.getElementById("noteInput").value = "";
            loadNotes();
        } else {
            alert("Error saving note: " + result.message);
        }
    }
});

function loadNotes() {
    const result = window.electronAPI.readNotes();
    if (result.success) {
        const notesDiv = document.getElementById("notes");
        notesDiv.innerHTML = "";
        const notes = result.notes
            .split("\n")
            .filter((note) => note.trim() !== "");
        notes.forEach((note) => {
            const noteDiv = document.createElement("div");
            noteDiv.className = "note";
            noteDiv.textContent = note;
            notesDiv.appendChild(noteDiv);
        });
    } else {
        alert("Error reading notes: " + result.message);
    }
}

loadNotes();
