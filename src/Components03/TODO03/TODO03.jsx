import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TODO03 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const productEditId = location.state?.productEditId || null;


  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': ['red', 'green', 'royalblue', "#36aa55"] }, { 'background': ['#36aa55'] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];



  const modules = {
    toolbar: toolbarOptions
  }
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBlogWriterImage, setSelectedBlogWriterImage] = useState(null);
  const [blogImage, setBlogImage] = useState(null);
  const [blogWriterImage, setBlogWriterImage] = useState(null);

  const [inputValue, setInputValue] = useState({
    blogsMainHeading: "",
    blogMainDescription: "",
    blogWriterName: "",
    blogWriterIntro: "",
    blogWriterLinkdeinLink: "",
    blogsPostDate: "",
    blogImageBackgroundColor: "",
    reactQuillValue: "",
  });

  const [EditProduct, setEditProduct] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("E.TARGET", e.targe.name);
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handleADD
  const handleADD = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    // Create FormData to send the data to the server
    const formData = new FormData();
    formData.append("blogsMainHeading", inputValue.blogsMainHeading);
    formData.append("blogMainDescription", inputValue.blogMainDescription);
    formData.append("blogWriterName", inputValue.blogWriterName);
    formData.append("blogWriterIntro", inputValue.blogWriterIntro);
    formData.append("blogWriterLinkdeinLink", inputValue.blogWriterLinkdeinLink);
    formData.append("blogsPostDate", inputValue.blogsPostDate);
    formData.append("blogImageBackgroundColor", inputValue.blogImageBackgroundColor);
    formData.append("blogHeadingImage", selectedImage);
    formData.append("blogWriterImage", selectedBlogWriterImage);
    formData.append("reactQuillValue", inputValue.reactQuillValue);

    try {
      const res = await fetch("http://localhost:4001/todo/api/additems", {
        method: "POST",
        body: formData, // No need for Content-Type header when using FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Something went wrong!");
        return;
      }

      alert("Item added successfully!");
      // Reset input fields and image after successful add
      setInputValue({
        blogsMainHeading: "",
        blogMainDescription: "",
        blogWriterName: "",
        blogWriterIntro: "",
        blogWriterLinkdeinLink: "",
        blogImageBackgroundColor: "",
        blogsPostDate: "",
        reactQuillValue: "",
      });
      setSelectedImage(null);
      setBlogImage(null);

      setSelectedBlogWriterImage(null);
      setBlogWriterImage(null);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again later.");
    }
    navigate("/items")
  };

  const handleUpdate = async () => {
    // if (name.trim() === "") {
    //   return;
    // }

    const formData = new FormData();
    formData.append("blogsMainHeading", inputValue.blogsMainHeading);
    formData.append("blogMainDescription", inputValue.blogMainDescription);
    formData.append("blogWriterName", inputValue.blogWriterName);
    formData.append("blogWriterIntro", inputValue.blogWriterIntro);
    formData.append("blogWriterLinkdeinLink", inputValue.blogWriterLinkdeinLink);
    formData.append("blogsPostDate", inputValue.blogsPostDate);
    formData.append("blogImageBackgroundColor", inputValue.blogImageBackgroundColor);
    formData.append("blogHeadingImage", selectedImage);
    formData.append("blogWriterImage", selectedBlogWriterImage);
    formData.append("reactQuillValue", inputValue.reactQuillValue);

    try {
      const res = await fetch(
        `http://localhost:4001/todo/api/updateitems/${productEditId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Something went wrong!");
        return;
      }
      alert("Item updated successfully!");

      setInputValue({
        blogsMainHeading: "",
        blogMainDescription: "",
        blogWriterName: "",
        blogWriterIntro: "",
        blogWriterLinkdeinLink: "",
        blogImageBackgroundColor: "",
        blogsPostDate: "",
        reactQuillValue: "",
      });

      setSelectedImage(null);
      setBlogImage(null);

      setSelectedBlogWriterImage(null);
      setBlogWriterImage(null);
      // navigate("/items");
      navigate("/items", { state: { productEditId: null } });

      // getData();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // getItemToEdit
  const getItemToEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4001/todo/api/editItem/${productEditId}`
      );
      const data = await response.json();
      console.log("responseData", data);
      setEditProduct(data);
      console.log("response", response);
    } catch (error) {
      console.log("Error fetching product data", error);
    }
  };

  const handleblogMainImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBlogImage(URL.createObjectURL(file));  // Local URL for preview
      setSelectedImage(file);  // Store the file itself
    }
  };

  const handleblogWriterImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBlogWriterImage(URL.createObjectURL(file));  // Local URL for preview
      setSelectedBlogWriterImage(file);  // Store the file itself
    }
  }

  useEffect(() => {
    if (productEditId) {
      getItemToEdit();
    }
  }, [productEditId]);

  useEffect(() => {
    if (EditProduct && productEditId) {
      setInputValue((prevData) => ({
        ...prevData,
        blogsMainHeading:
          EditProduct.blogsMainHeading || prevData.blogsMainHeading,
        blogMainDescription: EditProduct.blogMainDescription || prevData.blogMainDescription,
        blogWriterName: EditProduct.blogWriterName || prevData.blogWriterName,
        blogWriterIntro:
          EditProduct.blogWriterIntro || prevData.blogWriterIntro,
        blogWriterLinkdeinLink:
          EditProduct.blogWriterLinkdeinLink || prevData.blogWriterLinkdeinLink,
        blogImageBackgroundColor: EditProduct.blogImageBackgroundColor || prevData.blogImageBackgroundColor,
        blogsPostDate: EditProduct.blogsPostDate || prevData.blogsPostDate,
        reactQuillValue: EditProduct.reactQuillValue || prevData.reactQuillValue,
      }));
      setSelectedImage(EditProduct.blogHeadingImage)
      setSelectedBlogWriterImage(EditProduct.blogWriterImage)
    }
  }, [productEditId, EditProduct]);

  return (
    <div className="TODO03">
      <div className="TODO03Wrapper">
        <div className="TODO03WrapperTop">
          <div className="TODO03_InputWrapper">
            <input
              type="text"
              name="blogsMainHeading"
              value={inputValue.blogsMainHeading}
              placeholder="Blog Main Heading"
              onChange={handleChange}
            />
          </div>

          <div className="TODO03_InputWrapper">
            <input
              type="text"
              name="blogMainDescription"
              value={inputValue.blogMainDescription}
              placeholder="Blog Main Description"
              onChange={handleChange}
            />
          </div>

          <div className="TODO03_InputWrapper">
            <input
              type="text"
              name="blogWriterName"
              value={inputValue.blogWriterName}
              placeholder="Blog Writer Name"
              onChange={handleChange}
            />
          </div>

          <div className="TODO03_InputWrapper">
            <input
              type="text"
              name="blogWriterIntro"
              value={inputValue.blogWriterIntro}
              placeholder="Blog Writer Intro"
              onChange={handleChange}
            />
          </div>

          <div className="TODO03_InputWrapper">
            <input
              type="text"
              name="blogWriterLinkdeinLink"
              value={inputValue.blogWriterLinkdeinLink}
              placeholder="Blog Writer Linkedin Link"
              onChange={handleChange}
            />
          </div>
          <div className="TODO03_InputWrapper">
            <input
              type="date"
              name="blogsPostDate"
              value={inputValue.blogsPostDate}
              placeholder="Date"
              onChange={handleChange}
            />
          </div>
          <div className="TODO03_InputWrapper">
            <input
              type="text"
              name="blogImageBackgroundColor"
              value={inputValue.blogImageBackgroundColor}
              placeholder="Blog Image BackgroundColor "
              onChange={handleChange}
            />
          </div>

          <div className="TODO03_InputWrapper">
            <input
              onChange={handleblogMainImage}
              type="file"
              name="blogMainImage"
            />
          </div>

          <div className="TODO03_InputWrapper">
            <input
              onChange={handleblogWriterImage}
              type="file"
              name="blogWriterImage"
            />
          </div>
        </div>

        <div className="TODO03WrapperBottom">
          {/* <ReactQuill theme="snow" modules={modules} value={inputValue.reactQuillValue} onChange={handleChange} className="ReactQuill" /> */}
          <ReactQuill
            theme="snow"
            modules={modules}
            value={inputValue.reactQuillValue}
            onChange={(value) => setInputValue({ ...inputValue, reactQuillValue: value })}
          />

        </div>
      </div>

      <div className="TODO03ADD_UPDATE">
        {productEditId ? (
          <button onClick={handleUpdate}>UPDATE</button>
        ) : (
          <button onClick={handleADD}>ADD</button>
        )}
        <button onClick={() => navigate("/items")}>TODOITEMS03</button>



      </div>
      {blogImage && <img src={blogImage} alt="Selected" width="100px" height="100" />}
      {blogWriterImage && <img src={blogWriterImage} alt="Writer" width="100px" height="100px" style={{ maxWidth: "300px" }} />}
    </div>
  );
};

export default TODO03;
