import { React, useState, useEffect } from 'react'
import moodMapping from '../../static/mood.json'
import Coordinate from './Coordinate'
import { repeat, throttle } from 'lodash'
import { useCoordinateSystemStore } from '../../store/coordinateSystemStore'


const colorsImagePath = new URL('../../static/colors.png', import.meta.url).href

export default function CoordinateSystem() {
  const [squareSize, setSquareSize] = useState(640)
  const [drawing, setDrawing] = useState(false)
  const [coordinates, setCoordinates] = useState(getMoodCoordinateArray())
  const [cnv, setCnv] = useState(null)

  const { startX, startY, endX, endY, setStartX, setStartY, setEndX, setEndY, cnvCtx, setCnvCtx } = useCoordinateSystemStore()

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
    let result = Math.floor(val_scaled * squareSize)
    return result
  }

  function start(e) {
    let x = e.clientX - cnv.getBoundingClientRect().left
    let y = e.clientY - cnv.getBoundingClientRect().top

    setStartX(x)
    setStartY(y)
    setDrawing(true)
  }

  function draw(e) {
    if (drawing == false || typeof (cnvCtx) !== 'object') return

    cnvCtx.clearRect(0, 0, squareSize, squareSize);

    // cnvCtx.fillRect(startX - 2, startY - 2, 4, 4);
    let img = document.getElementById("colors")
    let pat = cnvCtx.createPattern(img, 'repeat');
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
    let y = squareSize - ( e.clientY - cnv.getBoundingClientRect().top )

    setStartY(squareSize - startY)
    setEndX(x)
    setEndY(y)
    setDrawing(false)
  }

  return (
    <div className='relative mx-auto' style={{ width: squareSize, height: squareSize }}>

      {/* Color Palette for vector colors */}
      <img id="colors" src={colorsImagePath} width={squareSize} height={squareSize} className='object-contain hidden' />

      {/* Canvas layer we draw on */}
      <canvas id="cnv" width={squareSize} height={squareSize} className='absolute rounded-lg border border-black bg-green2'></canvas>
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

  )
}
