import React from 'react'
import { useUserStore } from '../store/userStore'

export default function Navbar() {

  const { username } = useUserStore()

  return (
    <div className='h-6 bg-transparent flex justify-between top-0 sticky mx-3'>
      <div className='logo text-gray font-bold'>
        SVM
      </div>
      <div className='user text-gray font-bold flex flex-row mx-3'>
        <div className="username mr-1">
          { username }
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </div>
  )
}
