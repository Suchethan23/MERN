export default function InvestmentReturn({ items }) {
  return (
    <div className="border rounded-xl p-4 shadow bg-white space-y-6">
      {items.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-sm">
            <span>{item.name}</span>
            <span className="text-green-600 font-medium">{item.value}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${item.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
