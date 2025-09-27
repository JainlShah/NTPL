import React, { Component } from "react";
import "../../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";
import navkaar from "../../assets/navkar-logo.png";

class Navbar extends Component {
  state = {
    clicked: false,
    showSubmenu: false, // State to manage submenu visibility
  };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  toggleSubmenu = (visible) => {
    this.setState({ showSubmenu: visible });
  };

  closeMenu = () => {
    this.setState({ clicked: false, showSubmenu: false });
  };

  render() {
    return (
      <div className="navbar-container">
        <nav>
          <a href="/" className="logo">
            <img src={navkaar} alt="logo" />
          </a>

          <div className="navbar-pages">
            <ul id="navbar" className={this.state.clicked ? "active" : ""}>
              <li
                className="menu-item-navbar"
                onMouseEnter={() => this.toggleSubmenu(true)}
                onMouseLeave={() => this.toggleSubmenu(false)}
              >
                <Link to="/" onClick={this.closeMenu}>
                  Home
                </Link>
                {this.state.showSubmenu && (
                  <ul className="submenu">
                    <li>
                      <Link to="/dashboard" onClick={this.closeMenu}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/coil-inventory" onClick={this.closeMenu}>
                        Coil Inventory
                      </Link>
                    </li>
                    <li>
                      <Link to="/roll-inventory" onClick={this.closeMenu}>
                        Roll Inventory
                      </Link>
                    </li>
                    <li>
                      <Link to="/scrap" onClick={this.closeMenu}>
                        Scrap
                      </Link>
                    </li>
                    <li>
                      <Link to="/shortlist" onClick={this.closeMenu}>
                        Shortlist
                      </Link>
                    </li>
                    <li>
                      <Link to="/jobOrderList" onClick={this.closeMenu}>
                        Job Order List
                      </Link>
                    </li>
                    <li>
                      <Link to="/planned-slitting" onClick={this.closeMenu}>
                        Planned Slitting
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <CustomLink href="/dashboard" closeMenu={this.closeMenu}>
                Dashboard
              </CustomLink>
              <CustomLink href="/slitting" closeMenu={this.closeMenu}>
                Slitting
              </CustomLink>
              <CustomLink href="/cutting" closeMenu={this.closeMenu}>
                Cutting
              </CustomLink>
              <CustomLink href="/packing" closeMenu={this.closeMenu}>
                Packing
              </CustomLink>
              <CustomLink href="/report" closeMenu={this.closeMenu}>
                Report
              </CustomLink>
              <CustomLink href="/scanner" closeMenu={this.closeMenu}>
                Scan QR Code
              </CustomLink>
            </ul>
          </div>

          <div id="mobile" onClick={this.handleClick}>
            <i
              id="bars"
              className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}
            ></i>
          </div>
        </nav>
      </div>
    );
  }
}

function CustomLink({ href, children, closeMenu, ...props }) {
  const path = useLocation();

  return (
    <li className={path.pathname === href ? "active" : ""}>
      <Link to={href} onClick={closeMenu} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
