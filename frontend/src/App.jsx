import { useState, useEffect } from 'react'
import './App.css'
import CoordinateSystem from './components/CoordinateSystem/CoordinateSystem'
import SignUpModal from './components/SignUpModal'
import Navbar from './components/Navbar'
import Player from './components/Player/Player'
import Playlist from './components/Playlist/Playlist'
import PlaylistVector from './components/Playlist/PlaylistVector'
import CoordinateSystemHeader from './components/CoordinateSystem/CoordinateSystemHeader'
import { useSearchParams } from 'react-router-dom'
import { useUserStore } from './store/userStore'
import { useCookies } from 'react-cookie';


function App() {

  const { username, setUsername } = useUserStore()
  const [cookies, setCookie, removeCookie] = useCookies(['csrftoken']);

  // const [searchParams, setSearchParams] = useSearchParams()
  // const username = searchParams.get("username")

  useEffect(() => {
    const getUserData = async () => {
      const res = await fetch("http://localhost:8000/accounts/get_user_profile", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': cookies['csrftoken']
        },
        credentials: 'include'
      })
      const data = await res.json()
      setUsername(data.data.username)
    }
    getUserData()
  }, [])

  return (
    // <div className='App h-screen w-screen bg-white'>
    <div className='App w-screen bg-white'>
      <Navbar />
      <div className="content w-3/4 bg-gray-100 mx-auto my-4 p-4">
        <CoordinateSystemHeader />
        <CoordinateSystem squareWidth='600' />
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
    </div>
  )
}

export default App;
