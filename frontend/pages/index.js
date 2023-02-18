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

    // Event Handlers
    const closeInstruction = () => {
        setCookie('hideInstruction', true, 7);
        setHideInstruction(true);
    }

    const addTask = () => {
        if (inputTask) console.log(inputTask);
        setInputTask('');
        console.log(todos);
    }

    const completeTask = (e) => {
        console.log(e);
    }

    const uncompleteTask = (e) => {
        console.log(e);
    }

    useEffect(() => {
        // Check if the token is stored in a cookie
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
            // Cookie does not exist
            router.push('/login');
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

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
                        <span className={styles.close} onClick={closeInstruction}>X</span>
                        <article>
                            <h2>Instructions</h2>
                            <p>Click add or press Enter to create a new task.</p>
                            <p>Click to complete a task or undo a completed task.</p>
                            <p>Shift+Click to delete a task.</p>
                        </article>
                    </div>
                    <div className={styles.todoContainer}>
                        <section className={styles.inputContainer}>
                            <input className={styles.inputTask} type="text" placeholder="Add new task.." value={inputTask}
                                onChange={(e) => setInputTask(e.target.value)} />
                            <button className={styles.addTask} onClick={addTask}>Add</button>
                        </section>
                        <section className={`${styles.listContainer} ${styles.noselect}`}>
                            <ul className={styles.activeList}>
                                {todos && todos.map(todo => {
                                    if (todo.completed === 0) {
                                        return <li onClick={() => completeTask(todo.todoId)} key={todo.todoId}>{todo.name}</li>
                                    }
                                })}
                            </ul>
                            <hr className={styles.seperator} />
                            <ul className={styles.completedList}>
                                {todos && todos.map(todo => {
                                    if (todo.completed === 1) {
                                        return <li onClick={() => uncompleteTask(todo.todoIdu)} key={todo.todoId}>{todo.name}</li>
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
