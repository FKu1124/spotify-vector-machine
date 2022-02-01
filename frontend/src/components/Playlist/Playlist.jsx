import React from 'react'
import Track from './Track'
import { startPlayback } from '../../utils'
import { usePlayerStore } from '../../store/playerStore'
import { Image, List, ListItem } from '@chakra-ui/react'

const roy = new URL('../../static/roy.jpeg', import.meta.url).href

let exampleTrack = { "title": "Cococabana", "artist": "Roy Bianco & die Abrunzanti Boys", "img": roy }
export default function Playlist() {

  const { player, deviceID, token, nextTracks, prevTracks } = usePlayerStore()
  console.log("nextTracks")
  console.log(nextTracks)
  console.log("prevTracks")
  console.log(prevTracks)


  const PlaylistItem = ({ cover, title, authors, duration, uri }) => {
    return (
      <ListItem>

        <div className='w-full h-16 grid grid-cols-10 text-white cursor-pointer'>
          <div className='my-auto mx-auto'>
            <p>1.</p>
          </div>
          <div className='col-span-2'>
            <Image borderRadius='lg' className='max-h-16' src={exampleTrack.img} />
          </div>
          <div className='col-span-6 my-auto'>
            <p className='text-xl text-bold'>{title}</p>
            <div className='text-sm ml-4'>
              <p>{authors}</p>
            </div>
          </div>
          <div className='my-auto'>
            <p>{duration}</p>
          </div>
        </div>
      </ListItem>

    )
  }

  return (
    <div className='bg-deepBlue rounded-lg lg:h-2/3 lg:w-11/12 2xl:h-5/6 2xl:w-3/4 grid grid-cols-1'>
      {/* <div className='h-5' /> */}
      <List spacing='14px' overflow='scroll'>
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
        <PlaylistItem cover={exampleTrack.img} title={'Sick Sample Track'} authors={'Drake'} duration={'2:55'} />
      </List>
      {/* <div className='h-5'></div> */}
    </div>
  )
}
