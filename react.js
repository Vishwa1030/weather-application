import React, { useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('Hello, React!');

    return (
        <div className="container">
            <h1>{message}</h1>
            <button onClick={() => setMessage('React is awesome!')}>Change Message</button>
        </div>
    );
}

export default App;
