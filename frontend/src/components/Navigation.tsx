import { Link, useLocation } from "react-router";

export function Navigation() {
  const location = useLocation();
  
  const links = [
    { path: "/", label: "Home" },
    { path: "/theory", label: "Theory" },
    { path: "/implementation", label: "Implementation" },
    { path: "/experiments", label: "Experiments" },
    { path: "/demo", label: "Demo" },
  ];
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      borderBottom: `1px solid var(--border)`,
      backgroundColor: "rgba(10, 10, 10, 0.8)",
      backdropFilter: "blur(4px)",
    }}>
      <nav style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link to="/" style={{
          fontSize: "1rem",
          letterSpacing: "0.05em",
          opacity: 0.9,
          transition: "opacity 0.2s",
        }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0.9"}>
          LambdaLab
        </Link>
        
        <div style={{ display: "flex", gap: "32px" }}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
                color: isActive(link.path) ? "var(--foreground)" : "var(--muted-foreground)",
                position: "relative",
                paddingBottom: "4px",
                borderBottom: isActive(link.path) ? "1px solid rgba(237, 237, 237, 0.3)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--foreground)"}
              onMouseLeave={(e) => e.currentTarget.style.color = isActive(link.path) ? "var(--foreground)" : "var(--muted-foreground)"}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
