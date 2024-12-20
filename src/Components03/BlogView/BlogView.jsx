import React from 'react';
import { useLocation } from 'react-router-dom';
import "../BlogView/BlogView.css";

const BlogView = () => {
    const location = useLocation();
    // console.log("LOCData", location.state);
    const blog = location?.state.blog;
    const blogHadingImage = location?.state.blogHadingImage;
    const blogWriterImageimageUrl = location?.state.blogWriterImageimageUrl;
    console.log("blog==>", blog)
    // Check if blog data is available
    if (!blog) {
        return <div>Blog data not found</div>;
    }
    return (
        <div className='BlogView'>
            <div
                className="BlogViewTop blog-container-Top"
                style={{ backgroundColor: blog.blogImageBackgroundColor }}
            >
                <div className="BlogViewTopLeft blog-container-Top-Left">
                    <h1 className="BlogViewTopLeftMainHeading blog-container-Top-Left-MainHeading">
                        {blog.blogsMainHeading}
                    </h1>

                    <div className="BlogViewTopLeftWriterNameAndBlogPublicationDate blog-container-Top-Left-Writer">
                        <p>
                            <span>By : {blog.blogWriterName}</span>
                            <span>{blog.blogsPostDate}</span>
                        </p>
                    </div>
                </div>
                <div className="blog-container-Top-right">
                    <img
                        src={blogHadingImage}
                        alt="image"
                        className="blog-container-Top-right-image"
                    />
                </div>
            </div>


            <div className='BlogViewBottom'>
                {/* <div className='BlogViewBottomLeft'>
                    <h2>Table Of Contents</h2>
                    <p className='BlogViewBottomLeftContentTitle'></p>
                </div> */}
                <div className='BlogViewBottomCenter' dangerouslySetInnerHTML={{__html : blog.reactQuillValue }}></div>
                <div className='BlogViewBottomRight'>
                    <img className='BlogViewBottomRightWriterImage' src={blogWriterImageimageUrl} alt="blogWriterImageimageUrl" />
                    <span className='BlogViewBottomRightWriterName'>{blog.blogWriterName}</span>
                    <p className='BlogViewBottomRightWriterIntro'>{blog.blogWriterIntro}</p>
                    <a className='BlogViewBottomRightWriterLinkdLink' href={blog.blogWriterLinkdeinLink}>LinkD</a>
                </div>
            </div>


        </div>
    )
}

export default BlogView