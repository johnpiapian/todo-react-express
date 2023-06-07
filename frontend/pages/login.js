import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/LoginRegister.module.css';
import Header from '../components/header';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (email.length < 1 || password.length < 1) {
            alert('Check input!');
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
            if(data.error) throw new Error(data.error);
            // Store the token
            localStorage.setItem('token', data.token);
            // Redirect to a secure page (index)
            router.push('/');
        })
        .catch(error => {
            alert(error.message);
        });
    };

    return (
        <>
            <Header title={"Todo App | Login"} />
            <main className={styles.main}>
                <div className={styles.formContainer}>
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
                            <p>Don't have an account? <Link className={styles.linkBasic} href="/register">Register</Link></p>
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
