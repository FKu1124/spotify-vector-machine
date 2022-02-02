import React from 'react'
import { useUserStore } from '../store/userStore'
import { Icon } from '@chakra-ui/react'
import { HiOutlinePresentationChartLine } from 'react-icons/hi'
import SideDrawer from './SideDrawer'

export default function Navbar({ openPresentation }) {

  const { username } = useUserStore()

  return (
    <div className='bg-transparent flex justify-between top-0 sticky mx-3'>
      <div className='logo text-white font-bold'>
        SVM
        <Icon w={4} h={4} as={HiOutlinePresentationChartLine} className='mb-1 ml-4 cursor-pointer' onClick={() => openPresentation()} />
      </div>
      <div className='user text-white font-bold flex flex-row mx-3 mt-1'>
        <div className="username mr-4">
          { username }
        </div>
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg> */}
        <SideDrawer />
      </div>
    </div>
  )
}