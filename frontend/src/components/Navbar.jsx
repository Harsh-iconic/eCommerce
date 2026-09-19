import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <Link to="/" className="text-2xl font-bold">
                    ShopKart
                </Link>

                <div className="flex items-center gap-6">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/cart">
                        Cart
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/register">
                        Register
                    </Link>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;