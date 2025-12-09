export default function OrdersCard({ name, change, portfolio }) {
  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span className={change > 0 ? "text-green-600" : "text-red-600"}>
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      </div>

      <p className="mt-2 text-gray-500 text-sm">Invested</p>
      <p className="text-xl font-bold">{portfolio}</p>

      <div className="mt-3 h-10 rounded-xl bg-green-200"></div>
    </div>
  );
}
