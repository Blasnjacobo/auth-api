// eslint-disable-next-line no-unused-vars
import React, { useContext, createContext, useState, useEffect } from 'react'
import { AuthResponse, User } from '../types/types'
import { API_URL } from './constants.ts'

interface AuthProviderProps{
    children: React.ReactNode
}

const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  saveUser: (userData: AuthResponse) => {},
  getRefreshToken: () => {},
  getUser: () => ({} as User | undefined),
  signOut: () => {}
})

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string>('')
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState<User | undefined>()
  const [isLoading, setIsloading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function requestNewAccessToken (refreshToken:string) {
    try {
      const response = await fetch(`${API_URL}/refreshToken`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${refreshToken}`
        }
      })

      if (response.ok) {
        const json = await response.json()
        if (json.error) {
          throw new Error(json.error)
        }
        return json.body
      } else {
        throw new Error(response.statusText)
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async function getUserInfo (accessToken:string) {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        const json = await response.json()
        if (json.error) {
          throw new Error(json.error)
        }
        return json
      } else {
        throw new Error(response.statusText)
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async function checkAuth () {
    if (accessToken) {
      // todo El usuario esta autenticado
      const userInfo = await getUserInfo(accessToken)
      if (userInfo) {
        saveSessionInfo(userInfo, accessToken, getRefreshToken()!)
        setIsloading(false)
      }
    } else {
      // todo El usuatio no esta autenticado
      const token = getRefreshToken()
      if (token) {
        const newAccessToken = await requestNewAccessToken(token)
        if (newAccessToken) {
          const userInfo = await getUserInfo(newAccessToken)
          if (userInfo) {
            saveSessionInfo(userInfo, newAccessToken, token)
            setIsloading(false)
          }
        }
      }
    }
    setIsloading(false)
  }

  function signOut () {
    setIsAuthenticated(false)
    setAccessToken('')
    setUser(undefined)
    localStorage.removeItem('token')
  }

  function saveSessionInfo (userInfo:User, accessToken:string, refreshToken:string) {
    setAccessToken(accessToken)
    localStorage.setItem('token', JSON.stringify(refreshToken))
    setIsAuthenticated(true)
    setUser(userInfo)
  }

  function getAccessToken () {
    return accessToken
  }

  function getRefreshToken ():string|null {
    const tokenData = localStorage.getItem('token')
    if (tokenData) {
      const token = JSON.parse(tokenData)
      return token
    }
    return null
  }

  function saveUser (userData: AuthResponse) {
    saveSessionInfo(userData.body.user, userData.body.accessToken, userData.body.refreshToken)
  }

  function getUser () {
    return user
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, signOut }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext)
