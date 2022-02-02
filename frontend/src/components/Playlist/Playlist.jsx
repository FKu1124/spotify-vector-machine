import React, { useEffect, useState } from 'react'
import Track from './Track'
import { startPlayback, msToTime, getActiveDevice, getAvailableDevices } from '../../utils'
import { usePlayerStore } from '../../store/playerStore'
import { Image, List, ListItem, Icon } from '@chakra-ui/react'
import { URL_ACCOUNTS } from '../../Config'
import { useCookies } from 'react-cookie';
import { FaPlay } from 'react-icons/fa'


const roy = new URL('../../static/roy.jpeg', import.meta.url).href

// 4P9lNdUhVPhwfVxZlgjWlL
// https://open.spotify.com/track/0Dfyjnusld4dFOUl91gf0z?si=6259ce91a2344077
// https://open.spotify.com/track/2dQOLMtsC7x9lsLXnQ2o7z?si=ab2985ac94444dbc
// https://open.spotify.com/track/6fuO9uk9wbjCHvQJqk2Qpx?si=b83645c0962a4f4d


let exampleTrack = { "title": "Cococabana", "artist": "Roy Bianco & die Abrunzanti Boys", "img": roy }
export default function Playlist() {

  const { player, deviceID, token, nextTracks, prevTracks } = usePlayerStore()
  const [playlist, setPlaylist] = useState([])
  const [playlistURI, setPlaylistURI] = useState('')
  const [loading, setLoading] = useState(true)
  const [cookies, setCookie, removeCookie] = useCookies(['csrftoken']);

  const getData = () => {
    fetch(`${URL_ACCOUNTS}getPlaylistDummy`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies['csrftoken']
      },
      credentials: 'include',
    }).then(res => res.json())
      .then(data => {
        setPlaylist(data.data.tracks.items)
        setPlaylistURI(data.data.uri)
        setLoading(false)
      })
  }

  const playTrack = (uri, index) => {
    getActiveDevice(token).then(res => {
      startPlayback(token, [uri], res.id, index)
    })
  }

  useEffect(() => {
    // getData()
  }, [])

  const PlaylistItem = ({ index, cover, title, artists, duration, uri, playlistURI }) => {
    const [playOpacity, setPlayOpacity] = useState(0)
    return (
      <ListItem onMouseEnter={() => setPlayOpacity(1)} onMouseLeave={() => setPlayOpacity(0)}>
        <div className='w-full h-16 grid grid-cols-10 text-white cursor-pointer' onClick={() => playTrack(playlistURI, index)}>
          <div className='my-auto mx-auto'>
            <p>{index + 1}</p>
          </div>
          <div className='col-span-1'>
            <div className='relative'>
              <div className='absolute z-10 left-0 right-0 ml-auto mr-auto w-8'>
                <div style={{ top: '50%', transform: 'translateY(50%)'}}>
                  <Icon w={8} h={8} color='tomato' as={FaPlay} className='cursor-pointer' opacity={playOpacity} />
                </div>
              </div>
              <div className='absolute'>
                <Image borderRadius='lg' className='max-h-16' src={cover} />
              </div>
            </div>
          </div>
          <div className='col-span-6 my-auto'>
            <p className='text-xl text-bold'>{title}</p>
            <div className='text-sm ml-4'>
              <p>{artists[0].name}{artists.length > 1 && `, ${artists[1].name}`}{artists.length > 2 && `, ${artists[2].name}`}</p>
            </div>
          </div>
          <div className='my-auto'>
            <p>{msToTime(duration)}</p>
          </div>
        </div>
      </ListItem>
    )
  }

  return (
    <div className='bg-deepBlue rounded-lg lg:h-2/3 lg:w-11/12 2xl:h-5/6 2xl:w-3/4 grid grid-cols-1'>
      <div className='h-5' />
      {loading ? (
        <div>
          Loading
        </div>
      ) : (
        <List spacing='14px' overflow='scroll'>
          {playlist.map(({ track }, i) => (
            <PlaylistItem key={track.uri} index={i} cover={track.album.images[0].url} title={track.name} artists={track.artists} duration={track.duration_ms} uri={track.uri} playlistURI={playlistURI} />
          ))}
        </List>
      )}
      <div className='h-5' />
    </div>
  )
}
