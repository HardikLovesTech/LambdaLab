import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CodeBlockProps {
  title: string;
  code: string;
  language?: string;
  defaultOpen?: boolean;
}

export function CodeBlock({ title, code, language = "python", defaultOpen = false }: CodeBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div style={{ margin: "24px 0", border: `1px solid var(--border)`, borderRadius: "8px", overflow: "hidden" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "12px 16px",
          textAlign: "left",
          backgroundColor: "rgba(26, 26, 26, 0.5)",
          border: "none",
          cursor: "pointer",
          color: "var(--foreground)",
          fontSize: "0.875rem",
          fontFamily: "'Fira Code', monospace",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(26, 26, 26, 0.7)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(26, 26, 26, 0.5)"}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <span>{title}</span>
      </button>
      {isOpen && (
        <pre style={{
          padding: "24px",
          backgroundColor: "rgba(10, 10, 10, 0.5)",
          borderTop: `1px solid var(--border)`,
          margin: 0,
          overflowX: "auto",
          borderRadius: "0 0 8px 8px",
        }}>
          <code style={{
            fontSize: "0.875rem",
            color: "rgba(237, 237, 237, 0.9)",
            fontFamily: "'Fira Code', monospace",
            lineHeight: "1.5",
          }}>
            {code}
          </code>
        </pre>
      )}
    </div>
  );
}
