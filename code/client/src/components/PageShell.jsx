// src/components/PageShell.jsx
export default function PageShell({ title, children, right }) {
  return (
    <div style={{ background: "#f6f7fb", minHeight: "calc(100vh - 60px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 18px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ margin: 0, color: "#0b2a6f", fontSize: 32, fontWeight: 600 }}>
            {title}
          </h1>
          {right}
        </div>

        <div style={{ marginTop: 18 }}>
          {children}
        </div>
      </div>
    </div>
  );
}