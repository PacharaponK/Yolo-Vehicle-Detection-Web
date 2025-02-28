import { useState, useEffect } from "react";

export default function ReportBytime({ vehicles }) {
  const [timeData, setTimeData] = useState({
    morning: { count: 0, avgSpeed: 0 },
    afternoon: { count: 0, avgSpeed: 0 },
    evening: { count: 0, avgSpeed: 0 },
    night: { count: 0, avgSpeed: 0 },
  });

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      const timeRanges = {
        morning: [6, 10],
        afternoon: [10, 14],
        evening: [14, 18],
        night: [18, 6],
      };

      const filterAndCalculate = (start, end) => {
        const filtered = vehicles
          .map((vehicle) => {
            if (!vehicle.entry_time || !vehicle.exit_time) return null;

            const startTime = new Date(vehicle.entry_time);
            const endTime = new Date(vehicle.exit_time);
            const hour = startTime.getHours();
            const distance = 200; // ระยะทางเป็นเมตร
            const timeDiff = (endTime - startTime) / 1000; // คำนวณเวลาเป็นวินาที

            if (timeDiff <= 0) return null;
            const speed = (distance / timeDiff) * 3.6; // แปลงเป็น km/h

            return start < end
              ? hour >= start && hour < end
                ? { ...vehicle, speed }
                : null
              : hour >= start || hour < end
              ? { ...vehicle, speed }
              : null;
          })
          .filter((v) => v !== null);

        const avgSpeed =
          filtered.length > 0
            ? (filtered.reduce((sum, v) => sum + v.speed, 0) /
                filtered.length).toFixed(2)
            : 0;

        return { count: filtered.length, avgSpeed };
      };

      setTimeData({
        morning: filterAndCalculate(...timeRanges.morning),
        afternoon: filterAndCalculate(...timeRanges.afternoon),
        evening: filterAndCalculate(...timeRanges.evening),
        night: filterAndCalculate(...timeRanges.night),
      });
    }
  }, [vehicles]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: "ช่วงเช้า (06:00 - 10:00 น.)", key: "morning" },
        { label: "ช่วงกลางวัน (10:00 - 14:00 น.)", key: "afternoon" },
        { label: "ช่วงเย็น (14:00 - 18:00 น.)", key: "evening" },
        { label: "ช่วงกลางคืน (18:00 - 06:00 น.)", key: "night" },
      ].map(({ label, key }) => (
        <div key={key} className="flex-1 bg-rose-200 rounded-xl p-10 shadow-lg">
          <h2 className="text-2xl text-black font-bold mb-4">{label}</h2>
          <p className="text-black">🚗 จำนวนรถที่ตรวจจับได้: {timeData[key].count} คัน</p>
          <p className="text-black">⏩ ความเร็วเฉลี่ย: {timeData[key].avgSpeed} km/h</p>
        </div>
      ))}
    </div>
  );
}
