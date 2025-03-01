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

const TrafficChart = ({ vehicleData }) => {
  const vehicleTypes = ["car", "truck", "bus", "motorcycle"];
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (!vehicleData || vehicleData.length === 0) return; // ถ้าไม่มีข้อมูล ไม่ต้องอัปเดต

    const now = new Date(); // เวลาปัจจุบัน
    const startTime = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 ชม. ก่อนหน้า

    const numIntervals = 24; // 12 ชั่วโมง (ทุกๆ 30 นาที)
    const halfHourlyTraffic = {};

    vehicleTypes.forEach((type) => {
      halfHourlyTraffic[type] = Array(numIntervals).fill(0);
    });

    vehicleData.forEach(({ class: type, entry_time }) => {
      const entryDate = new Date(entry_time);

      if (entryDate >= startTime && entryDate <= now) {
        const timeDiff = entryDate - startTime;
        const index = Math.floor(timeDiff / (30 * 60 * 1000)); // คำนวณ index เป็นช่วงครึ่งชั่วโมง

        if (halfHourlyTraffic[type] && index < numIntervals) {
          halfHourlyTraffic[type][index] += 1;
        }
      }
    });

    const labels = Array.from({ length: numIntervals }, (_, i) => {
      const time = new Date(startTime.getTime() + i * 30 * 60 * 1000);
      return time.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    const colors = {
      car: "rgba(54, 162, 235, 1)",
      truck: "rgba(255, 99, 132, 1)",
      bus: "rgba(255, 206, 86, 1)",
      motorcycle: "rgba(75, 192, 192, 1)",
    };

    const datasets = vehicleTypes.map((type) => ({
      label: `จำนวน ${type}`,
      data: halfHourlyTraffic[type],
      borderColor: colors[type] || "rgba(0, 0, 0, 1)",
      backgroundColor:
        colors[type]?.replace("1)", "0.2)") || "rgba(0, 0, 0, 0.2)",
      borderWidth: 2,
      pointRadius: 5,
      fill: false,
    }));

    setChartData({ labels, datasets });
  }, [vehicleData]); // อัปเดตทุกครั้งที่ vehicleData เปลี่ยน

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
            },
            x: {
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
              text: "จำนวนรถแยกตามประเภทรถ (12 ชั่วโมงย้อนหลัง)",
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

export default TrafficChart;
