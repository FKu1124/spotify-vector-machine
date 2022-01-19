import React from 'react'
import { useState } from 'react'
import './ccs_header.css'

export default function CoordinateSystemHeader() {
  const [length, setLength] = useState(30)

  const onLengthChange = e => {
    setLength(e.target.value)
  }

  return (
    <div className='flex-row w-3/4 mx-auto mb-4'>
      {/* Header main text and run button */}
      <div className="header flex flex-row items-center justify-center gap-3">
        <h1 className='text-xl'>
          Let us take you from <span style={{ 'textShadow': '1px 1px #4895ef' }}>tired</span> to <span style={{ 'textShadow': '1px 1px #B5179E' }}>energized</span>
        </h1> 
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <select name="genre" id="genre" className='w-full bg-gray-400 rounded-md text-white text-sm h-8'>
            <option value="rock">Rock</option>
            <option value="rock">Pop</option>
            <option value="rock">Jazz</option>
          </select>
        </div>
        {/* Reset Button */}
        {/* Todo Add Reset function */}
        <div className="reset w-1/8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        {/* Save Button */}
        {/* TODO add Save function */}
        <div className="save w-1/8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </div>
      </div>

    </div>
  )
}
