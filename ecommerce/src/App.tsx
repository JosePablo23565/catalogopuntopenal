import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProductList from './pages/ProductList'
import ProductForm from './pages/ProductForm'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/productos" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/admin/productos/nuevo" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="/admin/productos/editar/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}