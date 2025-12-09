export default function FundCard({ title, category, returns }) {
  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-gray-500 text-sm">{category}</p>

      <p className="text-green-600 text-xl font-bold mt-4">+{returns}%</p>

      <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
        <div
          className="h-2 bg-green-500 rounded-full"
          style={{ width: `${returns}%` }}
        ></div>
      </div>
    </div>
  );
}
