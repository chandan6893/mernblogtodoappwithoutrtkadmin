// import React, { useEffect, useState } from "react";
// import  { useNavigate } from "react-router-dom";
// import "../TODOITEMS03/TODOITEMS03.css";
// import Pagination from '@mui/material/Pagination';
// const TODOITEMS03 = () => {
//   const navigate = useNavigate();
//   const [allData, setAllData] = useState([]);
//   const [ perPageRecords, setPerPageRecords] = useState();
//   const [totalPages, setTotalPages] = useState();


//   const getAllData = () => {
//     fetch("http://localhost:4001/todo/api/gettodoitems")
//       .then((res) => res.json())
//       .then((data) => {
//         setAllData(data.getAllTodoItems); 

//         setPerPageRecords(data.perPageRecords);
//         console.log("Fetched Data:", data); 
//       })
//       .catch((err) => console.error("Error fetching todos:", err));
//   };

//   const handleDelete = async(id) =>{
//     try {
//       const response = await fetch(
//         `http://localhost:4001/todo/api/deleteitems/${id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete the task");
//       }


//       // M1
//       const deletedData = await response.json();
//       console.log("Deleted item:", deletedData); 

//       if (deletedData && deletedData._id) {
//         setAllData((datas) =>
//           datas.filter((item) => item._id !== deletedData._id)
//         );
//       } else {
//         console.error("Deleted item does not have an _id:", data);
//       }

//       //  M2
//       // getAllData();  // Refresh the data after deletion
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleEdit = (productEditId) =>{
//     navigate("/", { state: { productEditId: productEditId } });
//   }

//   useEffect(() => {
//     getAllData();
//   }, []);



//   return (
//     <div className="TODOITEMS03">
//       {allData.map((ele, index) => {
//           const imageUrl = `http://localhost:4001/public/adminuploads/${ele.blogHeadingImage}`;
//         return (
//           <div key={index} >
//             <div className="TODOITEMS03Card">
//               <h1>{ele.blogsMainHeading}</h1>
//               <p style={{ display: "flex", flexDirection: "column" }}>
//                 <span>{ele.blogWriterName}</span>
//                 <span>{ele.blogWriterIntro}</span>
//                 <span>{ele.blogsPostDate}</span>
//               </p>
//               <div>
//                 <a href={ele.blogWriterLinkdeinLink}>LinkedIn</a>

//               {ele.blogHeadingImage && (
//                 <img
//                   src={imageUrl}
//                   alt="Blog Heading"
//                   style={{ width: "100%", height: "auto", marginTop: "20px" }}
//                 />
//               )}
//               </div>
//             </div>
//             <div>
//               <button onClick={()=>handleDelete(ele._id)}>DELETE</button>
//               <button onClick={()=>handleEdit(ele._id)}>EDIT</button>
//               <button onClick={()=>navigate("/")}>HOME</button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default TODOITEMS03;

// New Comp for pagination
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../TODOITEMS03/TODOITEMS03.css";
import Pagination from '@mui/material/Pagination';

const TODOITEMS03 = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [perPageRecords, setPerPageRecords] = useState(4);  // Default to 4 per page
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);  // Current page for pagination

  const getAllData = (page = 1) => {
    fetch(`http://localhost:4001/todo/api/gettodoitems?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setAllData(data.getAllTodoItems);
        setPerPageRecords(data.perPageRecords);
        setTotalPages(data.totalPages);  // Set the total pages from backend
        console.log("Fetched Data:", data);
      })
      .catch((err) => console.error("Error fetching todos:", err));
  };

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
    navigate("/", { state: { productEditId: productEditId } });
  };

  const handlePageChange = (event, value) => {
    console.log("value======>", value);
    setCurrentPage(value);  // Update current page
    getAllData(value);  // Fetch data for the selected page
  };
  const handleViewBlog = (blog, blogHadingImage, blogWriterImageimageUrl) => {
    navigate("/blog-view", { state: { blog: blog, blogHadingImage, blogWriterImageimageUrl } })
  }
  useEffect(() => {
    getAllData(currentPage);  // Fetch data for the initial page
  }, [currentPage]);

  return (
    <div className="BlogsContainer">
      <button onClick={() => navigate("/")} className="AddBlog">Add Blog</button>
      <div className="Blogs">


        {allData.map((ele, ind) => {
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
                {ele.blogsMainHeading.split(' ').length <= 5
                  ? ele.blogsMainHeading
                  : ele.blogsMainHeading.split(' ').slice(0, 5).join(' ') + '...'}
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
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="large"
      />
    </div>
  );
};

export default TODOITEMS03;
