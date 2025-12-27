export default function HeaderAdmin({ title }) {
  return (
    <header className="bg-white text-[var(--primary)] px-6 py-4 flex justify-between items-center shadow">
      <h2 className="text-xl font-semibold">{title}</h2>
    </header>
  );
}
