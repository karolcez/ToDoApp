import React, { useRef, useEffect, useReducer, useContext, createContext } from 'react'
import { ListItem, STATUS } from './Collections.tsx';
import { IFetchAPI, AxiosAPI } from './FetchAPI.tsx';

type State = {
    list: ListItem[]
}

enum ActionType {
    addToList,
    removeFromList,
    listItemStatusUpdate
};

const statusClassMap = new Map<STATUS, string>();
statusClassMap.set(STATUS.COMPLETED, "item-completed");
statusClassMap.set(STATUS.DOING, "item-doing");
statusClassMap.set(STATUS.TO_DO, "item-not-completed");

const stateReducer = (
    state: State,
    action: { payload: { list?: ListItem[]; id?: number; newStatus?: STATUS }; type: ActionType }
): State => {
    switch (action.type) {
        case ActionType.addToList:
            return {
                ...state,
                list: action.payload.list ? state.list.concat(action.payload.list) : state.list,
            };

        case ActionType.removeFromList:
            return {
                ...state,
                list: state.list.filter((item) => item.id !== action.payload.id),
            };

        case ActionType.listItemStatusUpdate:
            return {
                ...state,
                list: state.list.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, status: (action.payload.newStatus ? action.payload.newStatus : STATUS.TO_DO) }
                        : item
                ),
            };

        default:
            return state;
    }
};

const Context = createContext();

const ToDoApp = () => {
    const initialState: State = { list: [] };
    const url = "./database/todo.json";
    const [state, dispatch] = useReducer(stateReducer, initialState);
    useEffect(() => {
        const fetchAPI: IFetchAPI = new AxiosAPI(url);
        const controller = new AbortController();

        fetchAPI.getList(controller.signal)
            .then(list => dispatch({ payload: { list }, type: ActionType.addToList }))
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Fetch error:", error);
                }
            });

        return () => {
            controller.abort();
        };
    }, [url]);

    return (
        <Context.Provider value={{ list: state.list, dispatch }}>
            <h1>To Do App</h1>
            {/* <ToDoAppController list={state.list} dispatch={dispatch}></ToDoAppController> */}
            <ToDoAppController></ToDoAppController>
        </Context.Provider>
    )
}


const ToDoAppController = () => {
    const context = useContext(Context);
    const { dispatch, list } = { ...context };
    const formInput = useRef();

    const onSubmit = () => {
        const value = formInput.current.value;
        if (value) {
            const newItem: ListItem = { id: Date.now(), text: value, status: STATUS.TO_DO };
            dispatch({ payload: { list: [newItem] }, type: ActionType.addToList });
        }
    }
    const onDelete = (id: Number) => {
        dispatch({ payload: { id: id }, type: ActionType.removeFromList });
    }

    const onDoing = (id: Number) => {
        dispatch({ payload: { id: id, newStatus: STATUS.DOING }, type: ActionType.listItemStatusUpdate });
    }
    const onDone = (id: Number) => {
        dispatch({ payload: { id: id, newStatus: STATUS.COMPLETED }, type: ActionType.listItemStatusUpdate });
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

