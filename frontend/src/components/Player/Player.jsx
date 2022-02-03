import React, { useEffect, useState } from 'react'
import { usePlayerStore } from '../../store/playerStore'
import { startPlayback, getAvailableDevices, transferPlayback, togglePlayBack } from '../../utils'
import Progress from './Progress'
import { Icon } from '@chakra-ui/react'
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa'
import { RiThumbDownLine, RiThumbUpLine } from 'react-icons/ri'

export default function PlayerB() {

  const { token, player, setPlayer, paused, cover, updatePlayerState, setDeviceID, setDevices, active, setActive, deviceID, devices, setNextTracks, setPrevTracks, currentPlaylist } = usePlayerStore()
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
        volume: localStorage.getItem('svmPlayerDefaultVolume') / 100
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
    };
  }, []);

  useEffect(() => {
    // if(player)
      // player.pause()
  }, [currentPlaylist])

  if (!initActive) {
    return (
      <div>Loading Player..</div>
    )
  }
  return (
    // <div className='bg-deepBlue rounded-lg h-5/6 grid grid-cols-1 content-center'>
    <div className='bg-deepBlue rounded-lg lg:h-2/3 lg:w-11/12 2xl:h-5/6 2xl:w-3/4 grid grid-cols-1'>
      {/* Song Cover */}
      {cover &&
        <img src={cover} alt="" className='now-playing__cover mx-auto my-auto rounded-lg w-3/4' />
      }
      <div className='mt-4'>
        <Progress />
      </div>
      <div className="player flex w-1/2 pt-3 mx-auto justify-around">
        <Icon w={8} h={8} color='#d8f3dc' as={FaBackward} onClick={() => player.previousTrack()} className='cursor-pointer' />

        <Icon w={8} h={8} color='#d8f3dc' as={paused ? FaPlay : FaPause} onClick={() => player.togglePlay()} className='cursor-pointer' />
        {/* <Icon w={8} h={8} color='#d8f3dc' as={paused ? FaPlay : FaPause} onClick={() => togglePlayBack(token, paused)} className='cursor-pointer' /> */}

        {/* Skip */}
        <Icon w={8} h={8} color='#d8f3dc' as={FaForward} onClick={() => player.nextTrack()} className='cursor-pointer' />
      </div>
      <div className='h-16 flex w-1/2 2xl:pt-8 lg:pt-2 mx-auto justify-around'>
        <Icon w={10} h={10} as={RiThumbDownLine} color='white' className='cursor-pointer' onClick={() => alert('TODO: Downvote')} />
        <span></span>
        <Icon w={10} h={10} as={RiThumbUpLine} color='white' className='cursor-pointer' onClick={() => alert('TODO: Upvote')} />
      </div>
    </div>
  )
}