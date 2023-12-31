import React, { useState } from 'react'
import DefaultLayout from '../Layout/DefaultLayout.tsx'
import { useAuth } from '../auth/AuthProvider.tsx'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthResponse, AuthResponseError } from '../types/types'
import { API_URL } from '../auth/constants.ts'

export default function Signup () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorResponse, setErrorResponse] = useState('')

  const auth = useAuth()
  const goTo = useNavigate()

  async function handleSubmit (e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(username, password, name)

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://auth-api-eosin.vercel.app',
          'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE',
          'Access-Control-Max-Age': '3600',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ username, password, name })
      })
      if (response.ok) {
        const json = (await response.json()) as AuthResponse
        console.log(json)
        setUsername('')
        setPassword('')
        setName('')
        alert('You have set up you account successfully')
        goTo('/')
      } else {
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
      <form onSubmit={handleSubmit} className='form'>
        <h1>Signup</h1>
        {!!errorResponse && <div className='errorMessage'>{errorResponse}</div>}
        <label>Name</label>
        <input
          type='text'
          name='name'
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label>Username</label>
        <input
          type='text'
          name='username'
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label>Password</label>
        <input
          type='password'
          name='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button>Create account</button>
      </form>
    </DefaultLayout>
  )
}
