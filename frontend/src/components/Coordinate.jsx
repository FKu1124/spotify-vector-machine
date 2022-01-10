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
    cord.style.backgroundColor = 'blue'
    label.style.display = 'none'
  }

  return (
    <div
      key={props.i}
      id={props.label}
      onMouseEnter={e => showLabel(e, props.label)}
      style={{ position: 'absolute', top: props.top, left: props.left, height: '5px', width: '5px', backgroundColor: 'blue' }}>
      <span
        id={props.label + "-label"}
        onMouseLeave={e => hideLabel(e, props.label)}
        style={{ display: 'none' }}>{props.label}</span>
    </div>
  )
}
