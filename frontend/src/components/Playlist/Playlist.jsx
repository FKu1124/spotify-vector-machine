import React from 'react'
import Track from './Track'

const roy = new URL('../../static/roy.jpeg', import.meta.url).href

let exampleTrack = { "title": "Cococabana", "artist": "Roy Bianco & die Abrunzanti Boys", "img": roy }
export default function Playlist() {
  return (
    <div>
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
