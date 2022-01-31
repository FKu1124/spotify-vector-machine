import { useEffect, useRef, useState } from 'react'
import './App.css'
import { motion } from "framer-motion"
import CoordinateSystem from './components/CoordinateSystem/CoordinateSystem'
import Navbar from './components/Navbar'
import Player from './components/Player/Player'
import CoordinateSystemHeader from './components/CoordinateSystem/CoordinateSystemHeader'
import { useUserStore } from './store/userStore'
import { useCookies } from 'react-cookie';
import { URL_ACCOUNTS } from './Config'
import { usePlayerStore } from './store/playerStore'
import UserSettings from './components/UserSettings'
import Background from './components/LandingPage/Background'
import SVMAnimation from './components/LandingPage/SVMAnimation'

function App() {
  const { username, setUsername } = useUserStore()
  const [cookies, setCookie, removeCookie] = useCookies(['csrftoken']);
  const { active, paused, deviceID, token, setToken, setTokenExpiry } = usePlayerStore()
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)

  const getSpotifyAccess = async () => {
    const res = await fetch(`${URL_ACCOUNTS}getSpotifyAccess`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies['csrftoken']
      },
      credentials: 'include'
    })
    const data = await res.json()
    setToken(data.data.token)
    setTokenExpiry(data.data.expires_in)
  }

  useEffect(() => {
    const getUserData = async () => {
      const res = await fetch(`${URL_ACCOUNTS}get_user_profile`, {
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
    getSpotifyAccess()
  }, [])

  const sideBarStates = {
    open: { width: '25%', transitionEnd: { display: 'block' } },
    closed: { width: '0%', transitionEnd: { display: 'none' } }
  }

  return (
    <>
      <motion.div animate={isOpen ? 'open' : 'closed'} variants={sideBarStates} style={{ position: 'absolute', height: '120vh', top: '0', right: '0', backgroundColor: 'rgba(255, 255, 255, .35)', backdropFilter: 'blur(5px)' }} >
        <div className='mt-10'>
          <div onClick={() => setIsOpen(false)}>X</div>
          <UserSettings />
          <Player />
          <button onClick={() => alert("Log Out!")} className='bg-red-500 text-white rounded-lg' >Log Out</button>
        </div>
      </motion.div>

      <div className='sticky top-0 z-50 h-0'>
        <Navbar openModal={setIsOpen} />
      </div>
      <div className='w-full h-screen text-center flex flex-col justify-center'>
        <Background />
        <SVMAnimation />
      </div>
      <div ref={contentRef} className='App h-screen w-full' >
        <div className="content w-full mx-auto p-4 bg-green7">
          <button onClick={() => setIsOpen(!isOpen)}> Toggle Sidebar </button>
          <CoordinateSystemHeader />
          <CoordinateSystem squareWidth='800' />
        </div>
        <div className="flex-auto z-1 w-full md:w-1/2 bg-spotify">
          {token && <Player />}
        </div>
      </div>
    </>
  )
}

export default App;