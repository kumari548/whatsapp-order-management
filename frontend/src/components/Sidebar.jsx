import { useNavigate } from 'react-router-dom'

const navSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/', icon: '🏠' },
    ]
  },
  {
    label: 'Shop',
    items: [
      { label: 'Orders', path: '/orders', icon: '📦' },
      { label: 'Products', path: '/products', icon: '🛍' },
      { label: 'Categories', path: '/categories', icon: '📂' },
      { label: 'Inventory', path: '/inventory', icon: '📦' },
      { label: 'Customers', path: '/customers', icon: '👥' },
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'AI Assistant', path: '/ai-assistant', icon: '🤖' },
      { label: 'WhatsApp', path: '/whatsapp', icon: '💬' },
      { label: 'Deliveries', path: '/deliveries', icon: '🚚' },
    ]
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', path: '/analytics', icon: '📊' },
      { label: 'Reports', path: '/reports', icon: '📈' },
    ]
  },
  {
    label: 'Account',
    items: [
      { label: 'Notifications', path: '/notifications', icon: '🔔' },
      { label: 'Settings', path: '/settings', icon: '⚙️' },
      { label: 'Profile', path: '/profile', icon: '👤' },
    ]
  },
]

function Sidebar({ isOpen }) {  const navigate = useNavigate()
  const currentPath = window.location.pathname

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{
      width: '220px',
      background: 'rgba(6,78,59,0.95)',
      position: 'fixed',
      left: isOpen ? '0' : '-220px',
      top: 0,
      bottom: 0,
      transition: 'left 0.25s ease',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky', top: 0,
        background: 'rgba(6,78,59,0.98)',
        zIndex: 3,
      }}>
        <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>💬 ShopOrders</div>
        <div style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '2px' }}>WhatsApp Dashboard</div>
      </div>

      <nav style={{ flex: 1, paddingBottom: '12px' }}>
        {navSections.map(section => (
          <div key={section.label}>
            <div style={{
              padding: '10px 16px 4px',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: '600',
            }}>
              {section.label}
            </div>
            {section.items.map(item => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '9px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  color: currentPath === item.path ? '#34d399' : 'rgba(255,255,255,0.65)',
                  background: currentPath === item.path ? 'rgba(52,211,153,0.15)' : 'transparent',
                  borderLeft: currentPath === item.path ? '3px solid #34d399' : '3px solid transparent',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                }}
              >
                {item.icon} {item.label}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div
          onClick={handleLogout}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            color: '#fca5a5',
            fontSize: '13px',
          }}
        >
          🚪 Logout
        </div>
      </div>
    </div>
  )
}

export default Sidebar