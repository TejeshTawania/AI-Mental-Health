import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const CONCERNS = ["stress", "sleep", "motivation"];

const RoutineBuilder = () => {
  const [concern, setConcern] = useState(null);
  const [template, setTemplate] = useState([]);
  const [selected, setSelected] = useState([]);
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchRoutines = async () => {
    const res = await fetch("http://localhost:3000/api/routine", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setSavedRoutines(data);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("http://localhost:3000/api/routine", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && active) setSavedRoutines(data);
      });
    return () => {
      active = false;
    };
  }, []);

  const pickConcern = async (c) => {
    setConcern(c);
    const res = await fetch(`http://localhost:3000/api/routine/template/${c}`, {
      credentials: "include",
    });
    const data = await res.json();
    setTemplate(data.items);
    setSelected(data.items);
  };

  const toggleItem = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const saveRoutine = async () => {
    setSaving(true);
    await fetch("http://localhost:3000/api/routine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ concern, items: selected }),
    });
    setSaving(false);
    setConcern(null);
    fetchRoutines();
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-8">
      <h2 className="text-lg font-medium mb-4">Build a routine</h2>

      {!concern && (
        <div className="flex gap-2 mb-8">
          {CONCERNS.map((c) => (
            <button
              key={c}
              onClick={() => pickConcern(c)}
              className="capitalize text-sm px-4 py-2 rounded-lg bg-[#232B28] border border-[#3A443F] hover:border-[#7A9B8E] transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {concern && (
        <div className="mb-8">
          <p className="text-sm text-[#8A9691] mb-3 capitalize">
            {concern} routine — tap to remove any
          </p>
          <div className="space-y-2">
            {template.map((item) => (
              <button
                key={item}
                onClick={() => toggleItem(item)}
                className={
                  "w-full flex items-center gap-2 text-sm text-left px-3 py-2 rounded-lg border transition-colors " +
                  (selected.includes(item)
                    ? "border-[#7A9B8E] text-[#F2F0E9]"
                    : "border-[#3A443F] text-[#5E6862] line-through")
                }
              >
                <Check
                  className={
                    "w-4 h-4 " +
                    (selected.includes(item)
                      ? "text-[#7A9B8E]"
                      : "text-transparent")
                  }
                />
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={saveRoutine}
            disabled={saving || selected.length === 0}
            className="mt-4 bg-[#7A9B8E] text-[#152019] text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#8CADA0] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save routine"}
          </button>
        </div>
      )}

      {savedRoutines.length > 0 && (
        <div>
          <h3 className="text-sm text-[#8A9691] mb-3">Saved routines</h3>
          <div className="space-y-3">
            {savedRoutines.map((r) => (
              <div
                key={r._id}
                className="bg-[#232B28] border border-[#3A443F] rounded-lg p-4"
              >
                <p className="text-sm font-medium capitalize mb-2">
                  {r.concern}
                </p>
                <ul className="text-sm text-[#B8C4BE] space-y-1">
                  {r.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineBuilder;
