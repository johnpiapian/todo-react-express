import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Auth.module.css';
import Header from '../components/header';
import { API_URL } from '@/config/base';

export default function Reset() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);

    // Hide error message after x seconds
    useEffect(() => {
        if(!error) return;
        setTimeout(() => {
            setError(undefined);
        }, 5000);
    }, [error]);

    // Get reset token from URL
    useEffect(() => {
        const { token } = router.query;
        setResetToken(token);
    }, [router.query]);

    const handleReset = async (e) => {
        e.preventDefault();

        if (!resetToken || resetToken.length < 1) {
            setError('Invalid reset token!');
            return;
        }

        if (password.length < 1 || confirmPassword.length < 1) {
            setError('Required field(s) missing!');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        // Make API call to reset endpoint with reset token and new password
        fetch(`${API_URL()}/auth/resetPassword?token=${resetToken}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) throw new Error(data.error);

            setSuccess('Successfully reset password!');
            setPassword('');
            setConfirmPassword('');
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <>
            <Header title={"Todo App | Reset Password"} />
            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <h1>Reset Password</h1>
                    <form>
                        {error && <p className='errorMessage'>{error}</p>}
                        {success && <p className='successMessage'>{success}</p>}
                        <div>
                            <label htmlFor="password">Password: </label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password: </label>
                            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                        </div>
                        <div>
                            <p>Go back to <Link className={styles.linkBasic} href="/login">login</Link></p>
                        </div>
                        <div>
                            <button type="submit" onClick={handleReset}>Reset</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
