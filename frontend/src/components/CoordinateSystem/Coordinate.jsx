import React from 'react'

export default function Coordinate(props) {
  return (
    <div 
      className='absolute w-1 h-1 flex items-center justify-center'
      style={{ top: props.top, left: props.left }} 
    >
      <span
        key={props.i}
        id={props.label}
        className={`text-tiny transform hover:scale-175 p-4`}
      >
          {props.label}
      </span>
    </div>
  )
}
