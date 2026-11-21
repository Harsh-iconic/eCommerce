import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };
  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;
  return (
    <header className="site-header">
      <div className="announcement">Thoughtful finds. Everyday favourites. Free shipping over ₹1,999.</div>
      <nav className="navbar container">
        <Link to="/" className="brand"><span className="brand-mark">s.</span> shopkart</Link>
        <div className="nav-links">
          <NavLink to="/" end className={linkClass}>Discover</NavLink>
          <NavLink to="/orders" className={linkClass}>My orders</NavLink>
          <NavLink to="/cart" className={linkClass}>Bag</NavLink>
          <NavLink to="/wishlist" className={linkClass}>Saved</NavLink>
        </div>
        <div className="nav-actions">
          {user ? <><span className="welcome">Hi, {user.name?.split(" ")[0]}</span>{user.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}<button className="text-button" onClick={logout}>Sign out</button></> : <><Link className="text-button" to="/login">Sign in</Link><Link className="button button-dark button-small" to="/register">Join us</Link></>}
        </div>
      </nav>
    </header>
  );
};
export default Navbar;