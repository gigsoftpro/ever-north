export default function ProfileEditor({ profile, setProfile, onSave }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-3">
      <h3 className="font-semibold">Profile & Security</h3>
      <input
        className="w-full border p-2 rounded-lg"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        placeholder="Name"
      />
      <input
        className="w-full border p-2 rounded-lg"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        placeholder="Email"
      />
      <input
        className="w-full border p-2 rounded-lg"
        value={profile.password}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
        placeholder="Password"
      />
      <button
        className="px-4 py-2 rounded bg-slate-900 text-white"
        onClick={onSave}
      >
        Update Profile
      </button>
    </div>
  );
}
