import { useState } from "react"

export default function FAQ() {

  const [activeIndex, setActiveIndex] = useState(null)
  const [search, setSearch] = useState("")

  const faqs = [
    // ORDERS
    { category: "Orders", q: "How do I place an order?", a: "Browse products, add to cart, and proceed to checkout." },
    { category: "Orders", q: "Can I cancel my order?", a: "Yes, you can cancel orders before they are shipped." },

    // PAYMENTS
    { category: "Payments", q: "What payment methods are available?", a: "We support Cash on Delivery and Online Payment (Razorpay)." },
    { category: "Payments", q: "Is online payment secure?", a: "Yes, all transactions are secured using trusted payment gateways." },

    // RETURNS
    { category: "Returns", q: "What is the return policy?", a: "You can request a return within 7 days after delivery." },
    { category: "Returns", q: "How do I request a return?", a: "Go to your orders and click 'Request Return'." },

    // ACCOUNT
    { category: "Account", q: "How do I update my profile?", a: "Go to profile section and edit your details." },
    { category: "Account", q: "Can I change my address?", a: "Yes, you can manage addresses from your account." },

    // GENERAL
    { category: "General", q: "Do you sell all pet categories?", a: "Yes, we offer products for dogs, cats, birds, and more." },
    { category: "General", q: "How do I contact support?", a: "You can use the AI assistant or contact us via email." }
  ]

  // 🔍 FILTER
  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>

      {/* TITLE */}
      <h2 className="mb-4 text-center">Help Center</h2>

      {/* SEARCH */}
      <input
        className="form-control mb-4"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FAQ LIST */}
      {filtered.map((f, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #eee",
            borderRadius: "10px",
            marginBottom: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}
        >

          {/* QUESTION */}
          <div
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            style={{
              padding: "15px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              background: "#f9f9f9",
              fontWeight: "500"
            }}
          >
            <span>{f.q}</span>
            <span>{activeIndex === i ? "−" : "+"}</span>
          </div>

          {/* ANSWER */}
          {activeIndex === i && (
            <div style={{
              padding: "15px",
              background: "#fff",
              color: "#555"
            }}>
              {f.a}
            </div>
          )}

        </div>
      ))}

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p className="text-center text-muted mt-4">
          No results found 😕
        </p>
      )}

    </div>
  )
}