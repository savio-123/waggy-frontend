import { Link } from "react-router-dom"

export default function Footer() {
    return (
      <>
        <footer id="footer">
          <div className="container pt-5">
            <div className="row justify-content-between">
  
              {/* LOGO + SOCIAL */}
              <div className="col-md-3">
                <div className="footer-menu">
                  <img src="/images/logo.png" alt="logo" />
  
                  <p className="blog-paragraph fs-6 mt-3">
                    Subscribe to our newsletter to get updates about our grand offers.
                  </p>
  
                  <div className="social-links">
                    <ul className="d-flex list-unstyled gap-2">
  
                      {["facebook-fill", "twitter-fill", "pinterest-fill", "instagram-fill", "youtube-fill"].map((icon, i) => (
                        <li className="social" key={i}>
                          <a href="#">
                            <iconify-icon
                              className="social-icon"
                              icon={`ri:${icon}`}
                            ></iconify-icon>
                          </a>
                        </li>
                      ))}
  
                    </ul>
                  </div>
                </div>
              </div>
  
              {/* QUICK LINKS */}
              <div className="col-md-3">
                <div className="footer-menu">
                  <h3>Quick Links</h3>
                  <ul className="menu-list list-unstyled ">
    
                  <li className="menu-item"><Link to="/" onClick={()=> window.scrollTo({ top: 0, behavior: "smooth" })} className="nav-link">Home</Link></li>
                  <li className="menu-item"><Link to="/shop" className="nav-link">Shop</Link></li>
                  <li className="menu-item"><Link to="/blogs" className="nav-link">Blogs</Link></li>
                  <li className="menu-item"><Link to="/about" className="nav-link">About</Link></li>
                  </ul>
                
                </div>
              </div>
  
              {/* HELP CENTER */}
              <div className="col-md-3">
                <div className="footer-menu">
                  <h3>Help Center</h3>
                  <ul className="menu-list list-unstyled">
  
                    {["FAQs", "Payment", "Returns & Refunds", "Checkout"].map((item, i) => (
                      <li className="menu-item" key={i}>
                        <a href="#" className="nav-link">{item}</a>
                      </li>
                    ))}
  
                  </ul>
                </div>
              </div>
  
            </div>
          </div>
        </footer>
      </>
    )
  }