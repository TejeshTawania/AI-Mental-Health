import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Flame } from "lucide-react";

const ProgressView = () => {
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetch("/api/checkin", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history);
        setStreak(data.streak);
      });
  }, []);

  const chartData = [...history].reverse().map((h) => ({
    date: new Date(h.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    mood: h.mood,
    stress: h.stress,
    energy: h.energy,
  }));

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-8">
      <h2 className="text-lg font-medium mb-6">Your progress</h2>

      <div className="flex items-center gap-3 bg-[#232B28] border border-[#3A443F] rounded-lg p-4 mb-8">
        <Flame className="w-6 h-6 text-[#E8A855]" />
        <div>
          <p className="text-2xl font-medium">{streak}</p>
          <p className="text-sm text-[#8A9691]">day streak</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#5E6862" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="#5E6862" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#232B28",
                  border: "1px solid #3A443F",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#F2F0E9" }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#7A9B8E"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="#E8A855"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#8A9691"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-[#5E6862] text-sm text-center mt-12">
          Log a few check-ins to see your trend here.
        </p>
      )}

      <div className="flex gap-4 mt-4 text-sm">
        <span className="flex items-center gap-1.5 text-[#8A9691]">
          <span className="w-2 h-2 rounded-full bg-[#7A9B8E]"></span>Mood
        </span>
        <span className="flex items-center gap-1.5 text-[#8A9691]">
          <span className="w-2 h-2 rounded-full bg-[#E8A855]"></span>Stress
        </span>
        <span className="flex items-center gap-1.5 text-[#8A9691]">
          <span className="w-2 h-2 rounded-full bg-[#8A9691]"></span>Energy
        </span>
      </div>
    </div>
  );
};

export default ProgressView;
