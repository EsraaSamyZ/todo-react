import { useState, useEffect, useCallback } from "react";
import { server } from "../Config/axios.config";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const fetchTodos = () => {
    server.get("/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDelete = (id) => {
    server.delete(`/todos/${id}`)
      .then((response) => {
        if (response.status === 200) {
          fetchTodos();
        }
      })
      .catch(error => console.error(error));
  };

  const handleDone = (id, isCompleted) => {
    server.patch(`/todos/${id}`, { isCompleted: !isCompleted })
      .then((response) => {
        if (response.status === 200) {
          fetchTodos(); 
        }
      })
      .catch(error => console.error(error));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (taskName.trim() === "") {
      return;
    }

    server.post("/todos", { taskName, isCompleted: false })
      .then((response) => {
        if (response.status === 201) {
          fetchTodos();
          setTaskName("");
        }
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchTodos(); 
  }, []);

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedSearchHandler = useCallback(
    debounce((nextValue) => setSearchTerm(nextValue), 500),
    []
  );
  const handleSearch = (e) => {
    debouncedSearchHandler(e.target.value);
  };

  const filteredTodos = todos.filter(todo =>
    todo.taskName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="todolist">
      <div className="search">
        <input
          type="text"
          placeholder="Search ex: todo 1"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          value={taskName}
          onChange={handleChange}
          placeholder="Add a task..."
        />
        <button type="submit" className="addtask-btn">
          Add Task
        </button>
      </form>
      <div className="lists">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`list ${todo.isCompleted ? "completed" : ""}`}>
              <p>{todo.taskName}</p>
              <div className="span-btns">
                {!todo.isCompleted && (
                  <span onClick={() => handleDone(todo.id, todo.isCompleted)} title="Mark as completed">
                    ✓
                  </span>
                )}
                <span className="delete-btn" onClick={() => handleDelete(todo.id)} title="Delete task">
                  x
                </span>
              </div>
            </div>
          ))
        ) : (
          <h1>No Records</h1>
        )}
      </div>
    </div>
  );
};

export default Todolist;
