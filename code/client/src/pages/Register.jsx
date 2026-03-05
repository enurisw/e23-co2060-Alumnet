import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function isValidUrl(value) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  // common
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // student minimal
  const [batch, setBatch] = useState("");
  const [studentInterests, setStudentInterests] = useState("");

  // alumni minimal
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [alumniInterests, setAlumniInterests] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const interests = useMemo(() => {
    return role === "student" ? studentInterests : alumniInterests;
  }, [role, studentInterests, alumniInterests]);

  const validate = () => {
    if (!fullName.trim()) return "Full name is required";
    if (fullName.length > 100) return "Full name too long (max 100)";
    if (!emailRegex.test(email)) return "Invalid email format";
    if (password.length < 6) return "Password must be at least 6 characters";

    if (role === "student") {
      if (!batch.trim()) return "Batch is required for students";
      if (batch.length > 50) return "Batch too long (max 50)";
      if (!studentInterests.trim()) return "Interests are required for students";
      if (studentInterests.length > 500) return "Interests too long (max 500)";
    } else {
      if (!company.trim()) return "Company is required for alumni";
      if (company.length > 100) return "Company too long (max 100)";
      if (!jobTitle.trim()) return "Job title is required for alumni";
      if (jobTitle.length > 100) return "Job title too long (max 100)";

      if (!gradYear.trim()) return "Graduation year is required for alumni";
      const yr = Number(gradYear);
      const now = new Date().getFullYear();
      if (!Number.isFinite(yr) || yr < 1980 || yr > now) {
        return `Graduation year must be between 1980 and ${now}`;
      }

      if (!linkedinUrl.trim()) return "LinkedIn URL is required for alumni";
      if (!isValidUrl(linkedinUrl)) return "LinkedIn URL must start with http/https";

      if (!alumniInterests.trim()) return "Interests are required for alumni";
      if (alumniInterests.length > 500) return "Interests too long (max 500)";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload =
        role === "student"
          ? {
              full_name: fullName.trim(),
              email: email.trim(),
              password,
              role,
              batch: batch.trim(),
              interests: studentInterests.trim(),
            }
          : {
              full_name: fullName.trim(),
              email: email.trim(),
              password,
              role,
              company: company.trim(),
              job_title: jobTitle.trim(),
              grad_year: String(gradYear).trim(),
              linkedin_url: linkedinUrl.trim(),
              interests: alumniInterests.trim(),
            };

      const data = await registerUser(payload);
      localStorage.setItem("token", data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 12 }}>Register</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Create your Alumnet account. Choose Student or Alumni to see the right fields.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Role */}
        <label style={{ display: "block", marginBottom: 6 }}>I am a</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 14 }}
        >
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
        </select>

        {/* Common */}
        <label style={{ display: "block", marginBottom: 6 }}>Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          required
          style={{ width: "100%", padding: 10, marginBottom: 14 }}
        />

        <label style={{ display: "block", marginBottom: 6 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{ width: "100%", padding: 10, marginBottom: 14 }}
        />

        <label style={{ display: "block", marginBottom: 6 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          style={{ width: "100%", padding: 10, marginBottom: 14 }}
        />

        {/* Student Fields */}
        {role === "student" && (
          <>
            <h3 style={{ margin: "12px 0 8px" }}>Student Details</h3>

            <label style={{ display: "block", marginBottom: 6 }}>Batch</label>
            <input
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. Batch 21"
              required
              style={{ width: "100%", padding: 10, marginBottom: 14 }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Interests</label>
            <textarea
              value={studentInterests}
              onChange={(e) => setStudentInterests(e.target.value)}
              placeholder="e.g. AI, Web, Embedded"
              required
              rows={3}
              style={{ width: "100%", padding: 10, marginBottom: 14 }}
            />
          </>
        )}

        {/* Alumni Fields */}
        {role === "alumni" && (
          <>
            <h3 style={{ margin: "12px 0 8px" }}>Alumni Details</h3>

            <label style={{ display: "block", marginBottom: 6 }}>Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company"
              required
              style={{ width: "100%", padding: 10, marginBottom: 14 }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Job Title</label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Your job title"
              required
              style={{ width: "100%", padding: 10, marginBottom: 14 }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Graduation Year</label>
            <input
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              placeholder="e.g. 2021"
              required
              style={{ width: "100%", padding: 10, marginBottom: 14 }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>LinkedIn URL</label>
            <input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              required
              style={{ width: "100%", padding: 10, marginBottom: 14 }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Interests</label>
            <textarea
              value={alumniInterests}
              onChange={(e) => setAlumniInterests(e.target.value)}
              placeholder="e.g. Mentoring, Backend, Career guidance"
              required
              rows={3}
              style={{ width: "100%", padding: 10, marginBottom: 14 }}
            />
          </>
        )}

        {error && (
          <div
            style={{
              background: "rgba(255,0,0,0.08)",
              border: "1px solid rgba(255,0,0,0.2)",
              padding: 10,
              borderRadius: 8,
              marginBottom: 12,
              color: "#b00020",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 12, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 14, opacity: 0.85 }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}