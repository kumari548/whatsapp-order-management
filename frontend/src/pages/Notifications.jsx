import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Notifications() {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:3000/api/orders', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:3000/api/inventory', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(([o, i]) => {
      setOrders(o.data)
      setInventory(i.data)
    })
  }, [])

  const newOrders = orders.filter(o => o.status === 'new')
  const lowStockItems = inventory.filter(i => i.quantity <= i.low_stock_alert)

  const notifications = [
    ...newOrders.map(o => ({
      type: 'order',
      icon: '📦',
      title: 'New order received',
      message: `${o.customer_name || 'Unknown'} placed a new order`,
      time: new Date(o.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      color: 'rgba(59,130,246,0.3)',
      border: 'rgba(59,130,246,0.4)',
    })),
    ...lowStockItems.map(i => ({
      type: 'stock',
      icon: '⚠️',
      title: 'Low stock alert',
      message: `${i.item_name} is running low — only ${i.quantity} ${i.unit} left`,
      time: 'Now',
      color: 'rgba(245,158,11,0.3)',
      border: 'rgba(245,158,11,0.4)',
    })),
  ]

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>🔔 Notifications</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>
          {notifications.length} active alerts
        </p>
      </div>

      {notifications.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
          ✅ All good! No notifications right now.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n, i) => (
            <div key={i} style={{ background: n.color, borderRadius: '12px', border: '1px solid ' + n.border, backdropFilter: 'blur(12px)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '24px' }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: '500', fontSize: '14px', marginBottom: '2px' }}>{n.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>{n.message}</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{n.time}</div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}

export default Notifications