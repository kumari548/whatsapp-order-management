import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Orders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const getStatusColor = (status) => {
    if (status === 'new') return { bg: 'rgba(59,130,246,0.3)', color: '#93c5fd' }
    if (status === 'preparing') return { bg: 'rgba(245,158,11,0.3)', color: '#fcd34d' }
    return { bg: 'rgba(34,197,94,0.3)', color: '#86efac' }
  }

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>Orders</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Manage and track all customer orders</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['all', 'new', 'preparing', 'delivered'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: filter === f ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)',
            color: filter === f ? '#34d399' : 'rgba(255,255,255,0.7)',
            cursor: 'pointer', fontSize: '13px',
            fontWeight: filter === f ? '600' : '400',
            textTransform: 'capitalize',
          }}>
            {f} ({f === 'all' ? orders.length : orders.filter(o => o.status === f).length})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', padding: '40px' }}>No orders found!</div>
        ) : (
          filtered.map(order => {
            const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items)
            const statusColor = getStatusColor(order.status)
            const cleanPhone = order.customer_phone.replace('whatsapp:', '').replace('+', '').replace(/\s/g, '')
            return (
              <div key={order.id} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)', padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>{order.customer_name || 'Unknown'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>{order.customer_phone}</div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: statusColor.bg, color: statusColor.color }}>
                    {order.status}
                  </span>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '6px' }}>ITEMS</div>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: '13px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span>{item.name}</span>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>🕐 {order.delivery_time || 'No time specified'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', cursor: 'pointer' }}>
                    <option value="new" style={{ color: 'black' }}>New</option>
                    <option value="preparing" style={{ color: 'black' }}>Preparing</option>
                    <option value="delivered" style={{ color: 'black' }}>Delivered</option>
                  </select>
                  <a href={'https://wa.me/' + cleanPhone} target="_blank" rel="noreferrer" style={{ padding: '8px 14px', background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.4)', borderRadius: '8px', color: '#4ade80', fontSize: '13px', textDecoration: 'none' }}>💬 Reply</a>
                </div>
              </div>
            )
          })
        )}
      </div>
    </PageLayout>
  )
}

export default Orders