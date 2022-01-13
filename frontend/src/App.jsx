import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import CoordinateSystem from './components/CoordinateSystem'
import SignUpModal from './components/SignUpModal'

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
  let ctx = null
  
  return (
    <div>
      {/* <div className='App h-screen w-screen bg-spotify'>
        <div className='flex flex-col bg-white'>
          <SignUpModal></SignUpModal>
        </div>
      </div> */}
      <div className='flex justify-center align-middle' style={{ backgroundColor: 'grey', height: '700px'}}>
        <CoordinateSystem />
      </div>
    </div>
  )
}

export default App;
