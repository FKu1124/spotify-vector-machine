import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = () => {
    fetch("http://localhost:8000/users/1/")
      .then(res => res.json())
      .then(json => console.log(json))
  }

  if(!isLoggedIn)
    return (
      <div></div>
    )
  else
      return
}

export default App
