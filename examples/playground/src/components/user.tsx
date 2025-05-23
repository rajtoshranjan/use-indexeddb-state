import { useState } from "react";
import { useIndexedDbStore } from "use-idb-store";
import type { User } from "./types";

export function UserSection() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAge, setUserAge] = useState(25);

  // Test the hook with users
  const {
    values: users,
    mutations: userMutations,
    isLoading: usersLoading,
    error: usersError,
  } = useIndexedDbStore<User>("users");

  const addUser = () => {
    if (userName.trim() && userEmail.trim()) {
      const id = Date.now().toString();
      userMutations.addValue(id, {
        id,
        name: userName.trim(),
        email: userEmail.trim(),
        age: userAge,
      });
      setUserName("");
      setUserEmail("");
      setUserAge(25);
    }
  };

  const deleteUser = (id: string) => {
    userMutations.deleteValue(id);
  };

  const clearAllUsers = () => {
    Object.keys(users).forEach((id) => userMutations.deleteValue(id));
  };

  if (usersLoading) {
    return (
      <div>
        <h2>👥 Users (Loading...)</h2>
        <div style={{ padding: "20px", color: "#666", fontStyle: "italic" }}>
          Loading users...
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div>
        <h2>👥 Users (Error)</h2>
        <div style={{ padding: "20px", color: "red" }}>
          Error loading users: {usersError.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>👥 Users ({Object.keys(users).length})</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Name"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Email"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="number"
          value={userAge}
          onChange={(e) => setUserAge(Number(e.target.value))}
          placeholder="Age"
          min="1"
          max="120"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button onClick={addUser} style={{ marginRight: "10px" }}>
          Add User
        </button>
        <button
          onClick={clearAllUsers}
          style={{ background: "#dc3545", color: "white" }}
        >
          Clear All
        </button>
      </div>

      <div>
        {Object.values(users).map((user) => (
          <div
            key={user.id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>{user.name}</h4>
                <p style={{ margin: "0 0 5px 0", color: "#666" }}>
                  {user.email}
                </p>
                <p style={{ margin: "0", color: "#888", fontSize: "14px" }}>
                  Age: {user.age}
                </p>
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  padding: "4px 8px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {Object.keys(users).length === 0 && (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No users yet. Add some!
          </p>
        )}
      </div>
    </div>
  );
}
