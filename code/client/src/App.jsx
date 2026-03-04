import { useState } from "react";
import { loginUser, registerUser, getProfile } from "./api";
import Navbar from "./components/Navbar";
import EditProfile from "./pages/EditProfile";
import Landing from "./pages/Landing";
import AlumniDirectory from "./pages/AlumniDirectory";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");

  // Views: "landing" | "auth" | "profile" | "directory"
  const [view, setView] = useState("landing");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    const data = await loginUser({ email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Login successful ✅");
      setView("profile");
    } else {
      setMessage(data.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Registering...");
    const data = await registerUser({
      email,
      password,
      role,
      full_name: fullName,
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Registered ✅ Token saved.");
      setView("profile");
    } else {
      setMessage(data.message || "Register failed");
    }
  };

  const handleProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login first.");
      return;
    }
    const data = await getProfile(token);
    setMessage(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      {view !== "landing" && <Navbar />}

      {view === "landing" && (
        <Landing
          onGoLogin={() => {
            setMode("login");
            setView("auth");
          }}
          onGoRegister={() => {
            setMode("register");
            setView("auth");
          }}
        />
      )}

      {/* MAIN CONTAINER FOR LOGGED-IN/AUTH VIEWS */}
      {view !== "landing" && (
        <div style={{ maxWidth: "800px", margin: "50px auto", fontFamily: "Arial" }}>
          
          {/* Navigation Controls */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button onClick={() => setView("landing")} style={{ marginRight: "10px" }}>
              Home
            </button>
            <button onClick={() => setView("auth")} style={{ marginRight: "10px" }}>
              Auth
            </button>
            <button onClick={() => setView("profile")} style={{ marginRight: "10px" }}>
              My Profile
            </button>
            {/* Role 2: New Directory Toggle */}
            <button onClick={() => setView("directory")} style={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
              Alumni Directory
            </button>
          </div>

          <hr />

          {/* Conditional Rendering Logic */}
          {view === "auth" && (
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <h2>Alumnet Auth</h2>
              <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button onClick={() => setMode("login")} style={{ flex: 1, padding: "10px" }}>Login</button>
                <button onClick={() => setMode("register")} style={{ flex: 1, padding: "10px" }}>Register</button>
              </div>
              <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
                {mode === "register" && (
                  <>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                    <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }}>
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </>
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                <button style={{ width: "100%", padding: "10px" }}>{mode === "login" ? "Login" : "Register"}</button>
              </form>
              <button onClick={handleProfile} style={{ width: "100%", padding: "10px", marginTop: "10px" }}>View Profile (Test JWT)</button>
              <pre style={{ whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "10px", marginTop: "10px" }}>{message}</pre>
            </div>
          )}

          {view === "profile" && <EditProfile />}

          {/* Role 2: Directory View (REQ-FN-010) */}
          {view === "directory" && <AlumniDirectory />}
          
        </div>
      )}
    </div>
  );
}

export default App;