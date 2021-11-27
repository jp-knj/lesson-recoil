import React from 'react';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const todoListState = atom({
    key: 'todoListState',
    default: [],
});

export interface Todo {
    id: string
    text: string
    isCompleted: boolean
}

function TodoItemCreator() {
    const [inputValue, setInputValue] = React.useState('');
    const setTodoList = useSetRecoilState(todoListState);

    const addItem = () => {
        // @ts-ignore
        setTodoList((oldTodoList) => [
            ...oldTodoList,
            {
                id: getId(),
                text: inputValue,
                isComplete: false,
            },
        ]);
        setInputValue('');
    };

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(ev.target.value);
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={handleChange} />
            <button onClick={addItem}>Add</button>
        </div>
    );
}

// utility for creating unique Id
let id = 0;
function getId() {
    return id++;
}

// @ts-ignore
function TodoItem({item}) {
    const [todoList, setTodoList] = useRecoilState(todoListState);
    const index = todoList.findIndex((listItem) => listItem === item);

    const handleEditItemText = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const newList = replaceItemAtIndex(todoList, index, {
            ...item,
            text: ev.target.value,
        });

        // @ts-ignore
        setTodoList(newList);
    };

    const toggleItemCompletion = () => {
        const newList = replaceItemAtIndex(todoList, index, {
            ...item,
            isComplete: !item.isComplete,
        });

        // @ts-ignore
        setTodoList(newList);
    };

    const deleteItem = () => {
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

// @ts-ignore
function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

// @ts-ignore
function removeItemAtIndex(arr, index) {
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
    //@ts-ignore
    const updateFilter = ({target: {value}}) => {
        setFilter(value);
    };

    return (
        <>
            Filter:
            <select value={filter} onChange={updateFilter}>
                <option value="Show All">All</option>
                <option value="Show Completed">Completed</option>
                <option value="Show Uncompleted">Uncompleted</option>
            </select>
        </>
    );
}

function TodoList() {
    const todoList = useRecoilValue(todoListState);

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
