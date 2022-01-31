import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import { URL_ACCOUNTS } from '../Config';
import Toast from '../components/Toast'
import { useSearchParams } from 'react-router-dom';
import { Icon } from '@chakra-ui/react'
import { FaSpotify } from 'react-icons/fa'

const bg_main = new URL('../static/bg_main.png', import.meta.url).href

export default function Login() {

  const { isAuthenticated, setIsAuthenticated } = useUserStore()
  const [cookies, setCookie, removeCookie] = useCookies(['csrftoken']);
  const [searchParams, setSearchParams] = useSearchParams();

  const getCookie = async () => {
    await fetch(`${URL_ACCOUNTS}get_csrf_token`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include'
    })
  }

  const checkAUTH = () => {
    fetch(`${URL_ACCOUNTS}check_authentication`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies['csrftoken']
      },
      credentials: 'include'
    }).then(res => res.json())
      .then(data => setIsAuthenticated(data.status))
  }

  const signin = () => {
    fetch(`${URL_ACCOUNTS}loginwithspotify`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies["csrftoken"]
      },
      credentials: 'include'
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data?.auth_url != "")
          // opener(data.auth_url)
          window.location.replace(data.auth_url)
      })
  }

  useEffect(() => {
    getCookie();
    checkAUTH();
  }, [])

  if (isAuthenticated === undefined) {
    return (
      <div className='h-screen w-screen' style={{ backgroundImage: `url(${bg_main})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* LOADING SCREEN */}
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? (<Navigate to="/" />) : (
        <div className='h-screen w-screen grid place-content-center' style={{ backgroundImage: `url(${bg_main})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {searchParams.get('error') && (<Toast duration={3000} line1="An Error Occured During Authentication." line2="Please Wait a Moment and Try Again." />)}
          <div>
            <h1 className='text-white text-center text-6xl' style={{ fontFamily: 'Source Code Pro' }}>
              <span>Welcome to the S</span><span>potify</span>
              <span> V</span><span>ector</span>
              <span> M</span><span>achine</span>
            </h1>
            <div className='h-80'></div>
          </div>
          <div onClick={() => signin()} className="mx-auto w-80 rounded-xl px-3 text-white text-lg text-center content-center align-middle bg-spotify cursor-pointer flex justify-center">
            <p>Login with Spotify<Icon w={4} h={4} as={FaSpotify} className='ml-2 mb-1' /></p>
          </div>
        </div>
      )}
    </>
  )
}
