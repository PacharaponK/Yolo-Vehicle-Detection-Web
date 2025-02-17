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
  const hourlyTraffic = {};

  vehicleTypes.forEach((type) => {
    hourlyTraffic[type] = Array(24).fill(0);
  });

  vehicleData.forEach(({ class: type, entry_time }) => {
    const hour = new Date(entry_time).getHours();
    if (hourlyTraffic[type]) {
      hourlyTraffic[type][hour] += 1;
    }
  });

  const colors = {
    car: "rgba(54, 162, 235, 1)", // ฟ้า
    truck: "rgba(255, 99, 132, 1)", // แดง
    bus: "rgba(255, 206, 86, 1)", // เหลือง
    motorcycle: "rgba(75, 192, 192, 1)", // เขียวอมฟ้า
  };

  const datasets = vehicleTypes.map((type) => ({
    label: `จำนวน ${type}`,
    data: hourlyTraffic[type],
    borderColor: colors[type] || "rgba(0, 0, 0, 1)",
    backgroundColor:
      colors[type]?.replace("1)", "0.2)") || "rgba(0, 0, 0, 0.2)",
    borderWidth: 2,
    pointRadius: 4,
    fill: false,
  }));

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets,
  };

  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  );
};

export default TrafficChart;
