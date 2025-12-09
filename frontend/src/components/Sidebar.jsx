export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: "🏠" },
    { label: "Holdings", icon: "📊" },
    { label: "Reports", icon: "📈" },
    { label: "Alerts", icon: "🔔" },
    { label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-60 bg-white border-r h-screen p-6">
      <div className="space-y-4">
        {menu.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <span>{item.icon}</span>
            <span className="text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
