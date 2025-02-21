import React, { useState, useEffect } from 'react';
// const useFetch = async (url) => {
//     const response = await fetch(url);
//     return response;
// }
const Notes = () => {
    return (
        <div>
            <NotesController></NotesController>
        </div>
    );
}
const MAIN_URL = "notes.json";
const initialStatus = { notes: [], selected: null }
const NotesController = () => {

    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        fetch(MAIN_URL).then((response) => response.json()).then((data) => {

            setStatus((prevState) => ({ ...prevState, notes: data.notes }))
        })
        return () => {

        };
    }, []);

    function onSelect(selected) {
        setStatus((prevState) => ({ ...prevState, selected: selected }))
    }
    function onNew() {
        const newNote = {id:Math.random() , title: "", text: "" }
        setStatus((prevState) => ({ ...prevState, notes: [...prevState.notes, newNote], selected: newNote }))
    }
    function onSave({ title, text }) {
        setStatus((prevState) => ({
            ...prevState,
            notes: prevState.notes.map(item => item.id === prevState.selected.id ? { ...prevState.selected, title: title, text: text } : item), 
            selected: null
        }))
    }

    return (

        <div>
            <NotesView notes={status.notes} selected={status.selected} onSelect={onSelect}></NotesView>
            <NotesForm onSave={onSave} selected={status.selected}></NotesForm>
            <center>
                <button onClick={onNew} className="button">New note</button>
            </center>
        </div>
    );
}
const NotesView = ({ notes, selected, onSelect }) => {
    return (
        <div>
            <ul>
                {notes.map((item) =>
                    <li key={item.id} onClick={() => onSelect(item)} className={`${(item.id === selected?.id) ? "selected" : ""}`}>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                    </li>
                )}
            </ul>
        </div>
    );
}
const NotesForm = ({ onSave, selected }) => {
    const [title, setTitle] = useState(selected?.title || "");
    const [text, setText] = useState(selected?.text || "");

    useEffect(() => {
        setTitle(selected?.title || "");
        setText(selected?.text || "");
    }, [selected]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        onSave({ title, text }); // Pass data back
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />
                <br />
                <br />
                <input
                    type="text"
                    name="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Text"
                />
                <br />
                <br />
                <center>
                    <button type="submit" className="button button-orange">
                        Save
                    </button>
                </center>
            </form>
        </div>
    );
};

export default Notes;
