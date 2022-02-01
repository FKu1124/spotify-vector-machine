import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { URL_ACCOUNTS } from '../Config'


export default function UserSettings() {

	const navigate = useNavigate()
	const [cookies, setCookie, removeCookie] = useCookies(['csrftoken','sessionid'])
	const [value, setValue] = useState(50)

	const MIN = 0
	const MAX = 100
	const STEP = 1

	const deleteAccount = async () => {
    const res = await fetch(`${URL_ACCOUNTS}delete`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies['csrftoken']
      },
      credentials: 'include'
    })
    const data = await res.json()
		console.log(data)
		removeCookie('csrftoken')
		removeCookie('sessionid')
		navigate("/login")
  }

	return (
		<div className='grid grid-cols-8'>
			<div className='col-start-1 col-end-4'>Default Volume</div>
			<div className='col-start-4 col-span-4'>
				<button onClick={() => deleteAccount()}>DELETE ACCOUNT</button>
			</div>
		</div>
	)
}
