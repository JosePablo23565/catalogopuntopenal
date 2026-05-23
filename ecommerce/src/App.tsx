import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProductList from './pages/ProductList'
import ProductForm from './pages/ProductForm'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Catálogo público */}
        <Route path="/" element={<Catalog />} />
        <Route path="/producto/:id" element={<ProductDetail />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Admin protegido */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/productos" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
        <Route path="/admin/productos/nuevo" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="/admin/productos/editar/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}