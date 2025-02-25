import React, { useState, useEffect } from 'react';

enum STATUS {
    TO_DO,
    IN_PROGRESS,
    DONE
}
const statusClassMap = new Map<STATUS, string>();
statusClassMap.set(STATUS.TO_DO, "item-not-completed");
statusClassMap.set(STATUS.IN_PROGRESS, "item-doing");
statusClassMap.set(STATUS.DONE, "item-completed");
const initialStatus = {
    notes: [],
    selected: null
}

const ToDoList = () => {

    return (
        <div>
            <ToDoListController initialStatus={initialStatus}></ToDoListController>
        </div>
    );
}
const ToDoListController = ({ initialStatus }) => {
    const [state, setState] = useState(initialStatus);
    useEffect(() => {
        fetch("./notes.json").then(response => response.json())
            .then(data => setState(prev => ({ ...prev, notes: data.notes.map(item => ({ ...item, status: STATUS.TO_DO })) })))
        return () => {

        };
    }, []);
    const onSelect = (note) => {

        setState(prev => ({ ...prev, selected: note }))
    }
    const onStatusChange = (newStatus: STATUS, itemId: Number) => {
        setState(prev => ({ ...prev, notes: prev.notes.map(item => (item.id != itemId) ? item : { ...item, status: newStatus }) }))
    }
    const onSubmit = (event) => {
        event.preventDefault(); 
        if (state.selected) {
            setState(prev => ({ ...prev, selected: null, notes: prev.notes.map(item => (item.id != state.selected.id) ? item : { ...item, title: event.target[0].value, text: event.target[1].value }) }))
        }
    };
    const newNote = () => {
        const newNote = {
            "id": Math.random(),
            "title": "",
            "text": "",
            "status": STATUS.TO_DO
        }
        setState(prev => ({ ...prev, selected: newNote, notes: [...prev.notes, newNote] }));
    }
    return (
        <div>
            <ToDoListView notes={state.notes} selected={state.selected} onSelect={onSelect} onStatusChange={onStatusChange}></ToDoListView>
            {state.selected ? <ToDoListForm selected={state.selected} onSubmit={onSubmit}></ToDoListForm> :
                <button onClick={newNote}>New</button>
            }
        </div>
    );
}
const ToDoListView = ({ notes, selected, onSelect, onStatusChange }) => {


    return (
        <div>
            <ul>
                {notes.map(item =>
                    <li key={item.id} className={`${statusClassMap.get(item.status)} ${(item.id === selected?.id) ? "selectedNote" : ""}`}>
                        <h2>{item.title}</h2>
                        <p>{item.text}</p>
                        <button onClick={() => onSelect(item)}>Edit</button>
                        <button onClick={() => onStatusChange(STATUS.TO_DO, item.id)}>To do</button>
                        <button onClick={() => onStatusChange(STATUS.IN_PROGRESS, item.id)}>In progress</button>
                        <button onClick={() => onStatusChange(STATUS.DONE, item.id)}>Done</button>
                    </li>
                )}
            </ul>
        </div>
    );
}
const ToDoListForm = ({ selected, onSubmit }) => {
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" name="title" id="title" defaultValue={selected.title} />
                <input type="text" name="text" id="text" defaultValue={selected.text} />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default ToDoList;
