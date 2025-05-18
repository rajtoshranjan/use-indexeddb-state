# use-idb-store

A React hook that provides persistent state management using IndexedDB, offering offline-friendly and large-scale data storage capabilities.

[![npm version](https://img.shields.io/npm/v/use-idb-store.svg)](https://www.npmjs.com/package/use-idb-store)
[![license](https://img.shields.io/npm/l/use-idb-store.svg)](https://github.com/rajtoshranjan/use-idb-store/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Features

- 💾 **Persistent State:** Automatically syncs React state with IndexedDB
- 🔌 **Offline Support:** Data persists even when offline
- 📦 **Large Data Sets:** Handles much larger data than localStorage
- 🔄 **CRUD Operations:** Full API for creating, reading, updating, and deleting data
- 🛠️ **TypeScript Ready:** Full type safety with generics support
- 🏗️ **Robust Error Handling:** Gracefully handles edge cases
- 🧩 **Zero Dependencies:** Lightweight with no external dependencies

## Installation

```bash
npm install use-idb-store
# or
yarn add use-idb-store
# or
pnpm add use-idb-store
```

## Quick Start

```jsx
import { useIndexedDbStore } from "use-idb-store";

function TodoApp() {
  // Initialize the store with a name
  const { values, mutations, isLoading, error } = useIndexedDbStore("todos");

  // Access your persisted data
  const todos = Object.values(values);

  // Add a new item
  const addTodo = (text) => {
    const id = Date.now().toString();
    mutations.addValue(id, { id, text, completed: false });
  };

  // Toggle a todo's completed status
  const toggleTodo = (id) => {
    const todo = values[id];
    mutations.updateValue(id, { completed: !todo.completed });
  };

  // Delete a todo
  const removeTodo = (id) => {
    mutations.deleteValue(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => addTodo("New Todo")}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## API Reference

### `useIndexedDbStore<T>(name, options)`

The main hook for creating and interacting with an IndexedDB store.

#### Parameters

- `name` (string): A unique name for the store. This will be used as the IndexedDB object store name.
- `options` (object, optional):
  - `schema` (IDBObjectStoreParameters, optional): Schema configuration for the IndexedDB store.

#### Returns

An object with the following properties:

- `values` (Record<string, T>): An object containing all key-value pairs in the store.
- `mutations`: Object containing methods to mutate the store:
  - `getValue(id)`: Get a single value by key.
  - `addValue(id, value)`: Add a new value to the store.
  - `updateValue(id, partialValue)`: Update part of an existing value.
  - `deleteValue(id)`: Delete a value by key.
  - `addOrUpdateValue(id, value)`: Add a value or update it if it already exists.
- `isLoading` (boolean): Whether the store is currently being loaded.
- `error` (Error | null): Any error that occurred during store operations.

## Advanced Usage

### Custom Schema

You can configure your IndexedDB store schema:

```jsx
const { values, mutations } = useIndexedDbStore("users", {
  schema: { keyPath: "userId", autoIncrement: true },
});
```

### Type Safety

TypeScript users can specify the data type:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

const { values, mutations } = useIndexedDbStore<User>("users");

// Type-safe operations
mutations.addValue("user1", {
  id: "user1",
  name: "John Doe",
  email: "john@example.com",
  age: 30,
});
```

### Error Handling

The hook provides built-in error handling:

```jsx
const { values, mutations, error, isLoading } = useIndexedDbStore("data");

// Display loading state and errors in your UI
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

// You can also handle errors from individual operations
const handleAddItem = async () => {
  try {
    await mutations.addValue("key1", { name: "New Item" });
  } catch (err) {
    console.error("Failed to add item:", err);
  }
};
```

## How It Works

`use-idb-store` uses a layered architecture:

1. **Hook Layer** (`useIndexedDbStore`): React hook that provides a state interface
2. **Store Layer** (`Store`): Manages data operations on a specific IndexedDB object store
3. **Database Layer** (`DB`): Handles IndexedDB connections and versioning
4. **Utilities** (`helpers`): Provides utility functions for working with IndexedDB promises

The library automatically handles common IndexedDB challenges:

- Database versioning and schema upgrades
- Async request management with Promises
- Error recovery and connection management

## Browser Compatibility

This library works in all modern browsers that support IndexedDB:

- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+
- Opera 15+

## License

MIT © [Rajtosh Ranjan](https://github.com/rajtoshranjan)
