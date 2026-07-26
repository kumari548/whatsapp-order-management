import { useState, useEffect } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function Customers() {
  const [customers, setCustomers] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCustomers(res.data))
  }, [])

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>👥 Customers</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>All customers who ordered via WhatsApp</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              {['Name', 'Phone', 'Total Orders', 'Last Order', 'WhatsApp'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No customers yet!</td></tr>
            ) : (
              customers.map((c, i) => {
                const cleanPhone = c.customer_phone.replace('whatsapp:', '').replace('+', '').replace(/\s/g, '')
                return (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px', color: 'white', fontWeight: '500' }}>{c.customer_name || 'Unknown'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{c.customer_phone}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                        {c.total_orders} orders
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                      {new Date(c.last_order_at).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <a href={'https://wa.me/' + cleanPhone} target="_blank" rel="noreferrer" style={{ padding: '5px 10px', background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.4)', borderRadius: '6px', color: '#4ade80', fontSize: '12px', textDecoration: 'none' }}>💬 Message</a>
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

export default Customers