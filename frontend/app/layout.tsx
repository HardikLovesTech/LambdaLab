import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LambdaLab",
  description: "Self-Exciting Point Processes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full h-[72px] bg-black border-b border-[#1e1e1e] z-50 flex items-center px-12">
          <div className="w-full max-w-[900px] mx-auto flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="text-white font-semibold text-lg tracking-tight">
              LambdaLab
            </a>

            {/* Nav Links */}
            <div className="flex gap-8 text-sm">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/theory">Theory</NavLink>
              <NavLink href="/implementation">Implementation</NavLink>
              <NavLink href="/experiments">Experiments</NavLink>
              <NavLink href="/demo">Demo</NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="w-full pt-[72px] pb-[96px]">
          <div className="max-w-[900px] mx-auto px-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#1e1e1e] py-12 text-center text-[#7a7a7a] text-xs">
          <p>&copy; 2026 LambdaLab. Self-Exciting Point Processes.</p>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[#b3b3b3] hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute bottom-[-8px] left-0 w-0 h-0.5 bg-[#4c6fff] group-hover:w-full transition-all duration-200"></span>
    </a>
  );
}
