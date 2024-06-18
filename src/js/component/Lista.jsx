import React, { useState, useEffect } from "react";

const Lista = () => {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const username = "GeFernando";

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`)
            .then(resp => resp.json())
            .then(data => {
                if (data && data.todos) {
                    setItems(data.todos);
                } else {
                    console.error("Error fetching data:", data);
                }
            })
            .catch(error => console.log(error));
    };

    const fetchCreateTask = (newTodo) => {
        fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTodo)
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json();
        })
        .then((createdTask) => {
            setItems(prevItems => [...prevItems, createdTask]);
        })
        .catch(error => console.log(error));
    };

    const syncTasksWithServer = (todos) => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todos)
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json();
        })
        .then(data => console.log("Tasks synchronized with server:", data))
        .catch(error => console.log(error));
    };

    const createUser = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json();
        })
        .then(data => {
            console.log(data);
            fetchTasks();
        })
        .catch(error => console.log(error));
    };

    const deleteUser = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.json();
        })
        .then(() => {
            setItems([]);
        })
        .catch(error => console.log(error));
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const newTodo = { label: inputValue, done: false };
            fetchCreateTask(newTodo);
            setInputValue("");
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        }
    };

    const handleDeleteTask = (taskId, index) => {
        console.log(`Attempting to delete task with ID: ${taskId}`); 
        fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error("Network response was not ok");
            }
            return resp.text(); 
        })
        .then(responseText => {
            if (responseText) {
                console.log(`Response from server: ${responseText}`); 
                const responseData = JSON.parse(responseText);
                console.log(responseData);
            }
            console.log(`Successfully deleted task with ID: ${taskId}`); 
            setItems(prevItems => prevItems.filter((_, i) => i !== index));
        })
        .catch(error => console.log(error));
    };

    const handleDeleteAll = () => {
        Promise.all(
            items.map(item => 
                fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(resp => {
                    if (!resp.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return resp.text();
                }).catch(error => {
                    console.error(`Error deleting task with ID ${item.id}:`, error);
                })
            )
        )
        .then(() => {
            setItems([]);
        })
        .catch(error => console.log(error));
    };

    return (
        <div className="container">
            {showSuccessMessage && (
                <div className="alert alert-success" role="alert">
                    <p>Tu tarea se ha guardado con éxito.</p>
                </div>
            )}
            <ul className="list-group">
                <h1>todos</h1>
                <li className="list-group-item">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="What needs to be done?"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                </li>
                {items.length === 0 && (
                    <div className={`list-group-item alert alert-warning ${items.length === 0 ? 'red-text' : ''}`}>
                        La lista está vacía.
                    </div>
                )}
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {item.label}
                        <button
                            className="btn btn-sm"
                            onClick={() => handleDeleteTask(item.id, index)}
                        >
                            {hoveredIndex === index ? "x" : ""}
                        </button>
                    </li>
                ))}
                {items.length > 0 && (
                    <li className="list-group-item">
                        There {items.length === 1 ? 'is' : 'are'} {items.length} {items.length === 1 ? 'item' : 'items'} in the list.
                    </li>
                )}
            </ul>
            <button className="btn-f" onClick={handleDeleteAll}>
                Delete All Tasks
            </button>
            <button className="btn-g" onClick={createUser}>
                Create User
            </button>
            <button className="btn-h" onClick={deleteUser}>
                Delete User
            </button>
        </div>
    );
};

export default Lista;





