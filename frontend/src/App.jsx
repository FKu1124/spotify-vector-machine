import { useEffect, useRef, useState } from 'react'
import './App.css'
import { motion } from "framer-motion"
import CoordinateSystem from './components/CoordinateSystem/CoordinateSystem'
import Navbar from './components/Navbar'
import Player from './components/Player/Player'
import Playlist from './components/Playlist/Playlist'
import { useUserStore } from './store/userStore'
import { useCookies } from 'react-cookie';
import { URL_ACCOUNTS } from './Config'
import { usePlayerStore } from './store/playerStore'
import Presentation from './components/Presentation'
import SVMAnimation from './components/LandingPage/SVMAnimation'
import Background from './components/LandingPage/Background'
import { Center, useDisclosure, ScaleFade } from '@chakra-ui/react'

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
  const { token, setToken, setTokenExpiry, currentPlaylist } = usePlayerStore()
  const siteStartRef = useRef(null)
  const contentRef = useRef(null)
  const presentationRef = useRef(null)
  const { showPresentation, setShowPresentation } = useUserStore()
  const [showPlayer, setShowPlayer] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const { isOpen, onToggle } = useDisclosure()


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

  useEffect(() => {
    onToggle()
  }, [currentPlaylist])

  const switchToPresentation = () => {
    setShowPresentation(true)
    presentationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const switchToSiteStart = () => {
    siteStartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const switchToContent = () => {
    contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const playerStyleStates = {
    open: { left: '7.5%', transform: 'scale(1.0)' },
    closed: { left: '37.5%', transform: 'scale(0.5)' }
  }

  return (
    <>
      {showPresentation &&
        <div className='w-full h-screen' ref={presentationRef}>
          <Presentation scrollBack={switchToSiteStart} />
        </div>
      }

      <div className='sticky top-0 z-50 h-0'>
        <Navbar openPresentation={switchToPresentation} />
      </div>

      <div ref={siteStartRef} className='w-full h-screen text-center flex-col justify-center'>
        <Background />
        <SVMAnimation scrollToContent={switchToContent} />
      </div>

      <div ref={contentRef} className='h-screen w-full bg-green7 grid grid-cols-3 content-center relative'>
        {/* <div>
          <motion.div animate={showPlayer ? 'open' : 'closed'} variants={playerStyleStates} style={{ position: 'absolute', height: '100%', paddingTop: '2.5%' }} >
            {token && <Player />}
          </motion.div>
        </div> */}
        <ScaleFade initialScale={0.8} in={isOpen}>
          <Center className='h-screen'>
            {token && <Player />}
          </Center>
        </ScaleFade>
        <div className='content'>
          {/* <button onClick={() => setShowPlayer(!showPlayer)}>Click Me - Player!</button> */}
          {/* <button onClick={() => setShowPlaylist(!showPlaylist)}>Click Me - Playlist!</button> */}
          <button onClick={onToggle}> Toggle </button>
          <CoordinateSystem squareWidth='600' />
        </div>
        <ScaleFade initialScale={0.8} in={isOpen}>
          <Center className='h-screen'>
            {token && <Playlist />}
          </Center>
        </ScaleFade>
      </div>
    </>
  )
}

export default App;