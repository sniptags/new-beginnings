import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            onLogin();
        } else {
            alert(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2 className="text-lg font-bold">Login</h2>
            <div>
                <label className="block">Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded p-2"
                />
            </div>
            <div>
                <label className="block">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2"
                />
            </div>
            <button type="submit" className="mt-2 bg-blue-500 text-white rounded p-2">Login</button>
        </form>
    );
};

export default Login;