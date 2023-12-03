import React, { useState } from 'react'
import DefaultLayout from '../Layout/DefaultLayout.tsx'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.tsx'
import { API_URL } from '../auth/constants.ts'
import { AuthResponse, AuthResponseError } from '../types/types'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorResponse, setErrorResponse] = useState('')
  const auth = useAuth()
  const goTo = useNavigate()

  async function handleSubmit (e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(username, password)

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': 'https://auth-api-back.vercel.app/'
        },
        body: JSON.stringify({ username, password })
      })
      if (response.ok) {
        console.log('Login sucessfully')
        setErrorResponse('')
        const json = (await response.json()) as AuthResponse

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json)
          goTo('/dashboard')
        }
      } else {
        console.log('something went wrong')
        const json = (await response.json()) as AuthResponseError
        setErrorResponse(json.body.error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to='/dashboard' />
  }

  return (
    <DefaultLayout>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        {!!errorResponse && <div className='errorMessage'>{errorResponse}</div>}
        <label>Username</label>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
    </DefaultLayout>
  )
}

export default Login
