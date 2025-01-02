export default function MenuCard({ item }) {
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      <h3>{item.name}</h3>
      <p>{item.price}</p>
    </div>
  );
}
