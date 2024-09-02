// src/UserPage.js
import React, { useEffect, useState } from "react";
import "./Styles.css";
import { Paper, Button, TextField,Card,Box, Typography } from "@mui/material/";
import {pink, grey, green} from "@mui/material/colors";
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import VirtualizedList from "./list";
import MessageIcon from "@mui/icons-material/Message";
import SendIcon from '@mui/icons-material/Send';
import DiscreteBottomNavigation from "./Slider";
import { v4 as uuidv4 } from "uuid";
const label = { inputProps: { "aria-label": "Checkbox demo" } };



const UserPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
    const [detailsVisibility, setDetailsVisibility] = useState({});
    const [todoList, setTodo] = useState([]);
    const [comment, setComment] = useState([]);

    const [text, setText] = useState("");
    const [receiver, setReceiver] = useState("");

    const [newCategoryName, setNewCategoryName] = useState("");
    const [showTextField, setShowTextField] = useState(false);
    const [newTodoName,  setNewTodoName] = useState("");
    const [showTodoTextField, setShowTodoTextField] = useState(false);
    const [refreshCategories, setRefreshCategories] = useState(false);

    const toggleDetails = (todoId) => {
        setDetailsVisibility((prev) => ({
            ...prev,
            [todoId]: !prev[todoId],
        }));
    };



    useEffect(() => {
            fetch("http://localhost:8080/category/getcategories")
                .then((response) => response.json())
                .then((data) => {
                    setCategories(data);
                    console.log(data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

    }, [refreshCategories]);


    useEffect(() => {
        fetch("http://localhost:8080/todo/getall")
            .then((response) => response.json())
            .then((data) => {
                setTodo(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    }, []);


    useEffect(() => {
        fetch("http://localhost:8080/comment/getall")
            .then((response) => response.json())
            .then((data) => {
                setComment(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    }, []);
    const handleAddComment = (id) => {
        fetch(`http://localhost:8080/comment/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: localStorage.getItem("username"),
                message: text,
                receiver: receiver,
                todoId: id,
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                console.log("Success:", data);
                //window.location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const handleDeleteTodo = (todoId) => {
        fetch(`http://localhost:8080/todo/delete/${todoId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    setCategories((prevCategories) =>
                        prevCategories.map((category) => ({
                            ...category,
                            todos: category.todos.filter((todo) => todo.id !== todoId),
                        }))
                    );
                } else {
                    console.error("Failed to delete todo");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const confirmDeleteComment = (comment) => {
        const message =  "Do you want to delete this comment?";

        const confirmDelete = window.confirm(message);
        if (!confirmDelete) {
            return;
        }

        handleDeleteComment(comment.id);
    };

    const handleDeleteComment = (commentId) => {
        fetch(`http://localhost:8080/comment/delete/${commentId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    setCategories((prevCategories) =>
                        prevCategories.map((category) => ({
                            ...category,
                            todos: category.todos.map((todo) => ({
                                ...todo,
                                comments: todo.comments.filter(
                                    (comment) => comment.id !== commentId
                                ),
                            })),
                        }))
                    );
                } else {
                    console.error("Failed to delete comment");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const confirmDeleteTodo = (todo) => {
        const message = todo.completed
            ? "Do you want to delete this completed todo?"
            : "This todo is not completed. Do you still want to delete it?";

        const confirmDelete = window.confirm(message);
        if (!confirmDelete) {
            return;
        }

        handleDeleteTodo(todo.id);
    };

    const handleDeleteCategory = (categoryId) => {
        fetch(`http://localhost:8080/category/delete/${categoryId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    setCategories((prevCategories) =>
                        prevCategories.filter((category) => category.id !== categoryId)
                    );
                } else {
                    console.error("Failed to delete category");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleAddTodo = (id, newTodoName) => {
       // const newTodo = prompt("Enter the description for the new todo:");
        if (!newTodoName) {
            return;
        }

        fetch(`http://localhost:8080/todo/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description: newTodoName,
                categoryId: id,
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                console.log("Success:", data);
                fetch("http://localhost:8080/category/getcategories")
                    .then((response) => response.json())
                    .then((data) => {
                        setCategories(data);
                        console.log(data);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
                setRefreshCategories(true);
                console.log(refreshCategories);

            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleAddCategory = (newCategoryName) => {
        if (!newCategoryName) {
            return;
        }

        fetch(`http://localhost:8080/category/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newCategoryName,
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                console.log("Success:", data);
                fetch("http://localhost:8080/category/getcategories")
                    .then((response) => response.json())
                    .then((data) => {
                        setCategories(data);
                        console.log(data);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const confirmDeleteCategory = (category) => {
        const message = category.completed
            ? "Do you want to delete this completed category?"
            : "This category is not completed. Do you still want to delete it?";

        const confirmDelete = window.confirm(message);
        if (!confirmDelete) {
            return;
        }

        handleDeleteCategory(category.id);
    };

    const updateTodoCompletion = async (newValue, todoID) => {
        console.log("New value: ", newValue);
        fetch(`http://localhost:8080/todo/updatecomplete/${todoID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                str: newValue === 2,
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        fetch(`http://localhost:8080/todo/updatestart/${todoID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                str: newValue === 1,
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div className={"paper"} style={{ display: "flex" }}>
            <div style={{display:"flex" ,
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center"}}>
                <VirtualizedList categories={categories}
                                 onSelectCategory={setSelectedCategory}/> {}
                <div
                    style={{
                        display: "flex",

                    }}
                >
                    {showTextField ? (
                        <div>
                            <input
                                style={
                                    {
                                        padding: 10,
                                        borderRadius: 5,
                                        border: "1px solid #ccc",
                                        marginRight: 10,
                                        width: 200,
                                    }
                                }
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name"
                            />
                            <Button style={{marginRight: 10, backgroundColor: pink[50]}} onClick={() => { setShowTextField(false); handleAddCategory(newCategoryName); }}>Add</Button>
                        </div>
                    ) : (
                        <Button  startIcon={ <AddCircleOutlineSharpIcon style={{color: pink[800]}}/>} style={{marginRight: 10, backgroundColor: pink[50]}} onClick={() => setShowTextField(true)}>Add Category</Button>
                    )}

                </div>
            </div>
            <div style={{flex: 3, width: 400}}>
                <Paper className={"paper"} elevation={3} style={{padding: 20, margin: 20, width: "100%", minHeight: 600}}>

                    <h2 className="category-header"> ToDo List</h2>

                    {selectedCategory && (
                        <div style={{marginTop: 85}} key={selectedCategory.id}>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                                <h2 className="category-text">{selectedCategory.name}</h2>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <FormControlLabel
                                        sx={{backgroundColor: pink[50], borderRadius: 1,paddingInlineEnd:2}}
                                        control={
                                            <Checkbox
                                                {...label}
                                                checked={selectedCategory.completed}
                                                sx={{
                                                    width: 32,
                                                    height: 33,
                                                    fontSize: 15,
                                                    color: grey[800],
                                                    "&.Mui-checked": {
                                                        color: green[600],
                                                    },
                                                }}
                                            />
                                        }
                                        label="Completed"
                                    />
                                    {showTodoTextField ? (
                                        <div>
                                            <input
                                                style={
                                                    {
                                                        padding: 10,
                                                        borderRadius: 5,
                                                        border: "1px solid #ccc",
                                                        marginRight: 10,
                                                        width: 200,
                                                    }
                                                }
                                                type="text"
                                                value={newTodoName}
                                                onChange={(e) => setNewTodoName(e.target.value)}
                                                placeholder="Enter todo name"
                                            />
                                            <Button style={{marginRight: 10, backgroundColor: pink[50]}} onClick={() => { setShowTodoTextField(false); handleAddTodo(selectedCategory.id, newTodoName); }}>Add</Button>
                                        </div>
                                    ) : (
                                        <Button
                                            style={{
                                                marginRight: 10,
                                                backgroundColor: pink[50],
                                                height: 33,
                                                fontSize: 14,
                                            }}
                                            onClick={() => setShowTodoTextField(true)} //handleAddTodo(selectedCategory.id)
                                            startIcon={<AddCircleOutlineSharpIcon style={{color: pink[800]}}/>}
                                        >

                                            Add Todo
                                        </Button>
                                    )}


                                    <Button
                                        onClick={() => confirmDeleteCategory(selectedCategory)}
                                        style={{
                                            backgroundColor: pink[50],
                                            height: 33,
                                            fontSize: 14,
                                            maxWidth: 188,
                                        }}
                                        startIcon={ <DeleteOutlineIcon
                                            style={{color: pink[800]}}
                                        />}
                                    >

                                        Delete category
                                    </Button>
                                </div>
                            </div>
                            <ul>
                                {selectedCategory.todos.map((todo) => (
                                    <li key={todo.id + "" + selectedCategory.id}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <div
                                                key={uuidv4()}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    padding: 10,
                                                    margin: 5,
                                                    border: "1px solid #ccc",
                                                    borderRadius: 5,
                                                    backgroundColor: "#f9f9f9",
                                                }}
                                            >
                                                <span style={{flex: 10}}>{todo.description}</span>
                                                <div style={{marginRight: 30}}>
                                                    <DiscreteBottomNavigation
                                                        started={todo.started}
                                                        completed={todo.completed}
                                                        todoId={todo.id}
                                                        onSliderChange={updateTodoCompletion}
                                                    />
                                                </div>
                                            </div>
                                            <Button onClick={() => confirmDeleteTodo(todo)}>
                                                <DeleteOutlineIcon style={{color: grey[800], marginRight: 10}}/>
                                            </Button>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Button
                                                onClick={() => toggleDetails(todo.id)}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: grey[900],
                                                    width: "10%",
                                                    height: 25,
                                                    fontSize: 13,
                                                    marginRight: 10,
                                                }}
                                            >
                                                {detailsVisibility[todo.id] ? "Hide" : "Comments"}
                                            </Button>
                                        </div>

                                        {detailsVisibility[todo.id] && (
                                            <div style={{ marginTop: "16px" }}>
                                                {todo.comments.map((comment) => (
                                                    <li key={comment.id} style={{display: "flex"}}>
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                marginLeft:5,
                                                                borderRadius: 5,
                                                                width: { xs: "50%", sm: "max(400px, 80%)" },
                                                                height: "auto",
                                                                boxShadow: 10,
                                                                transition: "transform 0.3s ease-in-out",
                                                                "&:hover": {
                                                                    transform: "scale(1.03)",
                                                                    boxShadow: 20,
                                                                },
                                                                marginTop: 1,
                                                                padding: 2,
                                                                backgroundColor: "#00F4F437",
                                                            }}
                                                        >
                                                            <Box sx={{ textAlign: "left" }}>
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                    }}
                                                                >
                                                                    <MessageIcon />

                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        color="text.secondary"
                                                                        sx={{ marginLeft: 2 }}
                                                                    >
                                                                        From: {comment.sender}
                                                                    </Typography>

                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        color="text.secondary"
                                                                        sx={{ marginLeft: 2 }}
                                                                    >
                                                                        To: {comment.receiver}
                                                                    </Typography>
                                                                </div>
                                                                <Typography variant="body1" sx={{ mt: 2 }}>
                                                                    {comment.description}
                                                                </Typography>
                                                            </Box>

                                                        </Card>
                                                        <Button onClick={() => confirmDeleteComment(comment)}>
                                                            <DeleteOutlineIcon style={{color: "black", marginRight: 10}}/>
                                                        </Button>
                                                    </li>
                                                ))}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        marginTop: "10px",
                                                        marginBottom: "10px",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <TextField
                                                        id="outlined-basic-name"
                                                        variant="outlined"
                                                        type="text"
                                                        placeholder="Receiver"
                                                        onChange={(e) => setReceiver(e.target.value)}
                                                        style={{
                                                            width: "15%",
                                                            marginLeft: "5%",
                                                        }}
                                                    />

                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        type="text"
                                                        placeholder="Type your message here!"
                                                        onChange={(e) => setText(e.target.value)}
                                                        style={{
                                                            width: "60%",
                                                            marginRight: "2%",
                                                        }}
                                                    />
                                                    <Button
                                                        endIcon={<SendIcon />}
                                                        style={{
                                                            backgroundColor: green[50],
                                                            height: 35,
                                                            fontSize: 14,
                                                        }}
                                                        onClick={() => handleAddComment(todo.id)
                                                    }
                                                    >
                                                        Send
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </Paper>
            </div>
        </div>
    );
};

export default UserPage;