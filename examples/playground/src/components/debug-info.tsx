import { useIndexedDbStore } from "use-idb-store";
import type { Todo, User } from "./types";

export function DebugInfo() {
  // Get data from both stores for debugging
  const {
    values: todos,
    isLoading: todosLoading,
    error: todosError,
  } = useIndexedDbStore<Todo>("todos");

  const {
    values: users,
    isLoading: usersLoading,
    error: usersError,
  } = useIndexedDbStore<User>("users");

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "10px 20px",

        background: "#1a1a1a",
        borderRadius: "5px",
      }}
    >
      <h3 style={{ margin: 0, color: "#fff" }}>Debug Info</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            background: "#2a2a2a",
            padding: "10px",
            borderRadius: "4px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: "12px", color: "#888" }}>Total Todos</div>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            {Object.keys(todos).length}
          </div>
        </div>
        <div
          style={{
            background: "#2a2a2a",
            padding: "10px",
            borderRadius: "4px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: "12px", color: "#888" }}>Total Users</div>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            {Object.keys(users).length}
          </div>
        </div>
        <div
          style={{
            background: "#2a2a2a",
            padding: "10px",
            borderRadius: "4px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: "12px", color: "#888" }}>Todos Loading</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: todosLoading ? "#ffd700" : "#4caf50",
            }}
          >
            {todosLoading ? "Yes" : "No"}
          </div>
        </div>
        <div
          style={{
            background: "#2a2a2a",
            padding: "10px",
            borderRadius: "4px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: "12px", color: "#888" }}>Users Loading</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: usersLoading ? "#ffd700" : "#4caf50",
            }}
          >
            {usersLoading ? "Yes" : "No"}
          </div>
        </div>
        <div
          style={{
            background: "#2a2a2a",
            padding: "10px",
            borderRadius: "4px",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: "12px", color: "#888" }}>Errors</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: todosError || usersError ? "#ff4444" : "#4caf50",
            }}
          >
            {todosError || usersError ? "Yes" : "No"}
          </div>
        </div>
      </div>
      {(todosError || usersError) && (
        <div style={{ color: "red", fontSize: "14px" }}>
          {todosError && <p>Todos Error: {todosError.message}</p>}
          {usersError && <p>Users Error: {usersError.message}</p>}
        </div>
      )}

      <hr style={{ margin: "20px 0", borderColor: "#2a2a2a" }} />

      <details>
        <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
          Raw Data
        </summary>
        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
          <pre
            style={{
              background: "#2a2a2a",
              padding: "10px",
              overflow: "auto",
              fontSize: "12px",
              borderRadius: "5px",
              width: "50%",
            }}
          >
            <code>todos : {JSON.stringify(todos, null, 2)}</code>
          </pre>
          <pre
            style={{
              background: "#2a2a2a",
              padding: "10px",
              overflow: "auto",
              fontSize: "12px",
              borderRadius: "5px",
              width: "50%",
            }}
          >
            <code>users : {JSON.stringify(users, null, 2)}</code>
          </pre>
        </div>
      </details>
    </div>
  );
}
