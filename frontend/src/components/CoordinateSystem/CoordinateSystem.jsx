import { React, useState, useEffect } from 'react'
import moodMapping from '../../static/mood.json'
import Coordinate from './Coordinate'
import Preview from './Preview'
import { repeat, throttle } from 'lodash'
import { useCookies } from 'react-cookie';
import './ccs_header.css'
import { usePlayerStore } from '../../store/playerStore';
import { URL_ACCOUNTS } from '../../Config';
import { getTrack } from '../../utils'

const colorsImagePath = new URL('../../static/colors.png', import.meta.url).href

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

  const [startPreviews, setStartPreviews] = useState([])
  const [endPreviews, setEndPreviews] = useState([])
  const [showPreviews, setShowPreviews] = useState(false)
  
  const [startProfile, setStartProfile] = useState()
  const [endProfile, setEndProfile] = useState()
  
  // const [remountCount, setRemountCount] = useState(0);
  // const refresh = () => setRemountCount(remountCount + 1);
  
  // const showPreviews = startPreviews.length !== 0

  // HEADER SECTION

  const [cookies] = useCookies(['csrftoken']);
  const { token } = usePlayerStore()

  const onLengthChange = e => {
    setLength(e.target.value)
  }

  const onGenreChange = e => {
    setGenre(e.target.value)
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
      scaledStartX, scaledStartY, scaledEndX, scaledEndY
    })
  }

  function getPreviews() {
    let vector_json = getStringifiedVector()

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
      })
  }
  
  function getPreviewTrackData(data, token, pos) {
    let previews = []
    let uris = []
    for (let profile in data) {
      uris.push(data[profile])
    }

    getTrack(token, uris.join(',')).then(res => {
      for(let track in res.tracks) {
        let album = res.tracks[track].album.images[2].url
        let uri = track.uri
        previews.push({ "album": album, "uri": uri })
      }
      pos === 'start' ? setStartPreviews(previews) : setEndPreviews(previews)
    })
    return previews
  }

  function sendVector() {
    let vector_json = getStringifiedVector()

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
        console.log(data)
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
        <h1 className='text-xl'>
          Let us take you from <span style={{ 'textShadow': '1px 1px #4895ef' }}>tired</span> to <span style={{ 'textShadow': '1px 1px #B5179E' }}>energized</span>
        </h1>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 p-2 cursor-pointer bg-green1 text-white rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={getPreviews}>
          <path strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 p-2 cursor-pointer bg-gray-400 text-white rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={sendVector}>
          <path strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </div>

      {/* Filter options & Action button */}
      <div className="filter flex items-end justify-center gap-3">
        {/* Playlist Length Slider */}
        <div className="length-slider w-1/3 flex-col text-left">
          <span className='text-tiny'>Playlist length:</span>
          <div className="slider flex w-full text-white h-8 bg-gray-400 rounded-md items-center px-3">
            <input type="range" onChange={onLengthChange} min="10" max="120" step="5" className='bg-gray-400' />
            <span className='text-tiny p-1 w-1/4'>{length} min</span>
          </div>
        </div>
        {/* Genre Selection */}
        <div className="genre-selection w-1/4 flex-col text-left">
          <span className='text-tiny'>Genre:</span>
          <select name="genre" id="genre" className='w-full bg-gray-400 rounded-md text-white text-sm h-8' onChange={onGenreChange}>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="jazz">Jazz</option>
          </select>
        </div>
        {/* Reset Button */}
        {/* Todo Add Reset function */}
        <div className="reset w-1/8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={resetVector}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        {/* Save Button */}
        {/* TODO add Save function */}
        <div className="save w-1/8 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </div>
      </div>

      {/* COORDINATE SYSTEM */}
      <div className='relative mx-auto' style={{ width: squareSize, height: squareSize }}>
        {/* Color Palette for vector colors */}
        <img id="colors" src={colorsImagePath} width={squareSize} height={squareSize} className='object-cover hidden' />

        {/* Canvas layer we draw on */}
        <canvas id="cnv" width={squareSize} height={squareSize} className='absolute rounded-lg bg-green3 border border-black'></canvas>

        <div
          className='absolute flex flex-wrap items-center justify-center gap-4 opacity-50 z-50'
          style={{ top: squareSize - startY - 82, left: startX - 82, width: 164, height: 164, display: startPreviews.length !== 0 ? 'flex' : 'none' }}
        > 
          {startPreviews.map((entry, i) => (
            <img
              // key={i}
              src={entry.album}
              // src="https://i.scdn.co/image/ab67616d00004851a5ce236c22035a02cf87d4de"
              alt='qwe'
              className='flex-1/2'
              // style={{height: '32px', width: '32px'}} 
              // onClickCapture={}
              // className={getClassname(entry[0])}
            />
          ))}
        </div>

        <div
          className='absolute flex flex-wrap items-center justify-center gap-4 opacity-50 z-50'
          style={{ top: squareSize - endY - 82, left: endX - 82, width: 164, height: 164, display: endPreviews.length !== 0 ? 'flex' : 'none' }}
        > 
          {endPreviews.map((entry, i) => (
            <img
              // key={i}
              src={entry.album}
              // src="https://i.scdn.co/image/ab67616d00004851a5ce236c22035a02cf87d4de"
              alt='qwe'
              className='flex-1/2'
              // style={{height: '32px', width: '32px'}} 
              // onClickCapture={}
              // className={getClassname(entry[0])}
            />
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
