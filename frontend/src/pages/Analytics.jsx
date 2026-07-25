import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Analytics() {
  const [orders, setOrders] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get('http://localhost:3000/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
  const totalOrders = orders.length
  const delivered = orders.filter(o => o.status === 'delivered').length
  const newOrders = orders.filter(o => o.status === 'new').length
  const preparing = orders.filter(o => o.status === 'preparing').length

  const itemFrequency = {}
  orders.forEach(order => {
    const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items)
    items.forEach(item => {
      itemFrequency[item.name] = (itemFrequency[item.name] || 0) + item.quantity
    })
  })
  const topProducts = Object.entries(itemFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const customerFrequency = {}
  orders.forEach(o => {
    const key = o.customer_name || o.customer_phone
    customerFrequency[key] = (customerFrequency[key] || 0) + 1
  })
  const topCustomers = Object.entries(customerFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const stats = [
    { label: 'Total Revenue', value: '₹' + totalRevenue.toFixed(2), bg: 'rgba(34,197,94,0.35)', border: 'rgba(34,197,94,0.5)' },
    { label: 'Total Orders', value: totalOrders, bg: 'rgba(59,130,246,0.35)', border: 'rgba(59,130,246,0.5)' },
    { label: 'Delivered', value: delivered, bg: 'rgba(139,92,246,0.35)', border: 'rgba(139,92,246,0.5)' },
    { label: 'Pending', value: newOrders + preparing, bg: 'rgba(245,158,11,0.35)', border: 'rgba(245,158,11,0.5)' },
  ]

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>📊 Analytics</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Overview of your shop performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: '14px', padding: '18px', border: '1px solid ' + stat.border, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '600', color: 'white' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>🔥 Top Products</div>
          {topProducts.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No data yet!</div>
          ) : (
            topProducts.map(([name, qty], i) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#34d399', fontWeight: '600', fontSize: '14px' }}>#{i + 1}</span>
                  <span style={{ color: 'white', fontSize: '14px' }}>{name}</span>
                </div>
                <span style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>{qty} units</span>
              </div>
            ))
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>👥 Top Customers</div>
          {topCustomers.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No data yet!</div>
          ) : (
            topCustomers.map(([name, count], i) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#34d399', fontWeight: '600', fontSize: '14px' }}>#{i + 1}</span>
                  <span style={{ color: 'white', fontSize: '14px' }}>{name}</span>
                </div>
                <span style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>{count} orders</span>
              </div>
            ))
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>📦 Order Status Breakdown</div>
          {[
            { label: 'New', value: newOrders, color: '#93c5fd', bg: 'rgba(59,130,246,0.3)' },
            { label: 'Preparing', value: preparing, color: '#fcd34d', bg: 'rgba(245,158,11,0.3)' },
            { label: 'Delivered', value: delivered, color: '#86efac', bg: 'rgba(34,197,94,0.3)' },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{s.label}</span>
                <span style={{ color: s.color, fontSize: '13px', fontWeight: '500' }}>{s.value}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: totalOrders ? (s.value / totalOrders * 100) + '%' : '0%', background: s.bg, borderRadius: '3px', transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>💰 Revenue Summary</div>
          {[
            { label: 'Total revenue', value: '₹' + totalRevenue.toFixed(2) },
            { label: 'Average order value', value: totalOrders ? '₹' + (totalRevenue / totalOrders).toFixed(2) : '₹0' },
            { label: 'Total orders', value: totalOrders },
            { label: 'Delivery rate', value: totalOrders ? Math.round(delivered / totalOrders * 100) + '%' : '0%' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{item.label}</span>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

export default Analytics