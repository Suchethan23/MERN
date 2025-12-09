export default function Riskometer({ level }) {
  const levels = ["Low", "Moderate", "High"];

  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <h2 className="font-semibold">Scheme Riskometer</h2>

      <div className="flex items-end justify-between mt-6">
        {levels.map((lv) => (
          <div key={lv} className="flex flex-col items-center">
            <div
              className={`w-5 h-16 rounded-md ${
                lv === level ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>
            <p className="text-xs mt-2">{lv}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
