import React, { useEffect, useState, useRef } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { startPlayback, getAvailableDevices, transferPlayback, msToTime } from '../../utils'
import { togglePlayBack } from '../../utils/spotify'
import Progress from './Progress'
import { Box } from '@chakra-ui/react'
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa'

export default function PlayerB() {

  const { token, player, setPlayer, paused, position, duration, cover, updatePlayerState, setDeviceID, setDevices, active, setActive, deviceID, devices, setNextTracks, setPrevTracks } = usePlayerStore()
  const [initActive, setInitActive] = useState(false)


  const test = () => {
    const swithTo = devices.find(d => d.name.includes('MacBook')).id
    transferPlayback(swithTo)
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

      const player = new window.Spotify.Player({
        name: "SVM Player",
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        setDeviceID(device_id)
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state => {
        if (!state) {
          return;
        }

        const { loading, paused, position, repeat_mode, shuffle, track_window } = state
        const { current_track, next_tracks, previous_tracks } = track_window
        const { name, duration_ms, album, artists } = current_track
        const newPlayerState = {
          loading,
          paused,
          position,
          repeatMode: repeat_mode,
          shuffle,
          name,
          duration: duration_ms,
          cover: album.images[0].url,
          artists
        }
        updatePlayerState(newPlayerState)
        setNextTracks(next_tracks)
        setPrevTracks(previous_tracks)

        player.getCurrentState().then(state => {
          (!state) ? setActive(false) : setActive(true)
          setInitActive(true)
        });

      }));



      player.connect();
      console.log("Player connected?")
      console.log(player)
    };
  }, []);

  if (!initActive) {
    return (
      <div>Loading Player..</div>
    )
  }
  return (
    <div>
      <div className=''>
        {/* Song Cover */}
        {cover &&
          <img src={cover} alt="" className='now-playing__cover w-9/12 md:w-3/4 mx-auto my-auto' />
        }
      </div>
      <div>
        <Progress />
      </div>
      <div className="player flex w-1/2 mx-auto justify-around">
        <Box color='tomato' as={FaBackward} onClick={() => player.previousTrack()} />
        {/* <svg onClick={() => { player.previousTrack() }} xmlns="http://www.w3.org/2000/svg" className="btn-spotify h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
        </svg> */}
        {/* <svg onClick={() => { player.togglePlay() }} xmlns="http://www.w3.org/2000/svg" className="btn-spotify h-12 w-12 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"> */}
        <Box color='tomato' as={paused ? FaPlay : FaPause} onClick={() => player.togglePlay()} />
        {/* <svg onClick={() => { togglePlayBack(token, paused) }} xmlns="http://www.w3.org/2000/svg" className="btn-spotify h-12 w-12 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {paused ? (
            <>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </>
          ) : (
            <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg> */}

        {/* Skip */}
        <Box color='tomato' as={FaForward} onClick={() => player.nextTrack()} />
        {/* <svg onClick={() => { player.nextTrack() }} xmlns="http://www.w3.org/2000/svg" className="btn-spotify h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg> */}
      </div>
    </div>
  )
}
