const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector('.popup-box');
const popupTitle = popupBox.querySelector('header p');
const closeIcon = popupBox.querySelector('header i');
const titleNote = popupBox.querySelector('input');
const descNote = popupBox.querySelector('textarea');
const addBtn = popupBox.querySelector('button');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const months = ['January', 'February', 'Maret', 'April', 'May', 'Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'Desember'];


let notesData = JSON.parse(localStorage.getItem('notes') || "[]");
let isUpdate = false, updateId;

function generateId() {
    return Math.random().toString(36).substring(2);
}

function handleSearch() {
    const searchText = searchInput.value.toLowerCase();
    const filteredNotes = notesData.filter(note => {
        return note.title.toLowerCase().includes(searchText) || note.body.toLowerCase().includes(searchText);
    });
    displayNotes(filteredNotes);
}

function displayNotes(notes) {
    let notesHTML = '';
    notes.forEach((note, index) => {
        notesHTML += `
            <li class="note">
                <div class="details">
                    <p>${note.title}</p>
                    <span>${note.body}</span>
                </div>
                <div class="bottom-content">
                    <span>${note.createdAt}</span>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                            <li onclick="updateNote(${index}, '${note.title}', '${note.body}')">
                                <i class="uil uil-pen"></i>Edit
                            </li>
                            <li onclick="deleteNote(${index})">
                                <i class="uil uil-trash"></i>Delete
                            </li>
                        </ul>
                    </div>
                </div>
            </li>`;
    });
    const addBoxParent = addBox.parentElement;
    addBoxParent.innerHTML = notesHTML;
    addBoxParent.insertBefore(addBox, addBoxParent.firstChild);
}

addBox.addEventListener('click', () => {
    titleNote.focus();
    popupBox.classList.add('show');
});

closeIcon.addEventListener('click', () => {
    isUpdate= false;
    titleNote.value = '';
    descNote.value ='';
    addBtn.innerText = 'Add Note';
    popupTitle.innerText = 'Add a new Note';
    popupBox.classList.remove('show');
});

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notesData));
}

function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notesData = JSON.parse(savedNotes);
    } else {
        notesData = [];
    }
}

window.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    displayNotes(notesData);
});

addBtn.addEventListener('click', handleAddButtonClick);

function handleAddButtonClick(event) {
    event.preventDefault();
    let noteTitle = titleNote.value;
    let noteDesc = descNote.value;
    const id = generateId();
    const archived = false;

    let isNoteExists = notesData.some(note => note.title === noteTitle && note.body === noteDesc);

    if (!isNoteExists && (noteTitle || noteDesc)) {
        let dateObj = new Date();
        let formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        let formattedDate = formatter.format(dateObj);

        let noteInfo = {
            id: id,
            title: noteTitle,
            body: noteDesc,
            createdAt: formattedDate,
            archived: archived 
        };

        if (!isUpdate){
            notesData.unshift(noteInfo);
        } else {
            isUpdate= false;
            notesData[updateId] = noteInfo;
        }
        
        saveNotes();
        closeIcon.click();
        showNotes();
    }
}

searchInput.addEventListener('input', handleSearch);

function deleteNote(noteId) {
    notesData.splice(noteId, 1);
    localStorage.setItem('notes', JSON.stringify(notesData));
    showNotes();
}

function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

function showNotes() {
    
    let notesHTML = '';
    notesData.forEach((note, index) => {
        let dateObj = new Date(note.createdAt);
        let formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        notesHTML += `
            <li class="note">
                <div class="details">
                    <p>${note.title}</p>
                    <span>${note.body}</span>
                </div>
                <div class="bottom-content">
                    <span>${formattedDate}</span>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                            <li onclick="updateNote(${index}, '${note.title}', '${note.body}')">
                                <i class="uil uil-pen"></i>Edit
                            </li>
                            <li onclick="deleteNote(${index})">
                                <i class="uil uil-trash"></i>Delete
                            </li>
                        </ul>
                    </div>
                </div>
            </li>`;
    });
   
    const addBoxParent = addBox.parentElement;
    addBoxParent.innerHTML = notesHTML;
    addBoxParent.insertBefore(addBox, addBoxParent.firstChild);
}

showNotes();

window.showMenu = function(elem) {
    elem.parentElement.classList.add('show');
    document.addEventListener('click', e => {
        if(e.target.tagName != 'I' || e.target != elem){
            elem.parentElement.classList.remove('show');
        }
    });
};

window.deleteNote = function(noteId) {
    notesData.splice(noteId, 1);
    localStorage.setItem('notes', JSON.stringify(notesData));
    showNotes();
};

window.updateNote= function(noteId, noteTitle, noteDesc){
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleNote.value = noteTitle;
    descNote.value = noteDesc;
    addBtn.innerText = 'Update Note';
    popupTitle.innerText = 'Update your Note';
};
