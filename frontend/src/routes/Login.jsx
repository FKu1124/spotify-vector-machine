import React, { useEffect } from 'react'
import { useUserStore } from '../store/userStore'
import { useCookies } from 'react-cookie';


const spotifyIconImgUrl = new URL('../static/SpotifyIcon.png', import.meta.url).href

export default function Login() {

    const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated)
    const [cookies, setCookie, removeCookie] = useCookies(['csrftoken', 'sessionid']);


    useEffect(() => {
        const getCookie = async () => {
          await fetch("http://localhost:8000/accounts/get_csrf_token", {
            method: "GET",
            headers: {
              'Accept': 'application/json',
            },
            credentials: 'include'
          })
        }
        getCookie();
        // setCookie("csrftoken", getCookieValue("csrftoken"))
      }, [])

    const signin = () => {
        fetch("http://localhost:8000/accounts/loginwithspotify", {
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
            if(data?.auth_url != "")
            // opener(data.auth_url)
            window.location.replace(data.auth_url)
        })
    }

    return (
        <div className='h-screen w-screen grid place-content-center bg-red-500'>
            <div>
                <h1 className='text-white text-6xl' style={{ fontFamily: 'Source Code Pro'}}>
                    <span>Welcome to the S</span><span>potify</span> 
                    <span> V</span><span>ector</span> 
                    <span> M</span><span>achine</span>
                </h1>
                <div className='h-80'></div>
            </div>
            <button onClick={signin} className="mx-auto w-80 mt-8 rounded-xl px-3 py-1 text-white text-lg align-middle bg-spotify text-white">Login with Spotify<img style={{ height: "30px", width: "30px" }} className="inline pb-1 pl-1" src={spotifyIconImgUrl} alt="Spotify Icon"></img></button>
        </div>
    )
}
