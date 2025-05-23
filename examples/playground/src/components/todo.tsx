import { useState } from "react";
import { useIndexedDbStore } from "use-idb-store";
import type { Todo } from "./types";

export function TodoSection() {
  const [todoText, setTodoText] = useState("");

  // Test the hook with todos
  const {
    values: todos,
    mutations: todoMutations,
    isLoading: todosLoading,
    error: todosError,
  } = useIndexedDbStore<Todo>("todos");

  const addTodo = () => {
    if (todoText.trim()) {
      const id = Date.now().toString();
      todoMutations.addValue(id, {
        id,
        text: todoText.trim(),
        completed: false,
        createdAt: Date.now(),
      });
      setTodoText("");
    }
  };

  const toggleTodo = (id: string) => {
    const todo = todos[id];
    if (todo) {
      todoMutations.updateValue(id, { completed: !todo.completed });
    }
  };

  const deleteTodo = (id: string) => {
    todoMutations.deleteValue(id);
  };

  const clearAllTodos = () => {
    Object.keys(todos).forEach((id) => todoMutations.deleteValue(id));
  };

  if (todosLoading) {
    return (
      <div>
        <h2>📝 Todos (Loading...)</h2>
        <div style={{ padding: "20px", color: "#666", fontStyle: "italic" }}>
          Loading todos...
        </div>
      </div>
    );
  }

  if (todosError) {
    return (
      <div>
        <h2>📝 Todos (Error)</h2>
        <div style={{ padding: "20px", color: "red" }}>
          Error loading todos: {todosError.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>📝 Todos ({Object.keys(todos).length})</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Enter a new todo..."
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <button onClick={addTodo} style={{ marginRight: "10px" }}>
          Add Todo
        </button>
        <button
          onClick={clearAllTodos}
          style={{ background: "#dc3545", color: "white" }}
        >
          Clear All
        </button>
      </div>

      <div>
        {Object.values(todos)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((todo) => (
            <div
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #ccc",
                marginBottom: "5px",
                textDecoration: todo.completed ? "line-through" : "none",
                opacity: todo.completed ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: "10px" }}
              />
              <span style={{ flex: 1 }}>{todo.text}</span>
              <small style={{ marginRight: "10px", color: "#666" }}>
                {new Date(todo.createdAt).toLocaleTimeString()}
              </small>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  background: "#dc3545",
                  color: "white",
                  padding: "4px 8px",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        {Object.keys(todos).length === 0 && (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No todos yet. Add some!
          </p>
        )}
      </div>
    </div>
  );
}
