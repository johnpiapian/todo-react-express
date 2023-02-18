import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Cookie related
    const [token, setToken] = useState('');
    const [hideInstruction, setHideInstruction] = useState(false);

    // App related
    const [todos, setTodos] = useState([]);
    const [inputTask, setInputTask] = useState('');

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

    const toggleCompleteTask = (todoId, type) => {
        setTodos(prevTodos => {
            const newTodos = [...prevTodos];
            let todoToUpdate = newTodos.find(todo => todo.todoId === todoId);
            if (todoToUpdate) todoToUpdate.completed = type;
            return newTodos;
        });
    }

    const deleteTask = (todoId) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.todoId !== todoId));
    }

    const addTask = (taskName) => {
        let lastTodoId = todos[todos.length - 1].todoId;
        let newTodo = { todoId: lastTodoId + 1, name: taskName, completed: 0 };

        setTodos([...todos, newTodo]);
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
        if(e.key === 'Enter') {
            if (inputTask) addTask(inputTask);
            setInputTask('');
        }
    }

    const taskClicked = (e, todoId, type) => {
        if(e.shiftKey) {
            deleteTask(todoId);
        } else {
            toggleCompleteTask(todoId, type);
        }
    }

    useEffect(() => {
        const storedToken = getCookie('token');
        const storedHideInstruction = getCookie('hideInstruction');

        if (storedHideInstruction) setHideInstruction(true);

        if (storedToken) {
            setToken(storedToken);

            // Make a fetch request to the backend API
            fetch('http://localhost:3000/todo/', {
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Login failed!`);
                    }
                    return res.json();
                })
                .then(data => {
                    // Display the data
                    // console.log(data);
                    setTodos(data.todos);
                })
                .catch(err => {
                    router.push('/login');
                });
        } else {
            router.push('/login');
            return;
        }

        setLoading(false);
    }, []);

    
    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Head>
                <title>Todo App</title>
                <meta name="description" content="This is my todo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
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
