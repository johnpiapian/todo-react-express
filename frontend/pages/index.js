import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

export default function Home() {
    const router = useRouter();
    const [token, setToken] = useState('');

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    useEffect(() => {
        // Check if the token is stored in a cookie
        const storedToken = getCookie('token');

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
                    return res.json().then(data => {
                        throw new Error(`${data.error} (${res.status})`);
                    });
                }
                return res.json();
            })
            .then(data => {
                // Display the data
                // console.log(data);
            })
            .catch(err => {
                router.push('/login');
            });
        } else {
            // Cookie does not exist
            router.push('/login');
        }
    }, []);

    return (
        <>
            <Head>
                <title>Todo App</title>
                <meta name="description" content="This is my todo app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>Hello World</h1>
            </main>
        </>
    )
}
