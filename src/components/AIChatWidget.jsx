import { useState, useEffect, useRef } from "react"
import API from "../api"
import { useNavigate } from "react-router-dom"

export default function AIChatWidget() {

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const navigate = useNavigate()
  const chatEndRef = useRef()

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // GREETING
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hey 👋 I'm your pet assistant.\nHow can I help you today?"
        }
      ])
    }
  }, [open])

  const sendMessage = async () => {
    if (!input) return

    const token = localStorage.getItem("token")

    setMessages(prev => [
      ...prev,
      { text: input, sender: "user" },
      { sender: "bot", typing: true }
    ])

    try {
      const res = await API.post(
        "/ai-chat/",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const botMsg = {
        text: res.data.reply,
        sender: "bot",
        products: res.data.products || []   
      }

      setMessages(prev => {
        const updated = [...prev]
        updated.pop()
        return [...updated, botMsg]
      })

    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated.pop()
        return [
          ...updated,
          { text: "⚠️ AI is busy. Try again later.", sender: "bot" }
        ]
      })
    }

    setInput("")
  }

  return (
    <>
      {/* FLOAT BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: window.innerWidth < 768 ? "70px" : "20px",
          right: "20px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #000, #333)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          cursor: "pointer",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          zIndex: 9999
        }}
      >
        🤖
      </div>

      {/* CHAT PANEL */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: window.innerWidth < 768 ? "90px" : "100px",
            right: window.innerWidth < 768 ? "10px" : "20px",
            width: window.innerWidth < 768 ? "95%" : "360px",
            height: window.innerWidth < 768 ? "70vh" : "520px",
            borderRadius: "18px",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999
          }}
        >

          {/* HEADER */}
          <div style={{
            padding: "14px",
            fontWeight: "bold",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>🤖 Petty Assistant</span>

            <span
              onClick={() => setOpen(false)}
              style={{
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              ✕
            </span>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex: 1,
            padding: "12px",
            overflowY: "auto"
          }}>

            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px"
                }}
              >

                <div style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  background: m.sender === "user"
                    ? "linear-gradient(135deg, #000, #333)"
                    : "#fff",
                  color: m.sender === "user" ? "#fff" : "#000",
                  fontSize: "13px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}>
                  {m.typing ? "..." : m.text}

                  {/* 🔥 PRODUCT CARDS (REAL FIX) */}
                  {m.products && m.products.length > 0 && (
                    <div style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "10px"
                    }}>
                      {m.products.slice(0, 3).map(p => (
                        <div
                          key={p.id}
                          onClick={() => navigate(`/product/${p.id}`)}
                          style={{
                            width: "80px",
                            cursor: "pointer"
                          }}
                        >
                          <img
                          src={p.image}
                          style={{
                            width: "100%",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px"
                          }}
                        />
                          <div style={{
                            fontSize: "11px",
                            marginTop: "4px"
                          }}>
                            {p.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div style={{
            display: "flex",
            padding: "10px",
            borderTop: "1px solid #eee"
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: "20px",
                padding: "8px 12px",
                outline: "none"
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                background: "#000",
                color: "#fff",
                border: "none"
              }}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  )
}