export function SectionDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "64px 0" }}>
      <div style={{ height: "1px", width: "48px", backgroundColor: "rgba(137, 137, 137, 0.5)" }}></div>
      <div style={{ margin: "0 16px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(137, 137, 137, 0.5)" }}></div>
      <div style={{ height: "1px", width: "48px", backgroundColor: "rgba(137, 137, 137, 0.5)" }}></div>
    </div>
  );
}
