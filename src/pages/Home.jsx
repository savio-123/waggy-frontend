import { useState, useEffect } from "react"
import Preloader from "../components/Preloader"
import Header from "../components/Header"
import Banner from "../components/Banner"
import Clothing from "../components/Clothing"
import Svg from "../components/Svg"
import OffcanvasCart from "../components/Offcanvascart"
import OffcanvasSearch from "../components/Offcanvassearch"
import Foodies from "../components/Foodies"
import Toys from "../components/Toys"
import Banner2 from "../components/Banner2"
import BestSelling from "../components/BestSelling"
import Register from "../components/Register"
import LatestBlog from "../components/Latestblogs"
import Service from "../components/Services"
import Insta from "../components/Insta"
import Footer from "../components/Footer"
import TestimonialSection from "../components/TestimonialSection"



export default function Home({isAdmin}) {
  const [selectedCategory, setSelectedCategory] = useState("clothes")
  useEffect(() => {
    window.scrollTo({ top: 300, behavior: "smooth" })
  }, [selectedCategory])
  return (
    <>
      <Svg />
      <Preloader />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header isAdmin={isAdmin} onCategoryChange={setSelectedCategory} />
      <Banner />
      {selectedCategory === "food" && <Foodies />}
      {selectedCategory === "clothes" && <Clothing />}
      {selectedCategory === "toy" && <Toys />}
      <Banner2 />
      <TestimonialSection/>
      <BestSelling />
      <Register/>
      <LatestBlog/>
      <Service/>
      <Insta/>
      <Footer/>
    </>
  )
}