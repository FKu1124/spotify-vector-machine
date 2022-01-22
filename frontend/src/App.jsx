import { useEffect, useState } from 'react'
import './App.css'
import CoordinateSystem from './components/CoordinateSystem/CoordinateSystem'
import Navbar from './components/Navbar'
import Player from './components/Player/Player'
import PlayerB from './components/Player/PlayerB'
import Playlist from './components/Playlist/Playlist'
import PlaylistVector from './components/Playlist/PlaylistVector'
import CoordinateSystemHeader from './components/CoordinateSystem/CoordinateSystemHeader'
import { useUserStore } from './store/userStore'
import { useCookies } from 'react-cookie';
import { URL_ACCOUNTS } from './Config'
import SVMPlayer from './components/Player/SVMPlayer'


function App() {

  const { username, setUsername } = useUserStore()
  const [cookies, setCookie, removeCookie] = useCookies(['csrftoken']);
  const [token, setToken] = useState()
  const [expiresIn, setExpiresIn] = useState(0)

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
    setExpiresIn(data.data.expires_in)
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
      console.log(data)
      console.log(username)
    }
    getUserData()
    getSpotifyAccess()
  }, []) 


  return (
    <div className='App h-screen w-screen bg-white'>
      <Navbar />
      <button onClick={() => getSpotifyAccess()}> TEST </button>
      {/* { token && <SVMPlayer token={token} /> } */}
      <div className="content w-3/4 bg-gray-100 mx-auto my-4 p-4">
        <CoordinateSystemHeader />
        <CoordinateSystem squareWidth='800' />
      </div>
      <div className="content w-3/4 bg-gray-100 mx-auto flex flex-wrap">
        <div className="w-full flex-none">
          <PlaylistVector />
        </div>
        <div className="flex-auto w-full md:w-1/2">
          {/* <Player /> */}
          {token && <PlayerB token={token}/> }
        </div>
        <div className="flex-auto w-full md:w-1/2 border-l-2">
          <Playlist />
        </div>
      </div>
    </div>
  )
}

export default App;
