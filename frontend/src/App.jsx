import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import CoordinateSystem from './components/CoordinateSystem/CoordinateSystem'
import SignUpModal from './components/SignUpModal'
import Navbar from './components/Navbar'
import Player from './components/Player/Player'
import Playlist from './components/Playlist/Playlist'
import PlaylistVector from './components/Playlist/PlaylistVector'

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
    // <div className='App h-screen w-screen bg-white'>
    <div className='App w-screen bg-white'>
      <Navbar />
      <div className="content w-3/4 bg-gray-100 mx-auto my-4 p-4">
        <CoordinateSystem squareWidth='650' />
      </div>
      <div className="content w-3/4 bg-gray-100 mx-auto flex flex-wrap">
        <div className="w-full flex-none">
          <PlaylistVector />
        </div>
        <div className="flex-auto w-full md:w-1/2">
          <Player />
        </div>
        <div className="flex-auto w-full md:w-1/2 border-l-2">
          <Playlist />
        </div>
      </div>
      {/*
        <div className='flex flex-col bg-white'>
          <SignUpModal />
        </div>
      */}
    </div>
  )
}

export default App;
