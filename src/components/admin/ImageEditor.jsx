import { getIn, setIn } from "./adminUtils";

export default function ImageEditor({ draft, setDraft, imageFields }) {
  const onFile = (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((prev) => setIn(prev, path, reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
      <div className="grid md:grid-cols-2 gap-4">
        {imageFields.map(([path, label]) => (
          <div
            key={path}
            className="rounded-xl border border-slate-200 p-4 bg-gradient-to-b from-white to-slate-50"
          >
            <p className="font-medium mb-2">{label}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e, path)}
              className="text-sm"
            />
            {getIn(draft, path) && (
              <img
                src={getIn(draft, path)}
                alt={label}
                className="mt-3 h-24 w-full object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
