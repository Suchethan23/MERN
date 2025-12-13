// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function ChartCard({ title, data }) {
//   return (
//     <div className="border rounded-xl shadow bg-white p-4">
//       <h2 className="text-lg font-semibold mb-4">{title}</h2>

//       <div className="h-72">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={data}>
//             <XAxis dataKey="name" stroke="#aaa" />
//             <YAxis stroke="#aaa" />
//             <Tooltip />
//             <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef } from "react";
import {
  createChart,
  LineSeries,
  AreaSeries,
  HistogramSeries
} from "lightweight-charts";

export default function GrowLineChart({
  data,
  height = 400,
  lineColor = "#00b386",
  areaTopColor = "rgba(0, 179, 134, 0.3)",
  areaBottomColor = "rgba(0, 179, 134, 0.0)",
  showArea = true,
  showVolume = false,
  volumeData = [],
}) {

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data?.length) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: { background:{color:"#fff"}, textColor:"#333" },
      grid:{ vertLines:{visible:false}, horzLines:{visible:false} },
      rightPriceScale:{ visible:true, borderVisible:false },
      timeScale:{ borderVisible:false, timeVisible:true },
    });

    chartRef.current = chart;

    // AREA (Groww smooth shading)
    if(showArea){
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: lineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
        lineWidth: 2,
      });
      areaSeries.setData(data);
    }

    // MAIN LINE
    const lineSeries = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 2,
      priceLineVisible:false,
    });
    lineSeries.setData(data);

    // Volume
    if(showVolume && volumeData?.length){
      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat:{ type:"volume" },
        scaleMargins:{ top:0.7, bottom:0 },
      });
      volumeSeries.setData(volumeData);
    }

    chart.timeScale().fitContent();

  }, [data, height, showArea, showVolume]);

  return <div ref={chartContainerRef} style={{width:"100%", height}} />;
}
