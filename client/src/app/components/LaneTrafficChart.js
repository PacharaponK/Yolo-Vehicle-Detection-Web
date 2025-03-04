import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LaneTrafficChart = ({ vehicleData }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (!vehicleData || vehicleData.length === 0) {
      console.log("No vehicle data provided");
      return;
    }

    console.log("Total vehicles:", vehicleData.length);
    console.log("Sample vehicle data:", vehicleData.slice(0, 5));

    // กำหนดเวลาปัจจุบัน (UTC) และบวก 7 ชั่วโมง
    const now = new Date(); // เวลาปัจจุบันใน UTC
    const startTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // บวก 7 ชั่วโมง
    const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000); // บวก 3 ชั่วโมงจาก startTime

    const intervalMs = 5 * 60 * 1000; // 5 นาที
    const numIntervals = Math.ceil((3 * 60 * 60 * 1000) / intervalMs); // 3 ชั่วโมง หาร 5 นาที = 36 ช่วง

    console.log("Current time (UTC):", now.toISOString());
    console.log("Start time (UTC):", startTime.toISOString());
    console.log("End time (UTC):", endTime.toISOString());
    console.log("Number of intervals:", numIntervals);

    // หาเลนทั้งหมดที่มีในข้อมูล
    const lanes = [...new Set(vehicleData.map((v) => v.lane_id))]; // เช่น [1, 2, 3]
    const laneTraffic = {};

    // เตรียม array สำหรับแต่ละเลน
    lanes.forEach((lane) => {
      laneTraffic[lane] = Array(numIntervals).fill(0);
    });

    // นับจำนวนรถในแต่ละเลนตามช่วงเวลา
    vehicleData.forEach(({ lane_id, entry_time }) => {
      if (!lane_id || !entry_time) {
        console.log("Skipping invalid vehicle:", { lane_id, entry_time });
        return;
      }

      const entryDate = new Date(entry_time);
      if (entryDate >= startTime && entryDate <= endTime) {
        const timeDiff = entryDate - startTime;
        const index = Math.floor(timeDiff / intervalMs);

        if (laneTraffic[lane_id] && index >= 0 && index < numIntervals) {
          laneTraffic[lane_id][index] += 1;
        } else {
          console.log(
            "Index out of bounds:",
            index,
            "for entry_time:",
            entry_time
          );
        }
      }
    });

    console.log("Lane traffic:", laneTraffic);

    // สร้าง labels โดยใช้ UTC ดิบๆ ในรูปแบบ HH:mm
    const labels = Array.from({ length: numIntervals }, (_, i) => {
      const time = new Date(startTime.getTime() + i * intervalMs);
      const hours = time.getUTCHours().toString().padStart(2, "0");
      const minutes = time.getUTCMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    // กำหนดสีสำหรับแต่ละเลน
    const colors = {
      1: "rgba(54, 162, 235, 1)", // น้ำเงิน
      2: "rgba(255, 99, 132, 1)", // แดง
      3: "rgba(75, 192, 192, 1)", // เขียวอมฟ้า
    };

    // สร้าง datasets สำหรับแต่ละเลน
    const datasets = lanes.map((lane) => ({
      label: `เลน ${lane}`,
      data: laneTraffic[lane],
      borderColor: colors[lane] || "rgba(0, 0, 0, 1)",
      backgroundColor:
        colors[lane]?.replace("1)", "0.2)") || "rgba(0, 0, 0, 0.2)",
      borderWidth: 2,
      pointRadius: 5,
      fill: false,
    }));

    setChartData({ labels, datasets });
  }, [vehicleData]);

  return (
    <div className="w-full h-[30vh] max-h-[400px] md:max-h-[500px]">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 500,
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "จำนวนรถ",
              },
            },
            x: {
              title: {
                display: true,
                text: "เวลา",
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 12, // จำกัดจำนวน ticks ให้เหมาะกับ 3 ชั่วโมง
                maxRotation: 45,
                minRotation: 45,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "จำนวนรถแยกตามเลน (3 ชั่วโมงจากเวลาปัจจุบัน +7 ชม., ทุก 5 นาที)",
              font: {
                size: 16,
              },
            },
            legend: {
              position: "top",
            },
          },
        }}
      />
    </div>
  );
};

export default LaneTrafficChart;
