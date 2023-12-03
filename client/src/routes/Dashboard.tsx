import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider.tsx'
import { API_URL } from '../auth/constants.ts'
import PortalLayout from '../Layout/PortalLayout.tsx'

interface Todo {
  _id: string
  title: string
  completed: boolean
  idUser: string
}

const Dashboard = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const auth = useAuth()

  useEffect(() => {
    loadTodos()
  }, [])

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    createTodo()
  }

  async function createTodo () {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          Authorization: `Bearer ${auth.getAccessToken()}`
        },
        body: JSON.stringify({
          title
        })
      })

      if (response.ok) {
        const json = await response.json()
        setTodos([json, ...todos])
      } else {
        // todo Mostrar error de conexion
      }
      const data = await response.json()
      setTodos(data)
    } catch (error) {}
  }

  async function loadTodos () {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': 'https://auth-api-back.vercel.app/api',
          Authorization: `Bearer ${auth.getAccessToken()}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      } else {
        // todo Mostrar error de conexion
      }
      const data = await response.json()
      setTodos(data)
    } catch (error) {}
  }
  const nameDashboard = (auth.getUser()?.name || '')
  return (
    <PortalLayout>
      <h1>Dashboard de {(nameDashboard[0]).toUpperCase()}{nameDashboard.slice(1)}</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Nuevo todo...' onChange={(e) => setTitle(e.target.value)} value={title} />
      </form>
      {todos.map((todo) => (
        // eslint-disable-next-line react/jsx-key
        <div key={todo._id}>{todo.title}</div>
      ))}
    </PortalLayout>
  )
}

export default Dashboard
