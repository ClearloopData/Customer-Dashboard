'use client'; //tells Next.js to run this code in the browser, not on the server

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

//the "component" function; re-run each time a React state changes
export default function AuthPage() {

    //React states
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //router: allows us to programatically change which page we are on in website
    const router = useRouter();

    //code to handle when the login/sign up form is submitted
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError('');

        //there could be an error (i.e. bad password, network, etc), so we
        // want to use try-catch
        try { 
            if (isLogin) {
                //await makes code wait for sign in to be attempted 
                //"signInWithEmailAndPassword" provided by Firebase
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            //if no error, then router puts user to the dashboard 
            // page of the website
            router.push('/dashboard');
        //this means an error occured
        } catch (err: any) { 
            setError(err.message);
        }
    };

    //returns JavaScript XML (JSX), which is later converted into HTML
    return (
        //all these long classnames are Tailwind CSS
        //these specifics map directly to specific styles that Tailwind defines
        //tl;dr these classNames make defining a nice style easy
        <div className="max-w-md mx-auto mt-20 p-4 bg-green rounded">

            <img src="/auth_page_brandmark.png" alt="Rivian Logo" className=''/>

            <div className="border rounded-2xl p-4">

                <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Log In' : 'Sign Up'}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                {/* && checks if error is "truthy" (not empty string, null, or undefined) */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className=" text-black px-4 py-2 rounded w-full"
                    style={{ background: "#F7E15D" }}
                >
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
                </form>

                {/* <p className="mt-4 text-sm text-center">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-500 underline"
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
                </p> */}
            </div>

        </div>
    );
}
