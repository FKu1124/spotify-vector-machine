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
import { Center, Icon, Box, Flex } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'
import Presentation from './components/Presentation'
import { useNavigate } from 'react-router-dom'
import SVMAnimation from './components/LandingPage/SVMAnimation'
import Background from './components/LandingPage/Background'

const bg_main = new URL('./static/bg_main.png', import.meta.url).href

const WORDS1 = [
  "Tired",
  "Angry",
  "Sad",
  "Bored",
  "Worried"
]
const WORDS2 = [
  "Happy",
  "Relaxed",
  "Excited",
  "Delighted",
  "Worriless"
]

function App() {
  const { username, setUsername } = useUserStore()
  const [cookies, setCookie, removeCookie] = useCookies(['csrftoken']);
  const { active, paused, deviceID, token, setToken, setTokenExpiry } = usePlayerStore()
  const [isOpen, setIsOpen] = useState(false)
  const siteStartRef = useRef(null)
  const contentRef = useRef(null)
  const presentationRef = useRef(null)
  const { showPresentation, setShowPresentation } = useUserStore()
  const navigate = useNavigate()

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

  const switchToPageContent = () => {
    siteStartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openPresentation = () => {
    setShowPresentation(true)
    presentationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sideBarStates = {
    open: { width: '25%', transitionEnd: { display: 'block' } },
    closed: { width: '0%', transitionEnd: { display: 'none' } }
  }


  return (
    <>
      {showPresentation &&
        <div className='w-full h-screen' ref={presentationRef}>
          <Presentation scrollBack={switchToPageContent} />
        </div>
      }

      <div className='sticky top-0 z-50 h-0'>
        <Navbar openModal={setIsOpen} openPresentation={openPresentation} />
      </div>

      <div ref={siteStartRef} className='w-full h-screen text-center flex-col justify-center'>
        <Background />
        <SVMAnimation />
      </div>
 
      <div ref={contentRef} className='App h-screen w-full bg-green7' style={{ height: '120vh' }} >
        <div className="content w-3/4 mx-auto p-4">
          <button onClick={() => setIsOpen(!isOpen)}> Toggle Sidebar </button>
          <CoordinateSystemHeader />
          <CoordinateSystem squareWidth='800' />
        </div>
        {/* <div className="content w-3/4 bg-gray-100 mx-auto flex flex-wrap"> */}
        {/* <div className="w-full flex-none"> */}
        {/* <PlaylistVector /> */}
        {/* </div> */}
        <div className="flex-auto z-1 w-full md:w-1/2">
          {token && <Player />}
          {/* { token && <PlayerB /> } */}
        </div>
        {/* <div className="flex-auto w-full md:w-1/2 border-l-2">
          <Playlist token={token} />
        </div> */}
        {/* </div> */}
      </div>
    </>
  )
}

export default App;