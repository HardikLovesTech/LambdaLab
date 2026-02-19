export function SectionDivider({
  width = 48,
  color = "rgba(137, 137, 137, 0.4)",
  margin = "64px 0"
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: margin,
        width: "100%",
      }}
    >
      <div
        style={{
          height: "1px",
          width: `${width}px`,
          background: `linear-gradient(to right, transparent, ${color})`,
        }}
      />

      <div
        style={{
          margin: "0 18px",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />

      <div
        style={{
          height: "1px",
          width: `${width}px`,
          background: `linear-gradient(to left, transparent, ${color})`,
        }}
      />
    </div>
  );
}
