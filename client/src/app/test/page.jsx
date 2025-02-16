"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generateMockData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map((hour) => ({
    hour: `${hour}:00`,
    car: Math.floor(Math.random() * 50) + 10,
    truck: Math.floor(Math.random() * 30) + 5,
    van: Math.floor(Math.random() * 20) + 3,
  }));
};

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateMockData());
  }, []);

  const totalCars = data.reduce((sum, item) => sum + item.car, 0);
  const totalTrucks = data.reduce((sum, item) => sum + item.truck, 0);
  const totalVans = data.reduce((sum, item) => sum + item.van, 0);

  return (
    <div className="p-4 grid grid-cols-2 gap-4 h-screen">
      {/* Left: Table */}
      <div className="bg-white p-4 shadow-md rounded-lg overflow-auto">
        <h2 className="text-lg font-bold mb-2">Vehicle Count Per Hour</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Hour</th>
              <th className="border p-2">Car</th>
              <th className="border p-2">Truck</th>
              <th className="border p-2">Van</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{item.hour}</td>
                <td className="border p-2">{item.car}</td>
                <td className="border p-2">{item.truck}</td>
                <td className="border p-2">{item.van}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: Graph + Summary */}
      <div className="flex flex-col gap-4">
        <div className="bg-white p-4 shadow-md rounded-lg h-2/3">
          <h2 className="text-lg font-bold mb-2">Vehicle Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="car"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="truck"
                stroke="#82ca9d"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="van"
                stroke="#ff7300"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-bold mb-2">Total Vehicle Count</h2>
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-gray-600">Cars</p>
              <p className="text-xl font-bold text-blue-500">{totalCars}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Trucks</p>
              <p className="text-xl font-bold text-green-500">{totalTrucks}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Vans</p>
              <p className="text-xl font-bold text-orange-500">{totalVans}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
