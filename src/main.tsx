import { supabase } from './services/supabaseClient'

async function testConnection() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('✅ Conexión exitosa! Productos:', data)
  }
}

testConnection()

import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
