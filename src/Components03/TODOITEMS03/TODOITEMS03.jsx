

// New Comp for pagination
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllData, getItemToEdit } from "../../redux/slice/blogSlice/blogSlice"
import { useNavigate } from "react-router-dom";
import "../TODOITEMS03/TODOITEMS03.css";
import Pagination from '@mui/material/Pagination';

const TODOITEMS03 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const [allData, setAllData] = useState([]);
  


 
  const { data, isLoading, isError, totalPages, currentPage } = useSelector(
    (state) => state.blogs
  );

  useEffect(() => {
    dispatch(getAllData(currentPage)); // Dispatch Redux action
  }, [dispatch, currentPage]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4001/todo/api/deleteitems/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete the task");
      }

      const deletedData = await response.json();
      console.log("Deleted item:", deletedData);

      if (deletedData && deletedData._id) {
        setAllData((datas) =>
          datas.filter((item) => item._id !== deletedData._id)
        );
      } else {
        console.error("Deleted item does not have an _id:", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (productEditId) => {
    // navigate("/", { state: { productEditId: productEditId } });
    // dispatch(productEditId)
    dispatch(getItemToEdit(productEditId))
    navigate("/");
  };

 



  // const handlePageChange = (event, value) => {
  //   dispatch(getAllData(value)); // Dispatch action to fetch data for the selected page
  // };

  // Fetch initial data for the first page
  useEffect(() => {
    dispatch(getAllData(currentPage));
  }, [dispatch, currentPage]); // Dependencies include dispatch and currentPage

  // Handle page change
  const handlePageChange = (event, value) => {
    // Update Redux state with the new page and fetch data
    dispatch(getAllData(value));
  };

  const handleViewBlog = (blog, blogHadingImage, blogWriterImageimageUrl) => {
    navigate("/blog-view", { state: { blog: blog, blogHadingImage, blogWriterImageimageUrl } })
  }
  // useEffect(() => {
  //   getAllData(currentPage);  // Fetch data for the initial page
  // }, [currentPage]);

  return (
    <div className="BlogsContainer">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {isError}</p>}
      <button onClick={() => navigate("/")} className="AddBlog">Add Blog</button>
      <div className="Blogs">


        {data.map((ele, ind) => {
          const imageUrl = `http://localhost:4001/public/adminuploads/${ele.blogHeadingImage}`;
          const blogWriterImageimageUrl = `http://localhost:4001/public/adminuploads/${ele.blogWriterImage}`;
          return (
            <div
              className="BlogCard"
              key={ind}
            // onClick={() => handleClick(blog, ind)}
            >
              <img
                style={{ backgroundColor: `${ele.blogImageBackgroundColor}` }}
                className="BlogCardImage"
                src={imageUrl}
                alt="Blogimage"
              />
              {/* <h1 className="BlogCardMainHading">{ele.blogsMainHeading}</h1> */}
              <h1 className="BlogCardMainHading">
                {ele.blogsMainHeading
                  ? ele.blogsMainHeading.split(" ").length <= 5
                    ? ele.blogsMainHeading
                    : ele.blogsMainHeading.split(" ").slice(0, 5).join(" ") + "..."
                  : "No Heading"} {/* Fallback for undefined headings */}
              </h1>

              <p className="BlogCardDescriptons">{ele.blogMainDescription}</p>
              <div className="BlogCard-Writer-Date-Wrapper">
                <div className="BlogCard-Writer-Date-Wrapper-Image-Writer">
                  <img
                    src={blogWriterImageimageUrl}
                    alt="writer"
                  />
                  <span>{ele.blogWriterName}</span>
                </div>

                <span>{ele.blogsPostDate}</span>
              </div>
              {/* <div dangerouslySetInnerHTML={{ __html: ele.reactQuillValue }} style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}></div> */}
              <div className="BlogCardBtnContainer">
                <button onClick={() => handleViewBlog(ele, imageUrl, blogWriterImageimageUrl)}>View Blog</button>
                <button onClick={() => handleEdit(ele._id)}>EDIT</button>
                <button onClick={() => handleDelete(ele._id)}>DELETE</button>
              </div>
            </div>
          );
        })}

      </div>

        <Pagination
        count={totalPages}
        page={currentPage} // Ensure currentPage is being passed as the current page number
        onChange={handlePageChange} // Dispatch the page change event to get new data
        color="primary"
        size="large"
      />
    </div>
  );
};

export default TODOITEMS03;
