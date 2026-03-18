import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { getProfile } from "../api";
import { jwtDecode } from "jwt-decode";

import verifiedIcon from "../assets/verified.png";
import pendingIcon from "../assets/pending.png";
import rejectedIcon from "../assets/rejected.png";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  const isAdmin = useMemo(() => {
    try {
      if (!token) return false;
      const decoded = jwtDecode(token);
      return (
        decoded?.role === "system_admin" ||
        decoded?.role === "university_admin"
      );
    } catch {
      return false;
    }
  }, [token]);

  useEffect(() => {
    const run = async () => {
      try {
        const t = localStorage.getItem("token");
        if (!t) {
          navigate("/login");
          return;
        }

        const data = await getProfile(t);
        setProfile(data);
      } catch (e) {
        setErr(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate]);

  if (loading) {
    return (
      <PageShell title="My Account" subtitle="Profile">
        <div>Loading...</div>
      </PageShell>
    );
  }

  if (err) {
    return (
      <PageShell title="My Account" subtitle="Profile">
        <div style={errorBox}>{err}</div>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell title="My Account" subtitle="Profile">
        <div>No profile found.</div>
      </PageShell>
    );
  }

  const statusIcon =
    profile.verification_status === "verified"
      ? verifiedIcon
      : profile.verification_status === "rejected"
      ? rejectedIcon
      : pendingIcon;

  const isStudent = profile.role === "student";
  const isAlumni = profile.role === "alumni";

  return (
    <PageShell
      title="My Account"
      subtitle="Profile"
      right={
        isAdmin ? (
          <Link to="/admin" style={adminBtn}>
            User Verification
          </Link>
        ) : null
      }
    >
      <div style={pageWrap}>
        <div style={topArea}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
              style={avatar}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div style={avatarFallback}>
              {profile.full_name?.slice(0, 1)?.toUpperCase() || "U"}
            </div>
          )}

          <div style={nameWrap}>
            <div style={nameRow}>
              <h2 style={nameStyle}>{profile.full_name}</h2>
              <img src={statusIcon} alt={profile.verification_status} style={statusIconStyle} />
            </div>

            <div style={emailStyle}>{profile.email}</div>
          </div>
        </div>

        <div style={detailsGrid}>
          <section>
            <h3 style={sectionTitle}>Personal Details</h3>
            <div style={rowsWrap}>
              {isStudent && (
                <>
                  <InfoRow label="Department" value={profile.department} />
                  <InfoRow label="Batch" value={profile.batch} />
                  <InfoRow label="Bio" value={profile.bio} multiline />
                  <InfoRow label="Motivation" value={profile.motivation} multiline />
                  <InfoRow label="Goal" value={profile.goal} multiline />
                </>
              )}

              {isAlumni && (
                <>
                  <InfoRow label="Department" value={profile.department} />
                  <InfoRow label="Graduation Year" value={profile.graduation_year} />
                  <InfoRow label="Bio" value={profile.bio} multiline />
                  <InfoRow
                    label="Mentee Capacity"
                    value={profile.preferred_mentee_capacity}
                  />
                </>
              )}
            </div>
          </section>

          <section>
            <h3 style={sectionTitle}>Professional Details</h3>
            <div style={rowsWrap}>
              {isStudent && (
                <>
                  <InfoRow label="Areas of Interest" value={profile.areas_of_interest} multiline />
                  <InfoRow label="LinkedIn" value={profile.linkedin_url} isLink />
                  <InfoRow label="GitHub" value={profile.github_url} isLink />
                  <InfoRow label="Portfolio" value={profile.portfolio_url} isLink />
                  <InfoRow label="CV" value={profile.cv_url} isLink />
                </>
              )}

              {isAlumni && (
                <>
                  <InfoRow label="Job Title" value={profile.job_title} />
                  <InfoRow label="Company" value={profile.organization} />
                  <InfoRow
                    label="Expertise / Interests"
                    value={profile.primary_interests}
                    multiline
                  />
                  <InfoRow label="LinkedIn URL" value={profile.linkedin_url} isLink />
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

function InfoRow({ label, value, isLink = false, multiline = false }) {
  return (
    <div style={row}>
      <div style={rowLabel}>{label}</div>
      <div
        style={{
          ...rowValue,
          whiteSpace: multiline ? "pre-wrap" : "normal",
        }}
      >
        {value ? (
          isLink ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              style={linkValue}
            >
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

const pageWrap = {
  paddingTop: 10,
};

const topArea = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 34,
};

const avatar = {
  width: 100,
  height: 100,
  borderRadius: "50%",
  objectFit: "cover",
  border: "1px solid rgba(0,0,0,0.06)",
  marginBottom: 14,
};

const avatarFallback = {
  width: 74,
  height: 74,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "#ecebe7",
  color: "#111111",
  fontSize: 26,
  fontWeight: 400,
  marginBottom: 14,
};

const nameWrap = {
  textAlign: "center",
};

const nameRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const nameStyle = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.1,
  letterSpacing: "-0.03em",
  fontWeight: 400,
  color: "#111111",
};

const statusIconStyle = {
  width: 16,
  height: 16,
  objectFit: "contain",
};

const emailStyle = {
  marginTop: 6,
  color: "rgba(17,17,17,0.56)",
  fontSize: 13,
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 26,
};

const sectionTitle = {
  margin: "0 0 14px",
  fontSize: 15,
  fontWeight: 400,
  color: "#111111",
};

const rowsWrap = {
  display: "grid",
};

const row = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  gap: 16,
  padding: "10px 0",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
};

const rowLabel = {
  fontSize: 13,
  color: "rgba(17,17,17,0.54)",
};

const rowValue = {
  fontSize: 14,
  color: "#111111",
  lineHeight: 1.7,
  wordBreak: "break-word",
};

const linkValue = {
  color: "#2527be",
  textDecoration: "none",
  borderBottom: "1px solid rgba(17,17,17,0.14)",
};

const adminBtn = {
  background: "rgba(255,255,255,0.7)",
  color: "#111111",
  padding: "10px 16px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 400,
  border: "1px solid rgba(0,0,0,0.06)",
};

const errorBox = {
  background: "#fee2e2",
  padding: 12,
  borderRadius: 14,
};