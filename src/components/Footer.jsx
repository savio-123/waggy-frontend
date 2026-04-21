import { Link } from "react-router-dom"

export default function Footer() {
    return (
      <>
        <footer id="footer" className="my-5">
          <div className="container  py-5 my-5">
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
                  </ul>
                
                </div>
              </div>
  
              {/* HELP CENTER */}
              <div className="col-md-3">
                <div className="footer-menu">
                  <h3>Help Center</h3>
                  <ul className="menu-list list-unstyled">
                  <li className="menu-item"><Link to="/orders" className="nav-link">Orders</Link></li>
                  <li className="menu-item"><Link to="/cart" className="nav-link">Cart</Link></li>
                  <li className="menu-item"><Link to="/about" className="nav-link">About</Link></li>
                  <li className="menu-item">
                    <Link to="/faq" className="nav-link">FAQs</Link>
                  </li>
                  
      
                    
                  </ul>
                </div>
              </div>
  
            </div>
          </div>
        </footer>
  
        {/* FOOTER BOTTOM */}
        <div id="footer-bottom">
          <div className="container">
            <hr className="m-0" />
  
            <div className="row mt-3">
              <div className="col-md-6 copyright">
                <p className="secondary-font">
                  © 2023 Waggy. All rights reserved.
                </p>
              </div>
  
              <div className="col-md-6 text-md-end">
                <p className="secondary-font">
                  Free HTML Template by{" "}
                  <a
                    href="https://templatesjungle.com/"
                    target="_blank"
                    className="text-decoration-underline fw-bold text-black-50"
                  >
                    TemplatesJungle
                  </a>{" "}
                  Distributed by{" "}
                  <a
                    href="https://themewagon.com/"
                    target="_blank"
                    className="text-decoration-underline fw-bold text-black-50"
                  >
                    ThemeWagon
                  </a>
                </p>
              </div>
            </div>
  
          </div>
        </div>
      </>
    )
  }