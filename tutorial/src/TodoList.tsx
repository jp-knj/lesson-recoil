import React from 'react';
import type { RecoilState } from 'recoil'
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

export type Todo = {
    id: string
    text: string
    isCompleted: boolean
}

const todoListState = atom({
    key: 'todoListState',
    default: [],
});

function TodoItemCreator() {
    const [inputValue, setInputValue] = React.useState('');
    const setTodoList = useSetRecoilState(todoListState);

    let id:number = 0;
    function getId():number {
        return id++;
    }

    // const addItem = () => {
    //     setTodoList( oldTodoList => [
    //         ...oldTodoList,
    //         {
    //             id: getId(),
    //             text: inputValue,
    //             isComplete: false,
    //         },
    //     ]);
    //     setInputValue('');
    // };
    const handleClick = (ev:React.MouseEvent<HTMLButtonElement>) => {
        setTodoList(currVal => [...currVal, {}])

    }

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(ev.target.value);
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={handleChange} />
            <button onClick={handleClick}>Add</button>
        </div>
    );
}



function TodoItem({item}:any) {
    const [todoList, setTodoList] = useRecoilState(todoListState);
    const index = todoList.findIndex((listItem) => console.log(listItem));
    const handleEditItemText = (ev: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const newList = replaceItemAtIndex(todoList, index, {
            ...item,
            text: ev.target.value,
        });

        // @ts-ignore
        setTodoList(newList);
    };

    const toggleItemCompletion = () => {
        // @ts-ignore
        const newList = replaceItemAtIndex(todoList, index, {
            ...item,
            isComplete: !item.isComplete,
        });

        // @ts-ignore
        setTodoList(newList);
    };

    const deleteItem = () => {
        // @ts-ignore
        const newList = removeItemAtIndex(todoList, index);

        // @ts-ignore
        setTodoList(newList);
    };
    return (
        <div>
            <input type="text" value={item.text} onChange={handleEditItemText} />
            <input
                type="checkbox"
                checked={item.isComplete}
                onChange={toggleItemCompletion}
            />
            <button onClick={deleteItem}>X</button>
        </div>
    );
}
function replaceItemAtIndex(arr: [], index: number, newValue:[]) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr:[], index:number) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

const todoListFilterState = atom({
    key: 'todoListFilterState',
    default: 'Show All',
});

const todoListStatsState = selector({
    key: 'todoListStatsState',
    get: ({get}) => {
        const todoList = get(todoListState);
        const totalNum = todoList.length;
        //@ts-ignore
        const totalCompletedNum:number = todoList.filter((item) => item.isComplete).length;
        const totalUncompletedNum = totalNum - totalCompletedNum;
        const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum * 100;

        return {
            totalNum,
            totalCompletedNum,
            totalUncompletedNum,
            percentCompleted,
        };
    },
});

const filteredTodoListState = selector({
    key: 'filteredTodoListState',
    get: ({get}) => {
        const filter = get(todoListFilterState);
        const list = get(todoListState);

        switch (filter) {
            case 'Show Completed':
                // @ts-ignore
                return list.filter((item) => item.isComplete);
            case 'Show Uncompleted':
                // @ts-ignore
                return list.filter((item) => !item.isComplete);
            default:
                return list;
        }
    },
});

function TodoListStats() {
    const {
        totalNum,
        totalCompletedNum,
        totalUncompletedNum,
        percentCompleted,
    } = useRecoilValue(todoListStatsState);

    const formattedPercentCompleted = Math.round(percentCompleted);

    return (
        <ul>
            <li>Total items: {totalNum}</li>
            <li>Items completed: {totalCompletedNum}</li>
            <li>Items not completed: {totalUncompletedNum}</li>
            <li>Percent completed: {formattedPercentCompleted}</li>
        </ul>
    );
}

function TodoListFilters() {
    const [filter, setFilter] = useRecoilState(todoListFilterState);

    const handleUpdateFilter = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(ev.target.value);
    };

    return (
        <>
            Filter:
            <select value={filter} onChange={handleUpdateFilter}>
                <option value="Show All">All</option>
                <option value="Show Completed">Completed</option>
                <option value="Show Uncompleted">Uncompleted</option>
            </select>
        </>
    );
}

function TodoList() {
    const todoList = useRecoilValue(filteredTodoListState);

    return (
        <>
            <TodoListStats />
            <TodoListFilters />
            <TodoItemCreator />
            {todoList.map((todoItem) => (
                // @ts-ignore
                <TodoItem key={todoItem.id} item={todoItem} />
            ))}
        </>
    );
}

export default TodoList;
