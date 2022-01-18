import React, { useEffect }  from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from '../store/userStore'
import { useCookies } from 'react-cookie';

export default function ProtectedRoute({ component: Component }) {

  const { isAuthenticated, setIsAuthenticated } = useUserStore()
  const [cookies, setCookie, removeCookie] = useCookies(['csrftoken']);

  useEffect(() => {
    const getCSRF = async () => await fetch("http://localhost:8000/accounts/get_csrf_token", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include'
    })

    const checkAUTH = async () => {
      const res = await fetch("http://localhost:8000/accounts/check_authentication", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': cookies['csrftoken']
        },
        credentials: 'include'
      })
      const data = await res.json()
      setIsAuthenticated(data.status)
    }

    getCSRF()
    checkAUTH()
  }, [isAuthenticated])

  return (
      <>
        { isAuthenticated ? <Component /> : <Navigate to="/login" /> }
      </>
  );
}