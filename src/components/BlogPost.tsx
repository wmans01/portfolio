import React from "react";

interface BlogPostProps {
  title: string;
  date: string;
  content: string;
  tags: string[];
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, content, tags }) => {
  return (
    <div className="blog-post">
      <div className="blog-post-header">
        <h2>{title}</h2>
        <div className="blog-post-meta">
          <span className="date">{date}</span>
        </div>
      </div>
      <p className="blog-post-content">{content}</p>
      <div className="blog-post-tags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
