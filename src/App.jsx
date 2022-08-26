import { useRef, useState } from "react";
import "./App.css";
import { v4 } from "uuid";

function App() {
  const [todos, setTodos] = useState(() =>
    localStorage.getItem("rttd_todos")
      ? JSON.parse(localStorage.getItem("rttd_todos"))
      : []
  );
  const [input, setInput] = useState("");

  const formInput = useRef();
  const editableContent = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let trimmedInput = input.trim();
    if (trimmedInput) {
      const newTodos = [
        ...todos,
        {
          id: v4(),
          todo: trimmedInput,
          completed: false,
          contentEditable: false,
        },
      ];
      setTodos(newTodos);
      setInput("");
      localStorage.setItem("rttd_todos", JSON.stringify(newTodos));
    }

    formInput.current.focus();
  };

  const completedToggle = (currentTodo) => {
    !currentTodo.contentEditable &&
      (() => {
        const newTodos = todos.map((todo) =>
          currentTodo.id === todo.id
            ? { ...currentTodo, completed: !currentTodo.completed }
            : todo
        );
        setTodos(newTodos);
        localStorage.setItem("rttd_todos", JSON.stringify(newTodos));
      })();
  };

  const deleteTodo = (currentTodo) => {
    const newTodos = todos.filter((todo) => todo.id !== currentTodo.id);
    setTodos(newTodos);
    localStorage.setItem("rttd_todos", JSON.stringify(newTodos));
  };

  const handleUpdate = (currentTodo) => {
    setTodos(
      todos.map((todo) =>
        currentTodo.id === todo.id
          ? { ...currentTodo, contentEditable: true }
          : todo
      )
    );
  };

  const editingTodo = (currentTodo, event) => {
    editableContent.current = todos.map((todo) =>
      currentTodo.id === todo.id
        ? { ...currentTodo, todo: event.target.textContent }
        : todo
    );
  };

  const handleSave = (currentTodo) => {
    // console.log(editableContent.current);
    // console.log(currentTodo);
    const newTodoValue = editableContent.current.find(
      (item) => item.id === currentTodo.id
    );
    const newTodos = todos.map((todo) =>
      currentTodo.id === todo.id
        ? { ...currentTodo, todo: newTodoValue.todo, contentEditable: false }
        : todo
    );
    setTodos(newTodos);
    localStorage.setItem("rttd_todos", JSON.stringify(newTodos));
  };

  const clearList = () => {
    setTodos([]);
    localStorage.removeItem("rttd_todos");
  };

  return (
    <div className="App">
      <h1>React Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={formInput}
          value={input}
          placeholder="insert new todo here..."
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <div>
          <button>Add Item</button>
          <button type="button" onClick={clearList}>
            Clear List
          </button>
        </div>
      </form>
      <ul className="todos">
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <li
              contentEditable={todo.contentEditable}
              suppressContentEditableWarning={true}
              onInput={(e) => {
                editingTodo(todo, e);
              }}
              style={{ textDecoration: todo.completed && "line-through" }}
              onClick={() => {
                completedToggle(todo);
              }}
            >
              {todo.todo}
            </li>
            {!todo.contentEditable ? (
              <button
                onClick={() => {
                  handleUpdate(todo);
                }}
              >
                update
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSave(todo);
                }}
              >
                save
              </button>
            )}

            <button
              onClick={() => {
                deleteTodo(todo);
              }}
            >
              x
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
