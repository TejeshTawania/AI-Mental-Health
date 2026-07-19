import { useState, useEffect } from "react";
import { Check, Sparkles, ListChecks, Trash2 } from "lucide-react";

const CONCERNS = ["stress", "sleep", "motivation"];

const RoutineBuilder = () => {
  const [concern, setConcern] = useState(null);
  const [template, setTemplate] = useState([]);
  const [selected, setSelected] = useState([]);
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchRoutines = async () => {
    const res = await fetch("/api/routine", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setSavedRoutines(data);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/routine", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && active) setSavedRoutines(data);
      });
    return () => {
      active = false;
    };
  }, []);

  const pickTemplate = async (c) => {
    setConcern(c);
    const res = await fetch(`/api/routine/template/${c}`, {
      credentials: "include",
    });
    const data = await res.json();
    setTemplate(data.items);
    setSelected(data.items);
  };

  const pickAIRoutine = async (c) => {
    setConcern(c);
    setGenerating(true);
    setTemplate([]);
    setSelected([]);
    try {
      const res = await fetch(`/api/routine/ai/${c}`, {
        credentials: "include",
      });
      const data = await res.json();
      setTemplate(data.items);
      setSelected(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const toggleItem = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const saveRoutine = async () => {
    setSaving(true);
    await fetch("/api/routine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ concern, items: selected }),
    });
    setSaving(false);
    setConcern(null);
    fetchRoutines();
  };

  const toggleCompleted = async (routineId, itemIndex) => {
    setSavedRoutines((prev) =>
      prev.map((r) => {
        if (r._id !== routineId) return r;
        const updatedItems = r.items.map((item, i) => {
          if (i !== itemIndex) return item;
          const text = typeof item === "string" ? item : item.text;
          const completed = typeof item === "string" ? false : item.completed;
          return { text, completed: !completed };
        });
        return { ...r, items: updatedItems };
      }),
    );

    await fetch(`/api/routine/${routineId}/toggle`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ itemIndex }),
    });
  };

  const handleDeleteRoutine = async (routineId) => {
    setSavedRoutines((prev) => prev.filter((r) => r._id !== routineId));

    await fetch(`/api/routine/${routineId}`, {
      method: "DELETE",
      credentials: "include",
    });
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-6 py-8">
      <h2 className="text-lg font-medium mb-4">Build a routine</h2>

      {!concern && (
        <div className="space-y-4 mb-8">
          {CONCERNS.map((c) => (
            <div
              key={c}
              className="flex items-center justify-between bg-[#232B28] border border-[#3A443F] rounded-lg px-4 py-3"
            >
              <span className="capitalize text-sm">{c}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => pickTemplate(c)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#3A443F] hover:border-[#7A9B8E] transition-colors"
                >
                  <ListChecks className="w-3.5 h-3.5" /> Standard
                </button>
                <button
                  onClick={() => pickAIRoutine(c)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#7A9B8E] text-[#152019] hover:bg-[#8CADA0] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI-generated
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {concern && (
        <div className="mb-8">
          <p className="text-sm text-[#8A9691] mb-3 capitalize">
            {concern} routine — tap to remove any
          </p>

          {generating ? (
            <p className="text-sm text-[#5E6862]">Generating your routine...</p>
          ) : (
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
          )}

          {!generating && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={saveRoutine}
                disabled={saving || selected.length === 0}
                className="bg-[#7A9B8E] text-[#152019] text-sm font-medium rounded-lg px-4 py-2 hover:bg-[#8CADA0] transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save routine"}
              </button>
              <button
                onClick={() => setConcern(null)}
                className="text-sm px-4 py-2 text-[#8A9691] hover:text-[#F2F0E9] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {savedRoutines.length > 0 && (
        <div>
          <h3 className="text-sm text-[#8A9691] mb-3">Saved routines</h3>
          <div className="space-y-3">
            {savedRoutines.map((r) => {
              const allCompleted = r.items.length > 0 && r.items.every(
                (item) => typeof item === "string" ? false : item.completed
              );
              return (
                <div
                  key={r._id}
                  className="bg-[#232B28] border border-[#3A443F] rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium capitalize">
                      {r.concern}
                    </p>
                    <div className="flex items-center gap-2">
                      {allCompleted && (
                        <span className="text-xs text-[#7A9B8E] bg-[#1C2321] border border-[#2E3733] px-2 py-0.5 rounded-full font-medium">
                          Completed
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteRoutine(r._id)}
                        className="text-[#5E6862] hover:text-[#E8A855] transition-colors p-1"
                        title="Delete routine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {allCompleted && (
                    <div className="bg-[#1C2321] border border-[#7A9B8E]/30 rounded-lg p-3 text-center my-3">
                      <p className="text-xs font-semibold text-[#7A9B8E] mb-0.5">🌟 Congratulations! 🌟</p>
                      <p className="text-[10px] text-[#8A9691]">You've completed your entire routine for today!</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {r.items.map((item, i) => {
                      const text = typeof item === "string" ? item : item.text;
                      const completed = typeof item === "string" ? false : item.completed;
                      return (
                        <button
                          key={i}
                          onClick={() => toggleCompleted(r._id, i)}
                          className={
                            "w-full flex items-center gap-2 text-xs text-left px-2 py-1 rounded transition-colors " +
                            (completed
                              ? "text-[#5E6862] line-through"
                              : "text-[#B8C4BE] hover:bg-[#2A3430]")
                          }
                        >
                          <Check
                            className={
                              "w-3.5 h-3.5 " +
                              (completed ? "text-[#7A9B8E]" : "text-[#3A443F]")
                            }
                          />
                          {text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineBuilder;
