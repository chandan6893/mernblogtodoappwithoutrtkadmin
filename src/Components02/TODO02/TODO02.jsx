import React, { useState, useEffect } from "react";
import "./TODO02.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TODOITEMS02 from "../TODOITEMS02/TODOITEMS02";

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': ['red','green','royalblue',"#36aa55"] }, { 'background': ['#36aa55'] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];


  const modules= {
    toolbar: toolbarOptions
  }

const TODO02 = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  // console.log("data",data);
  const [show, setShow] = useState(false);

  const handleAdd = async () => {
    console.log("handle ADD")
    if (name.trim() === "") {
      return;
    }
    try {
      const res = await fetch("http://localhost:4001/todo/api/additems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Something went wrong!");
        return;
      }

      // Optionally, clear the input field after adding
      setName("");
      getData(); // Refresh the data after adding
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const getData = () => {
    fetch("http://localhost:4001/todo/api/gettodoitems")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error fetching todos:", err));
  };

  const handleDelete = async (id) => {
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

      // M1
      // data.splice(id,1);
      // setData([...data]);

      // M2
      const deletedData = await response.json();
      console.log("Deleted item:", deletedData); // Log the deleted item for debugging

      if (deletedData && deletedData._id) {
        // const updatedData =  data.filter((item) => item._id !== deletedData._id);
        // setData(updatedData);
        setData((datas) =>
          datas.filter((item) => item._id !== deletedData._id)
        );
      } else {
        console.error("Deleted item does not have an _id:", data);
      }

      //  M3
      // getData();  // Refresh the data after deletion
    } catch (error) {
      console.log(error);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await fetch(`http://localhost:4001/todo/api/deleteitems/${id}`, {
  //       method: "DELETE",
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to delete the task");
  //     }

  //     getData(); // Refresh the data after deletion
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //   }
  // };

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item._id === id);
    console.log("itemToEdit", itemToEdit);
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCurrentId(id);
      setShow(true);
    }
  };

  const handleUpdate = async () => {
    if (name.trim() === "") {
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:4001/todo/api/updateitems/${currentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Something went wrong!");
        return;
      }
      setName("");
      setCurrentId(null);
      setShow(false);
      getData(); // Refresh the data after updating
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="TODO02">
      <div className="TODO02Wrapper">
        {/* <InputGroup className="mb-3 IGroup"> */}
        {/* <Form.Control
          placeholder="enter name"
          aria-label="name"
          aria-describedby="basic-addon2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /> */}
        <ReactQuill theme="snow" modules={modules} value={name} onChange={setName} className="ReactQuill"/>

        {show ? (
          <Button variant="warning" className="TODO02BTN" onClick={handleUpdate}>
            Update
          </Button>
        ) : (
          <Button variant="secondary" className="TODO02BTN"  onClick={handleAdd}>
            ADD
          </Button>
        )}
        {/* </InputGroup> */}
      </div>
      <div>
        {data.map((ele, index) => {
          return (
            <div key={index} className="ToDO02Wrapper">
              <p dangerouslySetInnerHTML={{ __html: ele.name }}></p>
              <Button variant="success" onClick={() => handleEdit(ele._id)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(ele._id)}>
                Delete
              </Button>
            </div>
          );
        })}
      </div>

      <TODOITEMS02 />
    </div>
  );
};
export default TODO02;
