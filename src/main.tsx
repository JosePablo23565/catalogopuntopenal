import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Verificar que el elemento #root existe
const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('❌ No se encontró el elemento #root en el HTML')
} else {
  ReactDOM.createRoot(rootElement).render(<App />)
}