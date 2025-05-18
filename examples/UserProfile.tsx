import React, { useState } from "react";
import { useIndexedDbStore } from "use-idb-store";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
  lastUpdated: number;
}

// Example of using custom schema
export function UserProfileManager() {
  const { values, mutations, isLoading, error } = useIndexedDbStore<User>(
    "users",
    {
      schema: { keyPath: "id" },
    }
  );

  const [userData, setUserData] = useState<Partial<User>>({
    name: "",
    email: "",
    bio: "",
    preferences: {
      theme: "light",
      notifications: true,
    },
  });

  const users = Object.values(values);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle preference changes
  const handlePreferenceChange = (
    field: keyof User["preferences"],
    value: any
  ) => {
    setUserData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  // Create or update user
  const saveUser = () => {
    if (!userData.name || !userData.email) return;

    const id = selectedUserId || `user_${Date.now()}`;

    const user: User = {
      id,
      name: userData.name,
      email: userData.email,
      bio: userData.bio || "",
      preferences: userData.preferences || {
        theme: "light",
        notifications: true,
      },
      lastUpdated: Date.now(),
    };

    mutations.addOrUpdateValue(id, user);

    // Reset form after save
    setUserData({
      name: "",
      email: "",
      bio: "",
      preferences: {
        theme: "light",
        notifications: true,
      },
    });
    setSelectedUserId(null);
  };

  // Delete user
  const deleteUser = (id: string) => {
    mutations.deleteValue(id);
    if (selectedUserId === id) {
      setSelectedUserId(null);
      setUserData({
        name: "",
        email: "",
        bio: "",
        preferences: {
          theme: "light",
          notifications: true,
        },
      });
    }
  };

  // Load user for editing
  const editUser = (id: string) => {
    const user = values[id];
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        preferences: { ...user.preferences },
      });
      setSelectedUserId(id);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="user-profile-manager">
      <h1>{selectedUserId ? "Edit User Profile" : "Create User Profile"}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveUser();
        }}
      >
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Theme:</label>
          <select
            value={userData.preferences?.theme}
            onChange={(e) => handlePreferenceChange("theme", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={userData.preferences?.notifications}
              onChange={(e) =>
                handlePreferenceChange("notifications", e.target.checked)
              }
            />
            Enable notifications
          </label>
        </div>

        <div className="form-buttons">
          <button type="submit">
            {selectedUserId ? "Update User" : "Create User"}
          </button>
          {selectedUserId && (
            <button
              type="button"
              onClick={() => {
                setSelectedUserId(null);
                setUserData({
                  name: "",
                  email: "",
                  bio: "",
                  preferences: { theme: "light", notifications: true },
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Users ({users.length})</h2>
      {users.length === 0 ? (
        <p className="empty-state">No users yet. Create one to get started.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id}>
              <div className="user-info">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <span>Theme: {user.preferences.theme}</span>
              </div>
              <div className="user-actions">
                <button onClick={() => editUser(user.id)}>Edit</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
