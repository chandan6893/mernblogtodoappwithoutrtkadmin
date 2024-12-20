import React, { useState } from "react";
import "../ToDoItems/ToDoItems.css";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const ToDoItems = (props) => {
  const { name, id, setItems } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4001/todo/api/deleteitems/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete the task");
      }

      const data = await response.json();
      console.log("Deleted item:", data); // Log the deleted item for debugging

      // Ensure 'data' has an _id property before filtering
      if (data && data._id) {
        setItems((items) => items.filter((item) => item._id !== data._id));
      } else {
        console.error("Deleted item does not have an _id:", data);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const updateTodo = async () => {
    try {
      const response = await fetch(
        `http://localhost:4001/todo/api/updateitems/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the task");
      }

      const updatedItem = await response.json();
      setItems((items) =>
        items.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="lists">
      <ListGroup>
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        ) : (
          <ListGroup.Item>{name}</ListGroup.Item>
        )}
      </ListGroup>
      {isEditing ? (
        <Button variant="success" onClick={updateTodo}>
          Save
        </Button>
      ) : (
        <Button variant="warning" onClick={() => setIsEditing(true)}>
          <FaEdit />
        </Button>
      )}
      <Button variant="danger" onClick={() => deleteTodo(id)}>
        <MdDeleteForever />
      </Button>
    </div>
  );
};
export default ToDoItems;
