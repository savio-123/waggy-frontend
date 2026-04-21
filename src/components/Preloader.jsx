import { useEffect, useState } from "react"

export default function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000) // 1 second
  }, [])

  if (!loading) return null

  return (
    <div className="preloader-wrapper">
      <div className="preloader"></div>
    </div>
  )
}