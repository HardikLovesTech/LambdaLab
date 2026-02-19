import { Outlet } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export function Root() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", display: "flex", flexDirection: "column" }}>
      <Navigation />
      <main style={{ paddingTop: "80px", flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
