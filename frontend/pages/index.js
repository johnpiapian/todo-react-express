import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';
import MyMenu from '../components/menu';
import Header from '../components/header';
import { API_URL } from '@/config/base';

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    // Storage related
    const [token, setToken] = useState('');
    const [hideInstruction, setHideInstruction] = useState(false);
    // App related
    const [todos, setTodos] = useState();
    const [inputTask, setInputTask] = useState('');
    const [loggedUser, setLoggedUser] = useState({});

    // API calls
    const getTodos = async (token) => {
        try {
            const response = await fetch(`${API_URL()}/todo/`, {
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
            const response = await fetch(`${API_URL()}/todo/`, {
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
            let url = completed === 1 ? `${API_URL()}/todo/${todoId}` : `${API_URL()}/todo/u/${todoId}`;

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
            const response = await fetch(`${API_URL()}/todo/${todoId}`, {
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
        // setCookie('hideInstruction', true, 7);
        localStorage.setItem('hideInstruction', true);
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
            setLoggedUser({});
            localStorage.removeItem('token');
            localStorage.removeItem('hideInstruction');
            router.push('/login');
        }
    }, [router.query.logout]);

    // Pageload
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedHideInstruction = localStorage.getItem('hideInstruction');

        if (storedHideInstruction) setHideInstruction(true);

        const checkToken = async () => {
            if (storedToken) {
                // api call to get todos/validate storedToken
                const todos = await getTodos(storedToken);
                if (todos) {
                    setTodos(todos);
                    setToken(storedToken);
                    setLoggedUser(parseJwt(storedToken));
                } else {
                    router.push('/login'); // invalid token
                }
            } else {
                router.push('/login'); // token is not set
            }

            setLoading(false);
        };

        checkToken();
    }, []);


    if (loading) {
        return (
            <>
                <Header description={"Welcome to my description"} />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading...</div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
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
    );
}