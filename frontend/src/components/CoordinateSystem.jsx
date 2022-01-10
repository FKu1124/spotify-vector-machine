import { React, useState } from 'react'
import moodMapping from '../static/mood.json'
import Coordinate from './Coordinate'

export default function CoordinateSystem() {

  const square_site_length = 400
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

  const moodCoordinates = moodArr

  const [drawing, setDrawing] = useState(false)
  const [coordinates, setCoordinates] = useState(moodCoordinates)

  function getScaledCoordinate(val) {
    let val_scaled = (val + 1) / 2
    return val_scaled * square_site_length
  }

  let cnv, cnv_ctx, startX, startY, endX, endY = null

  function start(e) {
    console.log("start")

    cnv = document.getElementById("cnv")
    cnv_ctx = cnv.getContext("2d")
    
    startX = (e.clientX - cnv.getBoundingClientRect().left)
    startY = e.clientY
    setDrawing(true)
  }

  function draw(e) {
    
    console.log();
    if (drawing == false || typeof(cnv_ctx) !== 'object') {
      return null
    }
    console.log("draw")
    cnv_ctx.clearRect(0, 0, 400, 400);

    cnv_ctx.beginPath()
    cnv_ctx.moveTo(startX, startY)
    cnv_ctx.lineTo(e.clientX - cnv.getBoundingClientRect().left, e.clientY)
    cnv_ctx.stroke()
  }

  function end(e, cnv) {
    if (drawing == false || typeof (cnv_ctx) !== 'object') {
      return null
    }
    console.log("end")

    endX = e.clientX - cnv.getBoundingClientRect().left
    endY = e.clientY

    setDrawing(false)

    console.log([startX, startY, endX, endY])
  }

  return (
    <div
      onMouseDown={e => start(e)}
      onMouseMove={e => draw(e)}
      onMouseUp={e => end(e, cnv)}
      id='canvas'
      className='align-middle relative'
      style={{ width: square_site_length, height: square_site_length, backgroundColor: "transparent", position: 'fixed' }}
    >
      <div style={{ position: 'absolute', top: '200px', left: '0px', height: '2px', width: square_site_length, backgroundColor: 'grey' }} />
      <div style={{ position: 'absolute', top: '0px', left: '200px', height: square_site_length, width: '2px', backgroundColor: 'grey' }} />

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
  )
}
