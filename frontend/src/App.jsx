import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    fetch("http://localhost:8000/users/1/")
      .then(res => res.json())
      .then(json => console.log(json))
  }



  return (
    <div className="App">
        <Link to="/home">Invoices</Link> |{" "}
        <Link to="/login">Expenses</Link>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <div onClick={handleClick}>
          Call Backend
        </div>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
