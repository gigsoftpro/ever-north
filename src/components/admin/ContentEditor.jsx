import { useState } from "react";
import { getIn, setIn } from "./adminUtils";

export default function ContentEditor({ draft, setDraft, textSections }) {
  const [activeTab, setActiveTab] = useState(textSections[0]?.id ?? "");
  const activeSection =
    textSections.find((s) => s.id === activeTab) ?? textSections[0];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 space-y-6">
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {textSections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`px-4 py-2 text-sm rounded-full transition ${activeTab === s.id ? "bg-gradient-to-r from-amber-600 to-amber-400 text-black font-semibold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {s.title}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
        <h3 className="font-semibold mb-3 text-slate-900">
          {activeSection.title}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {activeSection.fields.map(([path, label]) => (
            <label key={path} className="block">
              <span className="text-xs font-medium text-slate-500">
                {label}
              </span>
              <textarea
                rows={
                  path.includes("description") || path.includes("Text") ? 4 : 2
                }
                className="w-full mt-1 border border-slate-200 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-amber-300 outline-none"
                value={getIn(draft, path)}
                onChange={(e) => setDraft(setIn(draft, path, e.target.value))}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
