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
      .then(data => { 
        setIsAuthenticated(data.status)
        // console.log(data.status)
        // console.log(isAuthenticated)
      })
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
        // console.log(data)
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
        <>
        <div className='w-full h-screen bg-deepBlue absolute'>
            {/* Waves */}
            <svg id="visual" viewBox="0 0 1920 1080" className='w-full absolute bottom-0 '>
                <g>
                    <path d="M0 784L45.7 779.2C91.3 774.3 182.7 764.7 274.2 739.7C365.7 714.7 457.3 674.3 548.8 666.8C640.3 659.3 731.7 684.7 823 684C914.3 683.3 1005.7 656.7 1097 670.8C1188.3 685 1279.7 740 1371.2 749.3C1462.7 758.7 1554.3 722.3 1645.8 715.3C1737.3 708.3 1828.7 730.7 1874.3 741.8L1920 753L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#70ae91"></path>
                    <path d="M0 727L45.7 726C91.3 725 182.7 723 274.2 735.5C365.7 748 457.3 775 548.8 777.5C640.3 780 731.7 758 823 767.7C914.3 777.3 1005.7 818.7 1097 817.3C1188.3 816 1279.7 772 1371.2 748.2C1462.7 724.3 1554.3 720.7 1645.8 721C1737.3 721.3 1828.7 725.7 1874.3 727.8L1920 730L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#599f7e"></path>
                    <path d="M0 900L45.7 901C91.3 902 182.7 904 274.2 890C365.7 876 457.3 846 548.8 827.7C640.3 809.3 731.7 802.7 823 817.5C914.3 832.3 1005.7 868.7 1097 889.3C1188.3 910 1279.7 915 1371.2 901.8C1462.7 888.7 1554.3 857.3 1645.8 852.8C1737.3 848.3 1828.7 870.7 1874.3 881.8L1920 893L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#40916c"></path>
                    <path d="M0 963L45.7 959.7C91.3 956.3 182.7 949.7 274.2 940C365.7 930.3 457.3 917.7 548.8 918.8C640.3 920 731.7 935 823 933.8C914.3 932.7 1005.7 915.3 1097 908.8C1188.3 902.3 1279.7 906.7 1371.2 907.5C1462.7 908.3 1554.3 905.7 1645.8 909.2C1737.3 912.7 1828.7 922.3 1874.3 927.2L1920 932L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#377d5d"></path>
                    <path d="M0 990L45.7 986.2C91.3 982.3 182.7 974.7 274.2 968.7C365.7 962.7 457.3 958.3 548.8 965.2C640.3 972 731.7 990 823 990.5C914.3 991 1005.7 974 1097 975.7C1188.3 977.3 1279.7 997.7 1371.2 1005.8C1462.7 1014 1554.3 1010 1645.8 1008.8C1737.3 1007.7 1828.7 1009.3 1874.3 1010.2L1920 1011L1920 1081L1874.3 1081C1828.7 1081 1737.3 1081 1645.8 1081C1554.3 1081 1462.7 1081 1371.2 1081C1279.7 1081 1188.3 1081 1097 1081C1005.7 1081 914.3 1081 823 1081C731.7 1081 640.3 1081 548.8 1081C457.3 1081 365.7 1081 274.2 1081C182.7 1081 91.3 1081 45.7 1081L0 1081Z" fill="#2f6a4f"></path> 
                </g>
            </svg>

        </div>
        <div className='h-screen w-screen absolute grid place-content-center'>
          {searchParams.get('error') && (<Toast duration={3000} line1="An Error Occured During Authentication." line2="Please Wait a Moment and Try Again." />)}
          <div>
            <h1 className='text-white text-center text-6xl mb-52' style={{ fontFamily: 'Source Code Pro' }}>
              <span>Welcome to the S</span><span>potify</span>
              <span> V</span><span>ector</span>
              <span> M</span><span>achine</span>
            </h1>
          </div>
          <div onClick={() => signin()} className="mx-auto w-80 rounded-lg p-3 text-white text-2xl text-center content-center align-middle bg-green5 cursor-pointer flex justify-center">
            <p>Login with Spotify<Icon w={4} h={4} as={FaSpotify} className='ml-2 mb-1' /></p>
          </div>
        </div>
        </>
      )}
    </>
  )
}
