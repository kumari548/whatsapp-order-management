import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Dashboard() {
  const [orders, setOrders] = useState([])
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:3000/api/orders', {
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
        `http://localhost:3000/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchOrders()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
  const newOrders = orders.filter(o => o.status === 'new').length
  const delivered = orders.filter(o => o.status === 'delivered').length

  const stats = [
    { label: 'Total orders', value: orders.length, bg: 'rgba(59,130,246,0.35)', border: 'rgba(59,130,246,0.5)' },
    { label: 'Revenue', value: '₹' + totalRevenue.toFixed(2), bg: 'rgba(34,197,94,0.35)', border: 'rgba(34,197,94,0.5)' },
    { label: 'New orders', value: newOrders, bg: 'rgba(245,158,11,0.35)', border: 'rgba(245,158,11,0.5)' },
    { label: 'Delivered', value: delivered, bg: 'rgba(139,92,246,0.35)', border: 'rgba(139,92,246,0.5)' },
  ]

  const getStatusColor = (status) => {
    if (status === 'new') return { bg: 'rgba(59,130,246,0.3)', color: '#93c5fd' }
    if (status === 'preparing') return { bg: 'rgba(245,158,11,0.3)', color: '#fcd34d' }
    return { bg: 'rgba(34,197,94,0.3)', color: '#86efac' }
  }

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>
          {greeting}, Aravind! 👋
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>
          Live orders update every 10 seconds • WhatsApp connected ✅
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: stat.bg,
            borderRadius: '14px',
            padding: '18px',
            border: '1px solid ' + stat.border,
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '600', color: 'white' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: 'white', fontWeight: '500', fontSize: '15px' }}>Live orders</span>
          <span style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>
            {orders.length} total
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Customer', 'Phone', 'Items', 'Delivery', 'Status', 'Update', 'WhatsApp'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500', background: 'rgba(0,0,0,0.1)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                  No orders yet — waiting for WhatsApp messages! 💬
                </td>
              </tr>
            ) : (
              orders.map(order => {
                const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items)
                const statusColor = getStatusColor(order.status)
                return (
                  <tr key={order.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 16px', color: 'white', fontWeight: '500' }}>{order.customer_name || 'Unknown'}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{order.customer_phone}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>{items.map(i => i.quantity + ' ' + i.unit + ' ' + i.name).join(', ')}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{order.delivery_time || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: statusColor.bg, color: statusColor.color }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' }}>
                        <option value="new" style={{ color: 'black' }}>New</option>
                        <option value="preparing" style={{ color: 'black' }}>Preparing</option>
                        <option value="delivered" style={{ color: 'black' }}>Delivered</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <a href={'https://wa.me/' + order.customer_phone.replace('whatsapp:', '').replace('+', '').replace(/\s/g, '')} target="_blank" rel="noreferrer" style={{ padding: '5px 10px', background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.4)', borderRadius: '6px', color: '#4ade80', fontSize: '12px', textDecoration: 'none', display: 'inline-block' }}>💬 Reply</a>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  )
}

export default Dashboard