import React, { useState, useEffect } from "react";

const Lista = () => {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const username = "GeFernando"; 

    useEffect(() => {
        // GET
        fetch(`https://playground.4geeks.com/todo/users/${username}`)
            .then(resp => resp.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    console.error("Error fetching data:", data);
                }
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (items.length >= 0) {
            syncTasksWithServer(items);
        }
    }, [items]);

    const syncTasksWithServer = (todos) => {
        todos.forEach(todo => {
            // PUT
            fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
                method: "PUT",
                body: JSON.stringify(todo),
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
            .then(data => console.log(data))
            .catch(error => console.log(error));
        });
    };

    const createUser = () => {
        // POST
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
        .then(data => console.log(data))
        .catch(error => console.log(error));
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            const newTodo = { label: inputValue, done: false };
            setItems([...items, newTodo]);
            setInputValue("");
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        }
    };

    const handleDelete = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleDeleteAll = () => {
        const deletePromises = items.map(item => {
            const todoId = item.id; 
            return fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
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
            });
        });

        Promise.all(deletePromises)
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
                            onClick={() => handleDelete(index)}
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
        </div>
    );
};

export default Lista;






