import React, { useState, useRef } from 'react'

const ToDoApp = () => {
    return (
        <div>
            <h1>To Do App</h1>
            <ToDoAppController></ToDoAppController>
        </div>
    )
}
enum STATUS {
    COMPLETED,
    TO_DO,
    DOING,
}
type ListItem = {
    id: number,
    text: string,
    status: STATUS
}
const initialState: ListItem[] = [];

const ToDoAppController = () => {
    const [list, setList] = useState(initialState);

    const formInput = useRef();

    const onSubmit = () => {
        const value = formInput.current.value;
        if (value) {
            const newItem: ListItem = { id: Date.now(), text: value, status: STATUS.TO_DO };
            setList(() => [...list, newItem]);
        }
    }
    const onDelete = (id: Number) => {
        setList(() => list.filter(item => id != item.id))
    }

    const onDoing = (id: Number) => {

        setList(() => list.map(item => {
            if (item.id === id) {
                item.status = STATUS.DOING;
                return item;
            }
            else {
                return item;
            }
        }))
    }
    const onDone = (id: Number) => {
        setList(() => list.map(item => {
            if (item.id === id) {
                item.status = STATUS.COMPLETED;
                return item;
            }
            else {
                return item;
            }
        }))
    }
    return (
        <ToDoAppView list={list} onSubmit={onSubmit} formInput={formInput} onDelete={onDelete}
            onDoing={onDoing} onDone={onDone}
        ></ToDoAppView>
    );
}
interface ToDoAppViewProps {
    list: ListItem[];
    onSubmit: (event: React.FormEvent) => void;
    formInput: React.RefObject<HTMLInputElement>;
    onDelete: (id: number) => void;
    onDoing: (id: number) => void;
    onDone: (id: number) => void;

}
const statusClassMap = new Map<STATUS, string>();
statusClassMap.set(STATUS.COMPLETED, "item-completed");
statusClassMap.set(STATUS.DOING, "item-doing");
statusClassMap.set(STATUS.TO_DO, "item-not-completed");
const ToDoAppView: React.FC<ToDoAppViewProps> = ({ list, onSubmit, formInput, onDelete, onDoing, onDone }) => {
    return (
        <>
            <ul>
                {list.map((item) =>
                    <li key={`${item.id}`} className={statusClassMap.get(item.status)}>
                        {item.text}
                        <button onClick={() => onDoing(item.id)}>Doing</button>
                        <button onClick={() => onDone(item.id)}>Done</button>
                        <button onClick={() => onDelete(item.id)}>Delete</button>
                    </li>)}
            </ul>
            <form action={onSubmit} >
                <input name="text" type="text" ref={formInput} />
                <button type="submit">Add To Do</button>
            </form>
        </>
    );
}



export default ToDoApp