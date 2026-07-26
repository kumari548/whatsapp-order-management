import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Reports() {
  const [orders, setOrders] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
  }, [])

  const downloadCSV = () => {
    const headers = ['ID', 'Customer', 'Phone', 'Items', 'Delivery Time', 'Status', 'Created At']
    const rows = orders.map(o => {
      const items = Array.isArray(o.items) ? o.items : JSON.parse(o.items)
      return [
        o.id,
        o.customer_name || 'Unknown',
        o.customer_phone,
        items.map(i => i.quantity + ' ' + i.unit + ' ' + i.name).join(' | '),
        o.delivery_time || '-',
        o.status,
        new Date(o.created_at).toLocaleString('en-IN'),
      ]
    })
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'orders_report.csv'
    a.click()
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
  const delivered = orders.filter(o => o.status === 'delivered').length

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>📈 Reports</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Download your shop reports</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Total Revenue', value: '₹' + totalRevenue.toFixed(2) },
          { label: 'Delivered', value: delivered },
          { label: 'Delivery Rate', value: orders.length ? Math.round(delivered / orders.length * 100) + '%' : '0%' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{stat.label}</span>
            <span style={{ color: 'white', fontSize: '22px', fontWeight: '600' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '24px' }}>
        <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '8px' }}>📥 Download Reports</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '20px' }}>
          Export your orders data as CSV file — open in Excel or Google Sheets
        </div>
        <button onClick={downloadCSV} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📥 Download Orders CSV
        </button>
      </div>
    </PageLayout>
  )
}

export default Reports