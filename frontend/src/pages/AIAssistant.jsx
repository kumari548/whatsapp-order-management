import { useState } from 'react'
import axios from 'axios'
import PageLayout from '../components/PageLayout'

function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your shop AI assistant. Ask me anything about your orders, customers, or inventory!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const [ordersRes, inventoryRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/inventory`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const context = `
        Shop data:
        Orders: ${JSON.stringify(ordersRes.data)}
        Inventory: ${JSON.stringify(inventoryRes.data)}
      `

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: `You are a helpful shop assistant. Answer questions based on this shop data: ${context}. Keep answers short and clear.` },
            { role: 'user', content: input }
          ],
          max_tokens: 300,
        })
      })

      const data = await res.json()
      const aiText = data.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I could not process that. Please try again!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>🤖 AI Assistant</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '14px' }}>Ask anything about your shop</p>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', height: '500px' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5',
                background: msg.role === 'user' ? 'rgba(37,211,102,0.25)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: msg.role === 'user' ? '1px solid rgba(37,211,102,0.4)' : '1px solid rgba(255,255,255,0.15)',
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '14px', border: '1px solid rgba(255,255,255,0.15)' }}>
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask: Which product sold most? Who are top customers?"
            style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none' }}
          />
          <button onClick={sendMessage} disabled={loading} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #16a34a, #25D366)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Send
          </button>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['Which product sold most?', 'Who are my top customers?', 'What items are low in stock?', 'How many orders today?'].map(q => (
          <button key={q} onClick={() => { setInput(q); }} style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer' }}>
            {q}
          </button>
        ))}
      </div>
    </PageLayout>
  )
}

export default AIAssistant