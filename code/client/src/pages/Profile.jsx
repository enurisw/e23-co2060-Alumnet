import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile } from "../api";

function StatusBadge({ status }) {
  const isVerified = status === "verified";
  const bg = isVerified ? "rgba(0, 160, 80, 0.12)" : "rgba(255, 180, 0, 0.15)";
  const border = isVerified ? "rgba(0, 160, 80, 0.35)" : "rgba(255, 180, 0, 0.35)";
  const color = isVerified ? "#0a7a44" : "#8a5a00";
  const label = isVerified ? "Verified" : "Pending Approval";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: 13,
      }}
    >
      {label}
    </span>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const run = async () => {
      setError("");
      setLoading(true);
      try {
        const data = await getProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto" }}>
        <h1>My Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto" }}>
        <h1>My Profile</h1>
        <div
          style={{
            background: "rgba(255,0,0,0.08)",
            border: "1px solid rgba(255,0,0,0.2)",
            padding: 12,
            borderRadius: 10,
            color: "#b00020",
          }}
        >
          {error}
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={logout} style={{ padding: 10 }}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  const status = profile?.verification_status || "pending";

  return (
    <div style={{ maxWidth: 900, margin: "30px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>My Profile</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <StatusBadge status={status} />
            <span style={{ opacity: 0.85, fontSize: 14 }}>
              {profile.role?.toUpperCase()} • {profile.email}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link to="/directory">Alumni Directory</Link>
          {/* Admin shortcut shown only if role is admin */}
          {profile.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
          <button onClick={logout} style={{ padding: "10px 12px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Pending Message */}
      {status !== "verified" && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            background: "rgba(255, 180, 0, 0.12)",
            border: "1px solid rgba(255, 180, 0, 0.30)",
          }}
        >
          <strong>Awaiting admin approval.</strong>{" "}
          <span style={{ opacity: 0.9 }}>
            Your account is pending verification. You can still complete your profile details.
          </span>
        </div>
      )}

      {/* Basic Info Card */}
      <div
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "white",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Details</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Full Name" value={profile.full_name} />
          <Field label="Role" value={profile.role} />

          {profile.role === "student" && (
            <>
              <Field label="Batch" value={profile.batch} />
              <Field label="Interests" value={profile.interests} />
            </>
          )}

          {profile.role === "alumni" && (
            <>
              <Field label="Company" value={profile.company} />
              <Field label="Job Title" value={profile.job_title} />
              <Field label="Graduation Year" value={profile.grad_year} />
              <Field label="LinkedIn" value={profile.linkedin_url} link />
              <Field label="Interests" value={profile.interests} />
            </>
          )}
        </div>
      </div>

      {/* Next step: Edit profile form (Step 3 polish) */}
      <div style={{ marginTop: 14, opacity: 0.75, fontSize: 13 }}>
        Editing will be added next (PUT /api/auth/profile).
      </div>
    </div>
  );
}

function Field({ label, value, link = false }) {
  const v = value ?? "";
  return (
    <div style={{ padding: 10, borderRadius: 10, background: "rgba(0,0,0,0.03)" }}>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{label}</div>
      {link && v ? (
        <a href={v} target="_blank" rel="noreferrer">
          {v}
        </a>
      ) : (
        <div style={{ fontSize: 14 }}>{v || "-"}</div>
      )}
    </div>
  );
}