import './App.css';
import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import {notesCollection, db} from "./firebase"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';

function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("");
    const [tempNoteText, setTempNoteText] = React.useState("");

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    const sortedNotes = notes.sort((a,b) => b.updatedAt - a.updatedAt);


    React.useEffect(() => {
    //   localStorage.setItem("notes", JSON.stringify(notes))
        const unSubscribe = onSnapshot(notesCollection, function(snapShot){
            const notesArr = snapShot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr);
        })
        return unSubscribe;
    }, [])

    React.useEffect(() => {
        (!currentNoteId) && setCurrentNoteId(notes[0]?.id)
    }, [notes])

    React.useEffect(() => (
        currentNote && setTempNoteText(currentNote.body)
    ),[currentNote])

    React.useEffect(() => {
        const timeOutId = setTimeout(() => {
            (tempNoteText!= currentNote.body) && updateNote(tempNoteText);
        }, 500);

        return () => clearTimeout(timeOutId);
    }, [tempNoteText])
    
    async function createNewNote() {

        // without firebase
        // const newNote = {
        //     id: nanoid(),
        //     body: "# Type your markdown note's title here"
        // }
        // setNotes(prevNotes => [newNote, ...prevNotes])
        // setCurrentNoteId(newNote.id)

        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id)
    }

    async function deleteNote(noteId){
        // setNotes(oldNotes => oldNotes.filter((note) => note.id != noteId))

        const docRef = doc(db, "notes", noteId);
        await deleteDoc(docRef);
    }
    
    async function updateNote(text) {
        // setNotes(oldNotes => {
        //     let newArray = []
        //     for(let i = 0; i < oldNotes.length; i++){
        //         if(oldNotes[i].id === currentNoteId){
        //             newArray.unshift({ ...oldNotes[i], body: text })
        //         }
        //         else{
        //             newArray.push(oldNotes[i])
        //         }
        //     }
        //     return newArray;
        // })

        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))
        const docRef = doc(db, "notes", currentNoteId);
        await setDoc(docRef, { body : text , updatedAt : Date.now() }, { merge : true });
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                <Editor 
                    tempNoteText={tempNoteText} 
                    setTempNoteText={setTempNoteText} 
                />
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
        }
        </main>
  );
}

export default App;
