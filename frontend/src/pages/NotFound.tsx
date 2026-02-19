import { Link } from "react-router";

export function NotFound() {
  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "128px 32px" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "24px" }}>
        <h1 style={{ fontSize: "3.75rem", color: "rgba(136, 136, 136, 0.8)", marginBottom: 0 }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", marginTop: 0 }}>Page Not Found</h2>
        <p style={{ color: "rgba(237, 237, 237, 0.7)", lineHeight: 1.6 }}>
          The requested page does not exist in this mathematical space.
        </p>
        <div style={{ paddingTop: "32px" }}>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "var(--secondary)",
              textDecoration: "none",
              color: "var(--foreground)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(26, 26, 26, 0.8)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--secondary)"}
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
