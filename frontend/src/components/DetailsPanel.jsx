export default function DetailsPanel({ stock }) {
  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <h2 className="text-lg font-semibold">{stock.name}</h2>

      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <p><strong>Previous Close:</strong> {stock.prevClose}</p>
        <p><strong>Day Range:</strong> {stock.range}</p>
        <p><strong>Market Cap:</strong> {stock.marketCap}</p>
        <p><strong>Volume:</strong> {stock.volume}</p>
        <p><strong>P/E Ratio:</strong> {stock.pe}</p>
        <p><strong>Exchange:</strong> {stock.exchange}</p>
      </div>
    </div>
  );
}
