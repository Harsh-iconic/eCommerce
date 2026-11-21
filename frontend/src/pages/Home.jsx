import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/Api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/products", { params: { search, category: category === "All" ? "" : category, sort, limit: 48 } });
        if (!active) return;
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setError("");
      } catch (err) {
        if (active) setError(err.response?.data?.message || "Couldn't connect to the shop. Please try again.");
      } finally { if (active) setLoading(false); }
    }, search ? 250 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [search, category, sort]);

  const addToCart = async (product) => {
    if (!localStorage.getItem("token")) return navigate("/login");
    try {
      await api.post("/cart", { productId: product._id, quantity: 1 });
      setNotice(`${product.name} added to your bag.`);
      setTimeout(() => setNotice(""), 2500);
    } catch (err) { setNotice(err.response?.data?.message || "Could not add this item."); }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content container">
          <span className="eyebrow light">THE GOOD FINDS EDIT</span>
          <h1>Make room for<br/><em>the good things.</em></h1>
          <p>Everyday essentials, considered details, and little upgrades that make a difference.</p>
          <a href="#shop" className="button button-light">Explore the collection <span>↗</span></a>
        </div>
        <div className="hero-note"><span>01 / CURATED FOR EVERYDAY</span><span>LESS, BUT BETTER.</span></div>
      </section>
      <main id="shop" className="container shop-section">
        <div className="section-heading"><div><span className="eyebrow">A LITTLE SOMETHING FOR YOU</span><h2>Shop the collection<span className="period">.</span></h2></div><p>Good design. Useful details. Things worth keeping.</p></div>
        <div className="shop-toolbar">
          <label className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products"/></label>
          <div className="toolbar-right"><div className="category-list"><button className={category === "All" ? "chip selected" : "chip"} onClick={() => setCategory("All")}>All</button>{categories.map(item => <button key={item} className={category === item ? "chip selected" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}</div><select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Recently added</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>
        </div>
        {notice && <div className="notice" role="status">{notice}</div>}
        {error && <div className="empty-state"><h3>Something went wrong</h3><p>{error}</p><button className="button button-dark" onClick={() => setSearch(value => value + " ")}>Try again</button></div>}
        {loading ? <div className="loading-grid">{[1,2,3,4].map(n => <div className="skeleton" key={n}/>)}</div> : !error && products.length ? <div className="product-grid">{products.map(product => <ProductCard key={product._id} product={product} onAdd={addToCart}/>)}</div> : !error && <div className="empty-state"><span className="eyebrow">NOTHING HERE JUST YET</span><h3>No products found.</h3><p>Try another search or browse all categories.</p><button className="button button-dark" onClick={() => {setSearch("");setCategory("All");}}>Clear filters</button></div>}
      </main>
      <section className="promise-strip"><div className="container promise-grid"><div><span>01</span><strong>Considered quality</strong><p>Made to be used, loved and kept.</p></div><div><span>02</span><strong>Easy, always</strong><p>A smoother way to shop online.</p></div><div><span>03</span><strong>Here to help</strong><p>Support when you need it.</p></div></div></section>
      <footer className="footer container"><Link to="/" className="brand"><span className="brand-mark">s.</span> shopkart</Link><span>Good things, picked with care.</span><span>© {new Date().getFullYear()} ShopKart</span></footer>
    </>
  );
};
export default Home;