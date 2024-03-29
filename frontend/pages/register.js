import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';
import Header from '../components/header';
import { API_URL } from '@/config/base';

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(undefined);

    // Hide error message after x seconds
    useEffect(() => {
        if(!error) return;
        setTimeout(() => {
            setError(undefined);
        }, 5000);
    }, [error]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (name.length < 1 || email.length < 1 || password.length < 1) {
            setError('Required field(s) missing!');
            return;
        }

        // Make API call to login endpoint with email and password
        fetch(`${API_URL()}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) throw new Error(data.error);
            
            // Successfully created account
            if(confirm("Successfully registered! Want to login?")) {
                router.push('/login');
            }
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <>
            <Header title={"Todo App | Register"}/>
            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <h1>Register</h1>
                    <form>
                        {error && <p className='errorMessage'>{error}</p>}
                        <div>
                            <label htmlFor="name">Name: </label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="password">Password: </label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <div>
                            <p>Already have an account? <Link className={styles.linkBasic} href="/login">Login</Link></p>
                        </div>
                        <div>
                            <button type="submit" onClick={handleRegister}>Register</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
