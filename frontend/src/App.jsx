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
import { Center, Icon, Box, Flex } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'

const WORDS = [
  "Tired",
  "Angry",
  "Sad",
  "Happy",
  "Excited",
]

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
          {/* <Player /> */}
          <button onClick={() => alert("Log Out!")} className='bg-red-500 text-white rounded rounded-lg' >Log Out</button>
        </div>
      </motion.div>

      <div className='sticky top-0 z-50 h-0'>
        <Navbar openModal={setIsOpen} />
      </div>
      <div className='w-screen h-screen text-center flex flex-col justify-center bg-spotify'>
        <div className='w-screen flex flex-row justify-center'>
          <div className='text-6xl text-white'>
            Let Us Take You From
          </div>
          <div className='text-6xl text-white w-48 mx-3'>
            <div className='absolute'>
              {WORDS.map((word, i) =>
                <span key={i} id={`word1${i}`} className='hiddenStack'>{word}</span>
                )}
            </div>
          </div>
          <p className='text-6xl text-white'>
            to
          </p>
          <div className='text-6xl text-white w-48 mx-3'>
            <div className='absolute'>
              {WORDS.map((word, i) =>
                <span key={i} id={`word2${i}`} className='hiddenStack'>{word}</span>
                )}
            </div>
          </div>
        </div>
        <div style={{ height: '10%' }} />
        {/* <div className='flex justify-center'> */}
        <Flex direction='column' align='center'>
          <Center className='animate-pulse cursor-pointer'>
            <Icon w={20} h={20} color='tomato' as={FaPlay} onClick={() => contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
          </Center>
        </Flex>
        {/* </div> */}
      </div>
      <div ref={contentRef} className='App h-screen w-screen bg-pink' style={{ height: '120vh' }} >
        <div className="content w-3/4 bg-gray-100 mx-auto p-4 bg-pink">
          <button onClick={() => setIsOpen(!isOpen)}> Toggle Sidebar </button>
          <CoordinateSystemHeader />
          <CoordinateSystem squareWidth='800' />
        </div>
        {/* <div className="content w-3/4 bg-gray-100 mx-auto flex flex-wrap"> */}
        {/* <div className="w-full flex-none"> */}
        {/* <PlaylistVector /> */}
        {/* </div> */}
        <div className="flex-auto z-1 w-full md:w-1/2 bg-spotify">
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