export default function Header() {
  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow">
      <h1 className="text-2xl font-semibold">InvestX</h1>

      <div className="relative w-1/3">
        <input
          placeholder="Search..."
          className="w-full px-10 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
      </div>

      <div className="flex items-center gap-5 text-xl">
        🌐
        🔔
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}
