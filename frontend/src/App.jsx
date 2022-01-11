import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import CoordinateSystem from './components/CoordinateSystem'
import SignUpModal from './components/SignUpModal'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = () => {
    fetch("http://localhost:8000/users/1/")
      .then(res => res.json())
      .then(json => console.log(json))
  }
  let ctx = null
  
  return (
    <div className='App h-screen w-screen bg-spotify'>
      <div className='flex flex-col bg-white'>
        <SignUpModal></SignUpModal>
      </div>
    {/* <div className='flex justify-center align-middle' style={{ backgroundColor: 'green', height: '700px'}}> */}
      {/* <canvas id="cnv" width="400" height="400" style={{position: 'absolute', backgroundColor: 'red'}}></canvas>
      <CoordinateSystem /> */}
    </div>
  )
}

export default App
