import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/Api";

const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async e => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const {data} = await api.post("/auth/login",{email,password});
      localStorage.setItem("token",data.token);
      localStorage.setItem("user",JSON.stringify(data.user));
      navigate("/",{replace:true});
      window.location.reload();
    } catch(err) { setError(err.response?.data?.message || "Unable to sign in. Please try again."); }
    finally { setBusy(false); }
  };
  return <main className="form-page"><div className="form-card"><span className="eyebrow">WELCOME BACK</span><h1>Good to see you<span className="period">.</span></h1><p>Sign in to pick up where you left off.</p><form onSubmit={handleLogin} className="form-stack"><label className="field">Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label className="field">Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>{error && <p className="form-error">{error}</p>}<button disabled={busy} className="button button-dark button-full">{busy ? "Signing in..." : "Sign in"}</button></form><p>New around here? <Link to="/register">Create an account</Link></p></div></main>;
};
export default Login;