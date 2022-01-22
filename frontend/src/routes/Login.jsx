import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import { URL_ACCOUNTS } from '../Config';
import Toast from '../components/Toast'
import { useSearchParams } from 'react-router-dom';

const spotifyIconImgUrl = new URL('../static/SpotifyIcon.png', import.meta.url).href

export default function Login() {

  const isAuthenticated = useUserStore(state => state.isAuthenticated)
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated)
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

  return (
    <>
      {isAuthenticated ? (<Navigate to="/" />) : (
        <div className='h-screen w-screen grid place-content-center bg-red-500'>
          { searchParams.get('error') && (<Toast duration={3000} line1="An Error Occured During Authentication." line2="Please Wait a Moment and Try Again." />) }
          <div>
            <h1 className='text-white text-6xl' style={{ fontFamily: 'Source Code Pro' }}>
              <span>Welcome to the S</span><span>potify</span>
              <span> V</span><span>ector</span>
              <span> M</span><span>achine</span>
            </h1>
            <div className='h-80'></div>
          </div>
          <button onClick={() => signin()} className="mx-auto w-80 mt-8 rounded-xl px-3 py-1 text-white text-lg align-middle bg-spotify text-white">Login with Spotify<img style={{ height: "30px", width: "30px" }} className="inline pb-1 pl-1" src={spotifyIconImgUrl} alt="Spotify Icon"></img></button>
        </div>
      )}
    </>
  )
}
