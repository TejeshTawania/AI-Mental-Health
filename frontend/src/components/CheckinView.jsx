import { useState, useEffect } from "react";

const Slider = ({ label, value, setValue }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-[#8A9691]">{label}</span>
      <span className="text-[#F2F0E9]">{value}/10</span>
    </div>
    <input
      type="range"
      min="1"
      max="10"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full accent-[#7A9B8E]"
    />
  </div>
);

const CheckinView = () => {
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:3000/api/checkin", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setHistory(data.history);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("http://localhost:3000/api/checkin", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && active) setHistory(data.history);
      });
    return () => {
      active = false;
    };
  }, []);

  const submitCheckin = async () => {
    setSaving(true);
    await fetch("http://localhost:3000/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mood, stress, energy, note }),
    });
    setSaving(false);
    setNote("");
    fetchHistory();
  };

  const alreadyCheckedIn = history.some(
    (h) => new Date(h.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-8">
      <h2 className="text-lg font-medium mb-4">Today's check-in</h2>

      {alreadyCheckedIn ? (
        <div className="bg-[#232B28] border border-[#3A443F] rounded-lg p-6 text-center text-sm text-[#B8C4BE] mb-6">
          <p className="font-medium text-[#F2F0E9] mb-1">Already checked in!</p>
          <p className="text-[#8A9691]">You've logged your entry for today. See you tomorrow!</p>
        </div>
      ) : (
        <>
          <Slider label="Mood" value={mood} setValue={setMood} />
          <Slider label="Stress" value={stress} setValue={setStress} />
          <Slider label="Energy" value={energy} setValue={setEnergy} />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything on your mind today? (optional)"
            rows={3}
            className="w-full chat-input-field rounded-lg p-3 text-sm mb-4"
          />

          <button
            onClick={submitCheckin}
            disabled={saving}
            className="bg-[#7A9B8E] text-[#152019] text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#8CADA0] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Log check-in"}
          </button>
        </>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm text-[#8A9691] mb-3">Recent check-ins</h3>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h._id} className="text-sm text-[#B8C4BE] flex gap-4">
                <span className="text-[#5E6862]">
                  {new Date(h.date).toLocaleDateString()}
                </span>
                <span>
                  Mood {h.mood} · Stress {h.stress} · Energy {h.energy}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckinView;
