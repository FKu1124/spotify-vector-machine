import { React, useState, useEffect } from 'react'
import moodMapping from '../static/mood.json'
import Coordinate from './Coordinate'
import { throttle } from 'lodash'

export default function CoordinateSystem() {

  const square_site_length = 400

  const [drawing, setDrawing] = useState(false)
  const [coordinates, setCoordinates] = useState(getMoodCoordinateArray())
  const [cnv, setCnv] = useState(null)
  const [cnvCtx, setCnvCtx] = useState(null)
  const [startX, setStartX] = useState(null)
  const [startY, setStartY] = useState(null)
  const [endX, setEndX] = useState(null)
  const [endY, setEndY] = useState(null)
  
  useEffect(() => {
    let canvas = document.getElementById("cnv")
    let canvasContext = canvas.getContext("2d")

    setCnv(canvas)
    setCnvCtx(canvasContext)
  }, [])
  
  function getMoodCoordinateArray() {
    let moodArr = []

    moodMapping.forEach(item => (
      moodArr.push(
        {
          "top": getScaledCoordinate(item.coordinate.y),
          "left": getScaledCoordinate(item.coordinate.x),
          "label": item.label
        }
      )
    ))

    return moodArr
  }

  function getScaledCoordinate(val) {
    let val_scaled = (val + 1) / 2
    let result = Math.floor(val_scaled * square_site_length)
    return result
  }

  function start(e) {
    let x = (e.clientX - cnv.getBoundingClientRect().left)
    let y = e.clientY

    setStartX(x)
    setStartY(y)
    setDrawing(true)
  }

  function draw(e) {
    if (drawing == false || typeof(cnvCtx) !== 'object') return

    cnvCtx.clearRect(0, 0, 400, 400);
    cnvCtx.beginPath()
    cnvCtx.moveTo(startX, startY)
    cnvCtx.lineTo(e.clientX - cnv.getBoundingClientRect().left, e.clientY)
    cnvCtx.stroke()
  }

  function end(e, cnv) {
    if (drawing == false || typeof (cnvCtx) !== 'object') return

    let x = e.clientX - cnv.getBoundingClientRect().left
    let y = e.clientY

    setEndX(x)
    setEndY(y)
    setDrawing(false)

    console.log([startX, startY, endX, endY])
  }

  return (
    <>
      <canvas id="cnv" width="400" height="400" className='absolute bg-gradient-to-r bg-white'></canvas>
      <div
        onMouseDown={e => start(e)}
        onMouseMove={throttle(draw, 80)}
        onMouseUp={e => end(e, cnv)}
        onMouseLeave={e => end(e, cnv)}
        id='canvas'
        className='align-middle relative'
        style={{ width: square_site_length, height: square_site_length, backgroundColor: "transparent", position: 'fixed' }}
        >

        <div 
          className='absolute bg-black'
          style={{ top: '199px', height: '1px', width: square_site_length }}
        />
        {/* <div style={{ position: 'absolute', top: '195px', left: '395px', height: '10px', width:'10px', backgroundColor: 'grey'}} /> */}
        <div
          className='absolute bg-black'
          style={{ left: '199px', height: square_site_length, width: '1px' }}
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
    </>
  )
}
