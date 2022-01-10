import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import CoordinateSystem from './components/CoordinateSystem'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [count, setCount] = useState(0)
  const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false)

  const authenticateSpotify = () => {
    fetch('http://127.0.0.1:8000/spotify/is-authenticated')
      .then(res => res.json())
      .then(data => {
        console.log("IS AUTHENTICATED Data:", data)
        setIsSpotifyAuthenticated(data.status)
        if(!data.status) {
          fetch('http://127.0.0.1:8000/spotify/get-auth-url')
            .then(res => res.json())
            .then(data => {
              console.log("GET AUTH URL Data:", data)
              window.location.replace(data.url)
            })
        }
      })
  }

  const test = () => {
    console.log(isSpotifyAuthenticated)
  }


  const handleClick = () => {
    fetch("http://127.0.0.1:8000/users/1/")
      .then(res => res.json())
      .then(json => console.log(json))
  }
  
  return (
    <div className='flex justify-center align-middle' style={{ backgroundColor: 'green', height: '700px'}}>
      <button onClick={authenticateSpotify}>CLICK MICH HART</button>
      <button onClick={test}>Test</button>
      <CoordinateSystem />
    </div>
  )
}

export default App
