import React from 'react'
import Track from './Track'
import { startPlayback } from '../../utils'
import { usePlayerStore } from '../../store/playerStore'

const roy = new URL('../../static/roy.jpeg', import.meta.url).href

let exampleTrack = { "title": "Cococabana", "artist": "Roy Bianco & die Abrunzanti Boys", "img": roy }
export default function Playlist() { 

  const { player, deviceID, token } = usePlayerStore()

  return (
    <div>
      <button onClick={() => player.nextTrack()}>Next</button>
      <button onClick={() => startPlayback(token, ["spotify:track:6uRUfq1y0VayUjh2M935g7", "spotify:track:0X8PiJHcTFmmUwsGpvtFik"], deviceID)}> PLAY </button>
      <Track track={exampleTrack} />
      <Track track={exampleTrack} />
      <Track track={exampleTrack} />
      <Track track={exampleTrack} />
      <Track track={exampleTrack} />
      <Track track={exampleTrack} />
      <Track track={exampleTrack} />
    </div>
  )
}
