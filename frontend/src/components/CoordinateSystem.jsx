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

  const setPosition = (e, start) => {
    let tmp_cords = [...coordinates]
    let canvas = document.getElementById("canvas")
    if (start) {
      tmp_cords.push(
        {
          "top": e.clientY - canvas.getBoundingClientRect().top,
          "left": e.clientX - canvas.getBoundingClientRect().left,
          "label": "START"
        }
      )
      console.log(tmp_cords);
      setCoordinates(tmp_cords)
    } else {

    }
  }


  return (
    <div
      onMouseDown={e => setPosition(e, true)}
      onMouseUp={e => setPosition(e, false)}
      // onMouseMove={e => draw(e)}
      id='canvas'
      className='align-middle relative'
      style={{ width: square_site_length, height: square_site_length, backgroundColor: "red", position: 'fixed' }}
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
