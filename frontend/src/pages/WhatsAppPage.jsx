import { useState } from 'react'
import PageLayout from '../components/PageLayout'

function WhatsAppPage() {
  const [autoReply, setAutoReply] = useState('Thank you for your order! We will process it shortly.')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>💬 WhatsApp</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Manage your WhatsApp settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>📱 Sandbox Info</div>
          {[
            { label: 'Sandbox Number', value: '+1 415 523 8886' },
            { label: 'Status', value: '✅ Connected' },
            { label: 'Provider', value: 'Twilio' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{item.label}</span>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '16px' }}>🤖 Auto Reply Message</div>
          <textarea
            value={autoReply}
            onChange={e => setAutoReply(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={handleSave} style={{ marginTop: '12px', padding: '10px 20px', background: saved ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {saved ? '✅ Saved!' : 'Save message'}
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '20px', gridColumn: 'span 2' }}>
          <div style={{ color: 'white', fontWeight: '500', fontSize: '15px', marginBottom: '8px' }}>📋 How to connect a customer</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.8' }}>
            1. Customer saves <strong style={{ color: 'white' }}>+1 415 523 8886</strong> on WhatsApp<br />
            2. They send: <strong style={{ color: '#34d399' }}>join [your-sandbox-code]</strong><br />
            3. They receive confirmation message<br />
            4. Now they can place orders by sending natural messages like <strong style={{ color: '#34d399' }}>"1kg rice, 2 oil, deliver by 6pm"</strong>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default WhatsAppPage