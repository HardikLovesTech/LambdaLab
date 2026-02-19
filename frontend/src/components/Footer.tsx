export function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid var(--border)`,
      marginTop: "128px",
    }}>
      <div style={{
        maxWidth: "850px",
        margin: "0 auto",
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        fontSize: "0.875rem",
        color: "var(--muted-foreground)",
      }}>
        <div style={{ display: "flex", gap: "32px" }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--muted-foreground)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted-foreground)"}
          >
            GitHub
          </a>
          <a
            href="https://arxiv.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--muted-foreground)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted-foreground)"}
          >
            arXiv
          </a>
          <a
            href="mailto:research@example.com"
            style={{ color: "var(--muted-foreground)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted-foreground)"}
          >
            Contact
          </a>
        </div>
        <div style={{ fontSize: "0.75rem" }}>
          © 2026 LambdaLab. Research-grade quantitative analysis.
        </div>
      </div>
    </footer>
  );
}
