import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  if (!user) return null;

  // When edit button is clicked, reuse Register.jsx with user data pre-filled!
  if (isEditing) {
    return (
      <Register
        isEdit={true}
        editData={user}
        onSave={handleUpdateSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black">
      <div className="w-full max-w-lg border border-black p-6 rounded space-y-5">
        
        {/* Header & Avatar */}
        <div className="flex flex-col items-center gap-2 border-b border-black pb-4">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Avatar"
              className="w-20 h-20 rounded-full border border-black object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border border-black flex items-center justify-center text-xl font-bold bg-gray-100">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <span className="text-xs uppercase tracking-wider border border-black px-2 py-0.5 rounded">
            {user.accountType}
          </span>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold">Email: </span>
            {user.email}
          </div>
          <div>
            <span className="font-semibold">Phone: </span>
            {user.phone || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Age: </span>
            {user.age || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Date of Birth: </span>
            {user.dob || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Gender: </span>
            {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Country: </span>
            {user.country || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Experience: </span>
            {user.experience} years
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Theme Color: </span>
            <span
              className="w-4 h-4 rounded-full border border-black inline-block"
              style={{ backgroundColor: user.themeColor || "#000" }}
            />
            <span className="font-mono text-xs">{user.themeColor}</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <span className="block font-semibold text-sm mb-1">Skills:</span>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s) => (
                <span
                  key={s}
                  className="border border-black px-2 py-0.5 rounded text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic">No skills added</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <span className="block font-semibold text-sm mb-1">Bio:</span>
          <p className="border border-black p-2 rounded text-sm min-h-12">
            {user.bio || "No bio provided"}
          </p>
        </div>

        {/* Resume */}
        <div>
          <span className="font-semibold text-sm">Resume: </span>
          {user.resume ? (
            <a
              href={user.resume}
              target="_blank"
              rel="noreferrer"
              className="underline font-medium text-sm"
            >
              View Uploaded Resume
            </a>
          ) : (
            <span className="text-sm italic">Not uploaded</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 bg-black text-white p-2 rounded font-semibold hover:bg-gray-800 cursor-pointer"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 border border-black p-2 rounded font-semibold hover:bg-gray-100 cursor-pointer"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
