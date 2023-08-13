import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';
import Header from '../components/header';
import { API_URL } from '@/config/base';

export default function Forgot() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);

    // Hide error message after 3 seconds
    useEffect(() => {
        if(!error) return;
        setTimeout(() => {
            setError(undefined);
        }, 3000);
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email.length < 1) {
            setError('Required field(s) missing!');
            return;
        }

        // Make API call to reset endpoint with email
        fetch(`${API_URL()}/auth/forgotPassword`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) throw new Error(data.error);
            
            console.log(`http://${window.location.host}/reset?token=${data.token}`); // link sent to email
            
            setSuccess('Check your email for a reset link!'); // Show success message
            setEmail(''); // Clear email field
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <>
            <Header title={"Todo App | Forgot Password"} />
            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <h1>Forgot Password</h1>
                    <form>
                        {error && <p className='errorMessage'>{error}</p>}
                        {success && <p className='successMessage'>{success}</p>}
                        <div>
                            <label htmlFor="email">Email: </label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <p>Or go back to <Link className={styles.linkBasic} href="/login">login</Link></p>
                        </div>
                        <div>
                            <button type="submit" onClick={handleSubmit}>Reset</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
