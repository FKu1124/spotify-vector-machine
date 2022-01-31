/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const spotifyIconImgUrl = new URL('../static/SpotifyIcon.png', import.meta.url).href


export default function SignUpModal() {
  const [open, setOpen] = useState(true)
  const [showLoginForm, setShowLoginForm] = useState(false)

  const [username, setUsername] = useState("Paul")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)

  const cancelButtonRef = useRef(null)

  const isPasswordValid = (e) => {
    // Handle min. requirements
    // Check if both entries are identical
    if(password === e.target.value)
      setPasswordError(false)
    else
      setPasswordError(true)
    // Check some requirements
  }

  const signUp = () => {
    fetch("http://localhost:8000/api-auth/register/", {
      method:"POST",
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json())
    .then(data => console.log(data))
  } 
  
  const logIn = () => {
    fetch("http://localhost:8000/api-auth/login/", {
      method:"POST",
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json())
    .then(data => console.log(data))
  }


  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => {}}>
        <div className="inline-flex flex-col items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-100 transition-opacity" /> */}
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {showLoginForm ? (
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-xl leading-6 font-bold text-gray-500">
                        Login
                      </Dialog.Title>
                      <input className="shadow appearance-none text-xs border-none px-1 py-1 mt-7 rounded w-full text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="passwordCheck" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                      <input className="shadow appearance-none text-xs border-none px-1 py-1 mt-2 rounded w-full text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                      <button onClick={() => logIn()}>Log In</button>
                    </div>
                  ) : (
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-xl leading-6 font-bold text-gray-500">
                        Sign Up
                        <p className="text-lg mt-5 font-medium">Step 1</p>
                        <p className="text-xs font-normal">Choose a Password</p>
                      </Dialog.Title>
                      <div className="mt-2">
                        <input className="shadow appearance-none text-xs border-none px-1 py-1 mt-2 rounded w-full text-gray-500 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        <input className={`shadow appearance-none text-xs px-1 py-1 mt-2 rounded w-full text-gray-500 leading-tight focus:outline-none focus:shadow-outline" + ${passwordError ? "border border-red-500" : "border-none"}`} id="passwordCheck" type="password" placeholder="Confirm Password" onChange={isPasswordValid}/>
                      </div>
                      <div className="greyscale">
                          <p className="text-lg mt-7 font-medium">Step 2</p>
                          <p className="text-xs">Link Your Spotify Account</p>
                        <div className="mt-4">
                          <button onClick={() => signUp()} className="rounded-xl px-2 py-0.5 text-white text-base align-middle bg-spotify" style={{color:"#FFFFFF"}}>Sign Up &amp; Connect to Spotify<img style={{height:"20px", width:"20px"}} className="inline pb-1 pl-1" src={spotifyIconImgUrl} alt="Spotify Icon"></img></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={() => setShowLoginForm(!showLoginForm)} className="text-base">{showLoginForm ? "Sign Up" : "Log In"}</button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
