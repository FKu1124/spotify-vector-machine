import React, { useEffect, useState } from 'react'
import { startPlayback, msToTime, getActiveDevice, getAvailableDevices } from '../../utils'
import { usePlayerStore } from '../../store/playerStore'
import { Image, List, ListItem, Icon } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'


const roy = new URL('../../static/roy.jpeg', import.meta.url).href

export default function Playlist() {

  const { deviceID, token, currentPlaylist, currentPlaylistData } = usePlayerStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(currentPlaylist !== '' && currentPlaylist !== undefined) {
      setLoading(false)
      console.log("deviceID")
      console.log(deviceID)
      startPlayback(token, [currentPlaylist], 0, deviceID)
    }
  }, [currentPlaylist])

  const PlaylistItem = ({ index, cover, title, artists, duration, playlistURI }) => {
    const [playOpacity, setPlayOpacity] = useState(0)
    return (
      <ListItem onMouseEnter={() => setPlayOpacity(1)} onMouseLeave={() => setPlayOpacity(0)}>
        <div className='w-full h-16 grid grid-cols-10 text-white cursor-pointer' onClick={() => startPlayback(token, [playlistURI], index, undefined)}>
          <div className='my-auto mx-auto'>
            <p>{index + 1}</p>
          </div>
          <div className='col-span-1'>
            <div className='relative'>
              <div className='absolute z-10 left-0 right-0 ml-auto mr-auto w-8'>
                <div style={{ top: '50%', transform: 'translateY(50%)'}}>
                  <Icon w={8} h={8} color='#d8f3dc' as={FaPlay} className='cursor-pointer' opacity={playOpacity} />
                </div>
              </div>
              <div className='absolute'>
                <Image borderRadius='lg' className='max-h-16' src={cover} />
              </div>
            </div>
          </div>
          <div className='col-span-6 ml-2 my-auto'>
            <p className='text-xl text-bold truncate'>{title}</p>
            <div className='text-sm ml-4'>
              <p>{artists[0].name}{artists.length > 1 && `, ${artists[1].name}`}{artists.length > 2 && `, ${artists[2].name}`}</p>
            </div>
          </div>
          <div className='2xl:ml-2 my-auto'>
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
          {currentPlaylistData.map(({ track }, i) => (
            <PlaylistItem key={track.uri} index={i} cover={track.album.images[0].url} title={track.name} artists={track.artists} duration={track.duration_ms} uri={track.uri} playlistURI={currentPlaylist} />
          ))}
        </List>
      )}
      <div className='h-5' />
    </div>
  )
}
