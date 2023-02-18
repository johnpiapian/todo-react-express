import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/Login.module.css';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (email.length < 1 || password.length < 1) {
            alert('Check input!s');
            return;
        }

        // Make API call to login endpoint with email and password
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                alert(data.error);
                return;
            }
            // Maybe store the token
            document.cookie = `token=${data.token}; path=/`;
            // Redirect to a secure page (index)
            router.push('/');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <>
            <Head>
                <title>Todo App | Login</title>
                <meta name="description" content="This is my todo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="" />
            </Head>
            <main className={styles.main}>
                <div className={styles.loginContainer}>
                    <h1>Login</h1>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="password">Password: </label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div>
                            <button type="submit" onClick={handleLogin}>Login</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
