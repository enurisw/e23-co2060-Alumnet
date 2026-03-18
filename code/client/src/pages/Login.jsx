import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import AuthLayout from "../components/AuthLayout";
import {
  titleStyle,
  subtitleStyle,
  labelStyle,
  inputStyle,
  btnPrimaryStyle,
  footerRowStyle,
  linkStyle,
  errorBoxStyle,
  uiCss,
} from "../styles/ui";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout maxWidth={520}>
      <style>{uiCss}</style>

      <h1 style={titleStyle}>Login</h1>
      <p style={subtitleStyle}>Welcome back to Alumnet.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="james.potter@example.com"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: 2 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{ ...errorBoxStyle, marginTop: 10 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btnPrimary"
          style={{
            ...btnPrimaryStyle,
            marginTop: 16,
            opacity: loading ? 0.75 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={footerRowStyle}>
        Don&apos;t have an account?{" "}
        <Link className="link" style={linkStyle} to="/register">
          Register
        </Link>
      </div>

      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Link className="link" style={linkStyle} to="/">
          ← Back to Home
        </Link>
      </div>
    </AuthLayout>
  );
}