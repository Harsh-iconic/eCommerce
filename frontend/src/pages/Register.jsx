import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/Api";

const Register = () => {
  const [form,setForm] = useState({name:"",email:"",password:""});
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  const navigate = useNavigate();
  const change = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError("");
    try { await api.post("/auth/register",form); navigate("/login",{state:{registered:true}}); }
    catch(err) { setError(err.response?.data?.message || "Registration failed. Please try again."); }
    finally { setBusy(false); }
  };
  return <main className="form-page"><div className="form-card"><span className="eyebrow">A GOOD PLACE TO START</span><h1>Join the club<span className="period">.</span></h1><p>Create an account for a more personal shopping experience.</p><form onSubmit={submit} className="form-stack"><label className="field">Your name<input name="name" required minLength="2" value={form.name} onChange={change} autoComplete="name"/></label><label className="field">Email address<input type="email" name="email" required value={form.email} onChange={change} autoComplete="email"/></label><label className="field">Password<input type="password" name="password" required minLength="8" value={form.password} onChange={change} autoComplete="new-password"/><small>Use at least 8 characters.</small></label>{error && <p className="form-error">{error}</p>}<button disabled={busy} className="button button-dark button-full">{busy ? "Creating account..." : "Create account"}</button></form><p>Already a member? <Link to="/login">Sign in</Link></p></div></main>;
};
export default Register;