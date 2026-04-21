import Header2 from "./Header2"
import Footer from "./Footer2"
import { Outlet } from "react-router-dom"

export default function MainLayout({isAdmin}) {
  return (
    <div className="d-flex flex-column min-vh-100">

      <Header2 isAdmin={isAdmin}/>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  )
}