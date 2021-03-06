import { React, useState, useEffect } from 'react'
import moodMapping from '../../static/mood.json'
import Coordinate from './Coordinate'
import { repeat, throttle } from 'lodash'
import { useCookies } from 'react-cookie';
import './ccs_header.css'
import { usePlayerStore } from '../../store/playerStore';
import { URL_ACCOUNTS } from '../../Config';
import { getTrack } from '../../utils'
import {
  Icon,
  Center,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark
} from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'
import { IoColorFilterSharp } from 'react-icons/io5'
import { HiOutlineTrash } from 'react-icons/hi'
import { startPlayback } from '../../utils'



const colorsImagePath = new URL('../../static/colors3.png', import.meta.url).href

export default function CoordinateSystem({ squareWidth }) {
  const [cnv, setCnv] = useState(null)
  const [cnvCtx, setCnvCtx] = useState(null)
  const [squareSize, setSquareSize] = useState(parseInt(squareWidth))
  const [drawing, setDrawing] = useState(false)
  const [coordinates, setCoordinates] = useState(getMoodCoordinateArray())

  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [endX, setEndX] = useState(0)
  const [endY, setEndY] = useState(0)
  const [startMood, setStartMood] = useState('neutral')
  const [endMood, setEndMood] = useState('neutral')
  const [name, setName] = useState('Default Mood Vector')
  const [length, setLength] = useState(30)

  const [startPreviews, setStartPreviews] = useState([])
  const [endPreviews, setEndPreviews] = useState([])
  const [showPreviews, setShowPreviews] = useState(false)

  const [startProfile, setStartProfile] = useState(null)
  const [endProfile, setEndProfile] = useState(null)

  const [loadingPreview, setLoadingPreview] = useState(false)
  const [loadingPlaylist, setLoadingPlaylist] = useState(false)

  const { setCurrentPlaylist, setCurrentPlaylistData, setShowPreviewPlayer, deviceID } = usePlayerStore()


  // const [remountCount, setRemountCount] = useState(0);
  // const refresh = () => setRemountCount(remountCount + 1);

  // const showPreviews = startPreviews.length !== 0

  // HEADER SECTION

  const [cookies] = useCookies(['csrftoken']);
  const { token } = usePlayerStore()

  const onLengthChange = e => {
    setLength(e.target.value)
  }

  const selectStartMood = (e, profile) => {
    let prev_elements = document.getElementsByClassName('selected-start-mood')
    if (prev_elements.length !== 0) {
      prev_elements[0].classList.remove('selected-start-mood')
    }
    // setStartMood(profile)
    setStartProfile(profile)
    e.target.parentNode.parentNode.parentNode.classList.add('selected-start-mood')
  }

  const selectEndMood = (e, profile) => {
    let prev_elements = document.getElementsByClassName('selected-end-mood')
    if (prev_elements.length !== 0) {
      prev_elements[0].classList.remove('selected-end-mood')
    }
    // setEndMood(profile)
    setEndProfile(profile)
    e.target.parentNode.parentNode.parentNode.classList.add('selected-end-mood')
  }

  function resetVector() {
    setStartPreviews([])
    setEndPreviews([])
    setStartX(0)
    setStartY(0)
    setStartMood('neutral')
    setEndX(0)
    setEndY(0)
    setEndMood('neutral')

    let canvasWidth = cnvCtx.canvas.attributes.width.nodeValue
    cnvCtx.clearRect(0, 0, canvasWidth, canvasWidth)
  }

  function getStringifiedVector() {
    if (startX == 0 || startY == 0) {
      alert("Please draw a vector before submiting.")
    }

    // Added small offset to since leave position can be higher than div size
    let scaledStartX = startX / (squareSize + 4)
    let scaledStartY = startY / (squareSize + 4)
    let scaledEndX = endX / (squareSize + 4)
    let scaledEndY = endY / (squareSize + 4)

    return JSON.stringify({
      scaledStartX, scaledStartY, scaledEndX, scaledEndY, length, name, startProfile, endProfile
    })
  }

  function getPreviews() {
    let vector_json = getStringifiedVector()
    setLoadingPreview(true)
    fetch(`${URL_ACCOUNTS}get_vector_preview`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies['csrftoken']
      },
      credentials: 'include',
      body: vector_json
    }).then(res => res.json())
      .then(data => {
        // setStartPreviews([1,2,3,4])
        // setEndPreviews([1])
        // setStartPreviews(getPreviewTrackData(data.data.start, token))
        // setStartPreviews(getPreviewTrackData(data.data.start, token))
        // setEndPreviews(getPreviewTrackData(data.data.end, token))
        getPreviewTrackData(data.data.start, token, 'start')
        getPreviewTrackData(data.data.end, token, 'end')
        setShowPreviews(true)
        setLoadingPreview(false)
      })
  }

  function getPreviewTrackData(data, token, pos) {
    let previews = []
    let uris = []
    let profiles = []
    for (let profile in data) {
      uris.push(data[profile])
      profiles.push(profile)
    }

    getTrack(token, uris.join(',')).then(res => {
      let i = 0
      for (let track in res.tracks) {
        let album = res.tracks[track].album.images[1].url
        let uri = res.tracks[track].uri
        previews.push({ "album": album, "uri": uri, "profile": profiles[i++] })
      }
      console.log(previews);
      pos === 'start' ? setStartPreviews(previews) : setEndPreviews(previews)
    })
    return previews
  }

  function startPreviewPlay(uri) {
    setShowPreviewPlayer(true)
    startPlayback(token, [uri], 0, deviceID)
  }

  function sendVector() {
    let vector_json = getStringifiedVector()
    setLoadingPlaylist(true)
    fetch(`${URL_ACCOUNTS}save_vector`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies['csrftoken']
      },
      credentials: 'include',
      body: vector_json
    }).then(res => res.json())
      .then(data => {
        setCurrentPlaylist(data.playlist_uri)
        setCurrentPlaylistData(data.playlist_data.tracks.items)
        setLoadingPlaylist(false)
      })
    // TODO Handle redirecting of successful response
  }


  // COORDINATE SYSTEM SECTION 

  useEffect(() => {
    let canvas = document.getElementById("cnv")
    let canvasContext = canvas.getContext("2d")
    let img = document.getElementById("colors")
    let pat = canvasContext.createPattern(img, 'repeat');

    setCnv(canvas)
    setCnvCtx(canvasContext)
  }, [])

  function getMoodCoordinateArray() {
    let moodArr = []
    let scaledX, scaledY = 0

    moodMapping.forEach(item => {
      scaledX = getScaledCoordinate(item.coordinate.x)
      scaledY = getScaledCoordinate(item.coordinate.y)
      moodArr.push(
        {
          "top": squareSize - scaledY,
          "left": scaledX,
          "label": item.label
        }
      )
    })
    return moodArr
  }

  function getNearestMood(x, y) {
    let mood = 'neutral'
    let dist = 0
    let minDistance = squareSize

    for (let item of coordinates) {
      // Euclidean distance between selected point and all mood points
      dist = Math.sqrt(((parseInt(x) - parseInt(item.left)) ** 2 + (parseInt(y) - parseInt(item.top)) ** 2))

      if (dist < minDistance) {
        mood = item.label
        minDistance = dist
      }
    }

    return mood
  }

  function getScaledCoordinate(val) {
    let val_scaled = (val + 1) / 2
    let result = Math.floor(val_scaled * squareSize)
    return result
  }

  function start(e) {
    let x = e.clientX - cnv.getBoundingClientRect().left
    let y = e.clientY - cnv.getBoundingClientRect().top
    let mood = getNearestMood(x, y)

    setStartPreviews([])
    setEndPreviews([])
    setStartX(x)
    setStartY(y)
    setStartMood(mood)
    setDrawing(true)
  }

  function draw(e) {
    if (drawing == false || typeof (cnvCtx) !== 'object') return

    cnvCtx.clearRect(0, 0, squareSize, squareSize);

    // cnvCtx.fillRect(startX - 2, startY - 2, 4, 4);
    let img = document.getElementById("colors")
    let pat = cnvCtx.createPattern(img, 'no-repeat');
    cnvCtx.strokeStyle = pat;

    cnvCtx.lineWidth = 3
    cnvCtx.lineCap = 'round'
    // cnvCtx.setLineDash([20, 5])


    cnvCtx.beginPath()
    cnvCtx.moveTo(startX, startY)
    cnvCtx.lineTo(e.clientX - cnv.getBoundingClientRect().left, e.clientY - cnv.getBoundingClientRect().top)
    cnvCtx.stroke()
  }

  function end(e, cnv) {
    if (drawing == false || typeof (cnvCtx) !== 'object') return

    let x = e.clientX - cnv.getBoundingClientRect().left
    let y = e.clientY - cnv.getBoundingClientRect().top

    let mood = getNearestMood(x, y)

    if (x < 0) {
      x = 0
    }

    if (y < 0) {
      y = 0
    }

    setStartY(squareSize - startY)
    setEndX(x)
    setEndY(squareSize - y)
    setEndMood(mood)
    setName(`from ${startMood} to ${mood}`)
    setDrawing(false)
  }

  return (
    <>
      {/* CCS HEADER */}
      <div className="header flex flex-row items-center justify-center gap-3">
        <h1 className='text-4xl text-white text-bold'>
          Let us take you from {startMood} to {endMood}
        </h1>
        <div>
          <Icon as={IoColorFilterSharp} w={6} h={6} color='tomato' onClick={getPreviews} className='mr-3 cursor-pointer animate-pulse' />
          {/* <Icon as={IoColorFilterSharp} w={6} h={6} color='pink.400' onClick={getPreviews} className='mr-3 cursor-pointer animate-pulse' /> */}
          <Icon as={FaPlay} w={6} h={6} color='tomato' onClick={sendVector} className='cursor-pointer animate-pulse' />
        </div>
      </div>

      {/* Filter options & Action button */}
      <div className="filter flex items-end justify-center gap-3">
        {/* Playlist Length Slider */}
        <div className='h-20' />
        <div className="length-slider w-full flex-row text-left">
          <div className="slider flex w-full text-white h-8 rounded-md items-center px-10">
            <span className='text-small w-1/2'>Playlist length:</span>
            <Slider aria-label='slider-ex-1' min={10} max={300} step={5} defaultValue={30} onChange={setLength}>
              <SliderTrack>
                <SliderFilledTrack bg='blue.800' />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            {/* <input type="range" onChange={onLengthChange} min="10" max="120" step="5" className='bg-gray-400' /> */}
            <span className='text-sm pl-4 p-1 w-1/4'>{length} min</span>
          </div>
        </div>
        {/* Reset Button */}
        <div className="reset w-1/8 px-10">
          <Icon as={HiOutlineTrash} color='white' w={6} h={6} className='mb-2 cursor-pointer' onClick={resetVector} />
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={resetVector}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg> */}
        </div>
      </div>

      {/* COORDINATE SYSTEM */}
      <div className='relative mx-auto' style={{ width: squareSize, height: squareSize }}>
        {/* Color Palette for vector colors */}
        <img id="colors" src={colorsImagePath} width={squareSize} height={squareSize} className='object-cover hidden' />

        {(loadingPreview || loadingPlaylist) &&
          <div className='absolute bg-deepBlue rounded-lg opacity-50 w-full h-full z-40'>
            <div className='flex h-full w-full items-center justify-center'>
              {loadingPlaylist && <span className='text-4xl text-green1'>Loading Your playlist</span>}
              {loadingPreview && <span className='text-4xl text-green1'>Loading Your Preview</span>}
            </div>
          </div>
        }

        {/* Canvas layer we draw on */}
        <canvas id="cnv" width={squareSize} height={squareSize} className='absolute rounded-lg bg-green3 border border-black'></canvas>
        <div
          className='absolute flex flex-wrap items-center justify-evenly z-10'
          style={{ top: squareSize - startY - 84, left: startX - 84, width: 168, height: 168, display: startPreviews.length !== 0 ? 'flex' : 'none' }}
        >
          {startPreviews.map((entry, i) => (
            <div
              className='md:flex-1/2 opacity-70 transition hover:opacity-100 bg-white z-30'
              style={{ width: '64px', height: '64px' }}
            >
              <div
                className={`h-full w-full z-40 transition transform hover:scale-150`}
                style={{ background: `center / cover no-repeat url('${entry.album}')` }}
              >
                <Center className="h-full w-full">
                  <div className='flex-row z-40 opacity-0 hover:opacity-100'>
                    <div className=''>
                      <Icon w={8} h={8} color='white' as={FaPlay} className='cursor-pointer' onClick={() => startPreviewPlay(entry.uri)} />
                    </div>
                    <span
                      className='flex-1 text-white text-tiny select-non cursor-pointer'
                      style={{ 'textShadow': '1px 1px black' }}
                      onClick={e => selectStartMood(e, entry.profile)}
                    >
                      SELECT
                    </span>
                  </div>
                </Center>
              </div>
            </div>
          ))}
        </div>

        <div
          className='absolute flex flex-wrap items-center justify-evenly z-10'
          style={{ top: squareSize - endY - 82, left: endX - 82, width: 168, height: 168, display: endPreviews.length !== 0 ? 'flex' : 'none' }}
        >
          {endPreviews.map((entry, i) => (
            <div
              className='md:flex-1/2 opacity-70 transition hover:opacity-100 bg-white z-30'
              style={{ width: '64px', height: '64px' }}
            >
              <div
                className={`h-full w-full z-40 transition transform hover:scale-150`}
                style={{ background: `center / cover no-repeat url('${entry.album}')` }}
              >
                <Center className="h-full w-full">
                  <div className='flex-row z-40 opacity-0 hover:opacity-100'>
                    <div className=''>
                      <Icon w={8} h={8} color='white' as={FaPlay} className='cursor-pointer' onClick={() => startPreviewPlay(entry.uri)} />
                    </div>
                    <span
                      className='flex-1 text-white text-tiny select-non cursor-pointer'
                      style={{ 'textShadow': '1px 1px black' }}
                      onClick={e => selectEndMood(e, entry.profile)}
                    >
                      SELECT
                    </span>
                  </div>
                </Center>
              </div>
            </div>
          ))}
        </div>




        <div
          onMouseDown={e => start(e)}
          onMouseMove={throttle(draw, 60)}
          onMouseUp={e => end(e, cnv)}
          onMouseLeave={e => end(e, cnv)}
          id='canvas'
          className='absolute align-middle bg-transparent flex items-center justify-center select-none'
          style={{ width: squareSize, height: squareSize }}
        >

          {/* Coordinate System Axis */}
          <div
            className='absolute bg-black h-px w-full'
          />
          <div
            className='absolute bg-black h-full w-px'
          />

          {/* Mood Datapoints */}
          {coordinates.map((item, i) => (
            <Coordinate
              key={i}
              label={item.label}
              top={item.top}
              left={item.left}
            />
          ))}
        </div>
      </div>
    </>
  )
}
