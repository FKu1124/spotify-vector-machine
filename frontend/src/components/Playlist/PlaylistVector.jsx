import React from 'react'

export default function PlaylistVector() {
  return (
    <div className='w-5/6 h-10 mx-auto my-10 flex items-center relative'>
      <div className="w-full bg-black absolute" style={{height: 2}}/>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute" style={{right: -9}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </div>
  )
}