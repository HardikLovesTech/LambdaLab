import { BlockMath } from "react-katex";

interface MathBlockProps {
  children: string;
}

export function MathBlock({ children }: MathBlockProps) {
  return (
    <div style={{
      margin: "32px 0",
      padding: "24px",
      backgroundColor: "rgba(26, 26, 26, 0.5)",
      borderRadius: "8px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      overflowX: "auto",
    }}>
      <BlockMath math={children} />
    </div>
  );
}
