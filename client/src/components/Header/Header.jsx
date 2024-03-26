import "./Header.scss";
import logo from "../../asset/logo.jpg";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="header">
      {/* <img className="header__logo" src={logo} alt="WiseWordro Logo" /> */}
      <NavLink to="/" className="header__logo">
        <p>WiseWardro</p>
      </NavLink>

      <ul className="header__list">
        <NavLink to="/my-wordrobe" as="li" className="header__list-item">
          My Wordrobe
        </NavLink>
        <NavLink to="/my-outfit" as="li" className="header__list-item">
          My Outfit
        </NavLink>
      </ul>
    </nav>
  );
}
