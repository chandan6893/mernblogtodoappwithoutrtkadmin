// import { useEffect, useState } from "react";
// import "../ToDO/Todo.css";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
// import { MdAddCircle } from "react-icons/md";
// import ToDoItems from "../ToDoItems/ToDoItems";

// const API_BASE = "http://localhost:4001/todo/api/gettodoitems";

// const Todo = () => {
//   // State for storing todo items
//   const [items, setItems] = useState([]);

//   // State for user input
//   const [input, setInput] = useState("");

//   // Fetch todos on component mount
//   useEffect(() => {
//     GetTodos();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     setInput(e.target.value);
//   };

//   // Fetch todos from API
//   const GetTodos = () => {
//     fetch(API_BASE)
//       .then((res) => res.json())
//       .then((data) => setItems(data))
//       .catch((err) => console.error("Error fetching todos:", err));
//   };

//   // Add a new item
//   const addItem = async () => {
//     try {
//       const response = await fetch("http://localhost:4001/todo/api/additems", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: input }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       await GetTodos(); // Re-fetch items after adding
//       setInput(""); // Clear input field
//     } catch (err) {
//       console.error("Error adding item:", err);
//     }
//   };

//   return (
//     <div className="Todo">
//       <h1>ToDo Blog App</h1>

//       <InputGroup className="mb-1 inputContainer">
//         <Form.Control
//           placeholder="Add Items"
//           aria-label="Add Items"
//           aria-describedby="basic-addon2"
//           value={input}
//           onChange={handleChange}
//         />
//         <Button variant="primary" onClick={addItem}>
//           <MdAddCircle />
//         </Button>
//       </InputGroup>

//       {items.map((item) => {
//         const { _id, name } = item;
//         return <ToDoItems key={_id} name={name} id={_id} setItems={setItems} input={input} setInput={setInput}/>;
//       })}
//     </div>
//   );
// };

// export default Todo;


// item already added message

import { useEffect, useState } from "react";
import "../ToDO/Todo.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { MdAddCircle } from "react-icons/md";
import ToDoItems from "../ToDoItems/ToDoItems";

const API_BASE = "http://localhost:4001/todo/api/gettodoitems";

const Todo = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const handleChange = (e) => {
    setInput(e.target.value);
    setErrorMessage(""); // Clear error message on input change
  };

  const GetTodos = () => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching todos:", err));
  };

  const addItem = async () => {
    // console.log("ITEMS",items[0].name)
    if (items.some(item => item.name.toLowerCase() === input.toLowerCase())) {
      setErrorMessage("This item is already added");
      return;
    }

    try {
      const response = await fetch("http://localhost:4001/todo/api/additems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await GetTodos(); // Re-fetch items after adding
      setInput(""); // Clear input field
      setErrorMessage(""); // Clear error message on successful addition
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  return (
    <div className="Todo">
      <h1>ToDo Blog App</h1>

      <InputGroup className="mb-1 inputContainer">
        <Form.Control
          placeholder="Add Items"
          aria-label="Add Items"
          aria-describedby="basic-addon2"
          value={input}
          onChange={handleChange}
        />
        <Button variant="primary" onClick={addItem}>
          <MdAddCircle />
        </Button>
      </InputGroup>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {items.map((item) => {
        const { _id, name } = item;
        return <ToDoItems key={_id} name={name} id={_id} setItems={setItems} input={input} setInput={setInput} />;
      })}
    </div>
  );
};

export default Todo;
