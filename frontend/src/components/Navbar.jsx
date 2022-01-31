import React from 'react'
import { useUserStore } from '../store/userStore'

export default function Navbar({ openModal }) {

  const { username } = useUserStore()

  return (
    <div className='bg-transparent text-green1 font-black text-xl flex justify-between top-0 sticky mx-3'>
      <div >
        SVM
      </div>
      <div onClick={() => openModal(true)} className='user font-black flex flex-row mx-3 mt-1'>
        <div className="username mr-4">
          { username }
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>
  )
}