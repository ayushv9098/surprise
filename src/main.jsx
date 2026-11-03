import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Enable responsive :active pseudo-class state on iOS Safari / touch devices
if (typeof window !== 'undefined') {
  window.addEventListener('touchstart', () => {}, { passive: true });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
