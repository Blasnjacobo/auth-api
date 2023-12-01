import { Outlet, Navigate } from 'react-router-dom'
import React from 'react'
import { useAuth } from '../auth/AuthProvider.tsx'

const ProtectedRoute = () => {
  const auth = useAuth()
  return auth.isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default ProtectedRoute
