// components/LaneTrafficChart.jsx
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
    if (!vehicleData || vehicleData.length === 0) return;

    const now = new Date();
    const startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 ชม. ก่อนหน้า
    const numIntervals = 24; // ทุก 30 นาที รวม 12 ชั่วโมง

    // หาเลนทั้งหมดที่มีในข้อมูล
    const lanes = [...new Set(vehicleData.map((v) => v.lane_id))]; // เช่น [1, 2, 3]
    const laneTraffic = {};

    // เตรียม array สำหรับแต่ละเลน
    lanes.forEach((lane) => {
      laneTraffic[lane] = Array(numIntervals).fill(0);
    });

    // นับจำนวนรถในแต่ละเลนตามช่วงเวลา
    vehicleData.forEach(({ lane_id, entry_time }) => {
      const entryDate = new Date(entry_time);

      if (entryDate >= startTime && entryDate <= now) {
        const timeDiff = entryDate - startTime;
        const index = Math.floor(timeDiff / (30 * 60 * 1000)); // ดัชนีช่วงครึ่งชั่วโมง

        if (laneTraffic[lane_id] && index < numIntervals) {
          laneTraffic[lane_id][index] += 1;
        }
      }
    });

    // สร้าง labels (เวลา)
    const labels = Array.from({ length: numIntervals }, (_, i) => {
      const time = new Date(startTime.getTime() + i * 30 * 60 * 1000);
      return time.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
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
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "จำนวนรถแยกตามเลน (12 ชั่วโมงย้อนหลัง)",
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
