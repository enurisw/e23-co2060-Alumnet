import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { getDirectory } from "../api";

import verifiedIcon from "../assets/verified.png";
import pendingIcon from "../assets/pending.png";
import rejectedIcon from "../assets/rejected.png";

export default function Directory() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const loadDirectory = async () => {
    setLoading(true);

    try {
      const data = await getDirectory(search, department);
      setAlumni(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  const getStatusIcon = (status) => {
    if (status === "verified") return verifiedIcon;
    if (status === "rejected") return rejectedIcon;
    return pendingIcon;
  };

  return (
    <PageShell title="Directory" subtitle="Connect with alumni mentors">
      <div style={filterBar}>
        <input
          placeholder="Search alumni..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={deptSelect}
        >
          <option value="">All Departments</option>
          <option>Chemical & Process Engineering</option>
          <option>Civil Engineering</option>
          <option>Computer Engineering</option>
          <option>Electrical and Electronic Engineering</option>
          <option>Mechanical Engineering</option>
          <option>Manufacturing and Industrial Engineering</option>
        </select>

        <button style={searchBtn} onClick={loadDirectory}>
          Search
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : alumni.length === 0 ? (
        <div>No alumni found.</div>
      ) : (
        <div style={grid}>
          {alumni.map((a) => {
            const capacity = Number(a.preferred_mentee_capacity || 0);
            const accepted = Number(a.accepted_mentees_count || 0);
            const remaining = capacity - accepted;

            return (
              <div key={a.id} style={card}>
                <div style={topRow}>
                  {a.avatar_url ? (
                    <img
                      src={a.avatar_url}
                      alt={a.full_name}
                      style={avatar}
                    />
                  ) : (
                    <div style={avatarFallback}>
                      {a.full_name?.slice(0, 1)?.toUpperCase() || "A"}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={nameRow}>
                      <div style={name}>{a.full_name}</div>
                      <img
                        src={getStatusIcon(a.verification_status)}
                        alt={a.verification_status}
                        style={statusIcon}
                      />
                    </div>
                    <div style={meta}>{a.job_title || "-"}</div>
                    <div style={meta}>{a.organization || "-"}</div>
                  </div>
                </div>

                <div style={row}>
                  <div style={label}>Department</div>
                  <div style={value}>{a.department || "-"}</div>
                </div>

                <div style={row}>
                  <div style={label}>Mentor Capacity</div>
                  <div style={value}>
                    {accepted} / {capacity}
                  </div>
                </div>

                <div style={row}>
                  <div style={label}>Availability</div>
                  <div
                    style={{
                      ...value,
                      color: remaining > 0 ? "#17a84f" : "#b91c1c",
                      fontWeight: 500,
                    }}
                  >
                    {remaining > 0 ? `${remaining} slots available` : "Mentor full"}
                  </div>
                </div>

                <Link to={`/directory/${a.id}`} style={viewBtn}>
                  View Profile
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

const filterBar = {
  display: "flex",
  gap: 10,
  marginBottom: 26,
  flexWrap: "wrap",
  fontSize: 14,
};

const searchInput = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.7)",
  minWidth: 220,
};

const deptSelect = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.7)",
};

const searchBtn = {
  padding: "10px 16px",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.7)",
  cursor: "pointer",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const card = {
  padding: 18,
  borderRadius: 14,
  background: "rgba(255,255,255,0.65)",
  border: "1px solid rgba(0,0,0,0.06)",
  backdropFilter: "blur(6px)",
};

const topRow = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  marginBottom: 14,
};

const avatar = {
  width: 52,
  height: 52,
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
};

const avatarFallback = {
  width: 52,
  height: 52,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "#ecebe7",
  fontWeight: 600,
  flexShrink: 0,
};

const nameRow = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  minWidth: 0,
};

const name = {
  fontSize: 16,
  fontWeight: 500,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const statusIcon = {
  width: 18,
  height: 18,
  flexShrink: 0,
};

const meta = {
  fontSize: 13,
  color: "rgba(0,0,0,0.6)",
};

const row = {
  display: "grid",
  gridTemplateColumns: "110px 1fr",
  gap: 12,
  marginTop: 8,
  fontSize: 14,
  alignItems: "start",
};

const label = {
  color: "rgba(0,0,0,0.6)",
};

const value = {
  wordBreak: "break-word",
  textAlign: "left",
};

const viewBtn = {
  display: "inline-block",
  marginTop: 16,
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(0,0,0,0.08)",
  textDecoration: "none",
  fontSize: 13,
  color: "#111111",
};