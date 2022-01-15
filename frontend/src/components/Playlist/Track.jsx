import React from 'react'

export default function Track({track}) {
  return (
    <div className='w-11/12 h-20 bg-gray-300 mx-auto my-4 flex rounded-lg border border-black'>
      <img src={track.img} alt={track.track} className='border-r border-black rounded-l-lg'/>
      <div className="song-info text-left flex flex-col my-auto w-full px-3">
        <span className='title text-xl'>{track.title}</span>
        <span className='artist'>{track.artist}</span>
      </div>
      <div className="flex items-center mx-2 w-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  )
}
