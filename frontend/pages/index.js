import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import MyMenu from '../components/menu';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    // Cookie related
    const [token, setToken] = useState('');
    const [hideInstruction, setHideInstruction] = useState(false);
    // App related
    const [todos, setTodos] = useState();
    const [inputTask, setInputTask] = useState('');
    const [loggedUser, setLoggedUser] = useState({});

    // API calls
    const getTodos = async (token) => {
        try {
            const response = await fetch('http://localhost:3000/todo/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) return data.todos;
            else throw new Error(data.error);
        } catch (error) {
            console.error('Error fetching todos:', error);
            return null;
        }
    }
    // TODO: add, complete, uncomplete, delete
    const postTodo = async (token, todoName) => {
        try {
            const response = await fetch('http://localhost:3000/todo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: todoName })
            });

            const data = await response.json();

            if (response.ok) return data;
            else throw new Error(data.error);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const updateTodo = async (token, todoId, completed) => {
        try {
            let url = completed === 1 ? `http://localhost:3000/todo/${todoId}` : `http://localhost:3000/todo/u/${todoId}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) return data;
            else throw new Error(data.error);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const deleteTodo = async (token, todoId) => {
        try {
            const response = await fetch(`http://localhost:3000/todo/${todoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) return data;
            else throw new Error(data.error);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Functions
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const setCookie = (name, value, days) => {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value}${expires}; path=/`;
    }

    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    const addTask = async (taskName) => {
        const addedTodo = await postTodo(token, taskName);

        if (addedTodo != null) {
            let addedTodoId = addedTodo.todoId;

            setTodos((prevTodos) => {
                const newTodo = { todoId: addedTodoId, name: taskName, completed: 0 };
                return [...prevTodos, newTodo];
            });
        }
    }

    function parseJwt(token) {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    const toggleCompleteTask = async (todoId, type) => {
        const updatedTodo = await updateTodo(token, todoId, type);

        if (updatedTodo != null) {
            let updatedTodoId = updatedTodo.todoId;

            setTodos(prevTodos => {
                const newTodos = [...prevTodos];
                let todoToUpdate = newTodos.find(todo => todo.todoId == updatedTodoId);
                if (todoToUpdate) todoToUpdate.completed = type;
                return newTodos;
            });
        }
    }

    const deleteTask = async (todoId) => {
        const deletedTodo = await deleteTodo(token, todoId);

        if (deletedTodo != null) {
            let deletedTodoId = deletedTodo.todoId;
            setTodos(prevTodos => prevTodos.filter(todo => todo.todoId != deletedTodoId));
        }
    }

    // Event Handlers
    const closeInstructionClicked = () => {
        setCookie('hideInstruction', true, 7);
        setHideInstruction(true);
    }

    const addTaskClicked = () => {
        if (inputTask) addTask(inputTask);
        setInputTask('');
    }

    const inputTaskKeyPressed = (e) => {
        if (e.key === 'Enter') {
            if (inputTask) addTask(inputTask);
            setInputTask('');
        }
    }

    const taskClicked = (e, todoId, type) => {
        if (e.shiftKey) {
            deleteTask(todoId);
        } else {
            toggleCompleteTask(todoId, type);
        }
    }

    // Logout
    useEffect(() => {
        if (router.query.logout && router.query.logout == 1) {
            setToken('');
            deleteCookie('token');
            setLoggedUser({});
            router.push('/login');
        }
    }, [router.query.logout]);

    // Pageload
    useEffect(() => {
        const storedToken = getCookie('token');
        const storedHideInstruction = getCookie('hideInstruction');

        if (storedHideInstruction) setHideInstruction(true);

        const checkToken = async () => {
            if (storedToken) {
                const todos = await getTodos(storedToken);
                if (todos) {
                    setTodos(todos);
                    setToken(storedToken);
                    setLoggedUser(parseJwt(storedToken));
                } else {
                    router.push('/login'); // Invalid token
                }
            } else {
                router.push('/login'); // Token is not set
            }

            setLoading(false);
        };

        checkToken();
    }, []);


    if (loading) {
        return (
            <>
                <Head>
                    <title>Todo App</title>
                    <meta name="description" content="This is my todo app" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className={styles.main}>
                    <div className={styles.loading}>Loading...</div>
                </main>
            </>);
    }

    return (
        <>
            <Head>
                <title>Todo App</title>
                <meta name="description" content="This is my todo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MyMenu user={loggedUser} />
            <main className={styles.main}>
                <div className={styles.todoApp}>
                    <div className={`${styles.instruction} ${hideInstruction ? styles.hidden : ""}`}>
                        <span className={styles.close} onClick={closeInstructionClicked}>X</span>
                        <article>
                            <h2>Instructions</h2>
                            <p>Click add or press Enter to create a new task.</p>
                            <p>Click to complete a task or undo a completed task.</p>
                            <p>Shift+Click to delete a task.</p>
                        </article>
                    </div>
                    <div className={styles.todoContainer}>
                        <section className={styles.inputContainer}>
                            <input className={styles.inputTask} type="text" placeholder="Add new task..." value={inputTask}
                                onChange={(e) => setInputTask(e.target.value)} onKeyUp={inputTaskKeyPressed} />
                            <button className={styles.addTask} onClick={addTaskClicked}>Add</button>
                        </section>
                        <section className={`${styles.listContainer} ${styles.noselect}`}>
                            <ul className={styles.activeList}>
                                {todos && todos.map(todo => {
                                    if (todo.completed === 0) {
                                        return <li onClick={(e) => taskClicked(e, todo.todoId, 1)} key={todo.todoId}>{todo.name}</li>
                                    }
                                })}
                            </ul>
                            <hr className={styles.seperator} />
                            <ul className={styles.completedList}>
                                {todos && todos.map(todo => {
                                    if (todo.completed === 1) {
                                        return <li onClick={(e) => taskClicked(e, todo.todoId, 0)} key={todo.todoId}>{todo.name}</li>
                                    }
                                })}
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}