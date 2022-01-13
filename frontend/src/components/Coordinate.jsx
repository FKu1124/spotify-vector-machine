import React from 'react'

export default function Coordinate(props) {

  function showLabel(e, id) {
    let cord = e.target
    let label = document.getElementById(id + '-label')
    cord.style.backgroundColor = 'transparent'
    label.style.display = 'block'
  }
  function hideLabel(e, id) {
    let cord = document.getElementById(id)
    let label = document.getElementById(id + '-label')
    cord.style.backgroundColor = 'black'
    label.style.display = 'none'
  }

  return (
    <div 
      className='absolute w-3 h-3 bg-white flex items-center justify-center'
      style={{ top: props.top, left: props.left }} 
    >
      <span
        key={props.i}
        id={props.label}
        onMouseEnter={e => showLabel(e, props.label)}
        className={`w-1 h-1 bg-black rounded-full`}
      >
        <span
          id={props.label + "-label"}
          onMouseLeave={e => hideLabel(e, props.label)}
          style={{ display: 'none' }}>{props.label}</span>
      </span>
    </div>
  )
}
