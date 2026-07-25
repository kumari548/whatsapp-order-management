import { useState } from 'react'
import Sidebar from './Sidebar'

function PageLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(
    localStorage.getItem('sidebarOpen') === 'true'
  )

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    localStorage.setItem('sidebarOpen', newState)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'url(/shop.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 1,
      }} />

      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '16px',
          left: sidebarOpen ? '236px' : '16px',
          zIndex: 10,
          width: '40px', height: '40px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          transition: 'left 0.25s ease',
        }}
      >
        ☰
      </button>

      <Sidebar isOpen={sidebarOpen} />

      <div style={{
        flex: 1, padding: '28px', paddingTop: '70px',
        marginLeft: sidebarOpen ? '220px' : '0',
        transition: 'margin-left 0.25s ease',
        position: 'relative', zIndex: 2, overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  )
}

export default PageLayout