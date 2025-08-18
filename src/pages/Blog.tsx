import React, { useState } from "react";
import BlogPost from "../components/BlogPost";
import "../styles/Blog.css";

const Blog: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const exampleBlogs = [
    {
      title: "Launch of this website",
      date: "July 6, 2025",
      content:
        "Today is the launch of my personal website! I'm excited to share my projects and ideas with the world. Stay tuned for more updates!",
      tags: ["Website", "React", "TypeScript"],
    },
  ];

  const years = ["All", "2025"];
  const months = ["All", "July"];

  const handleYearFilter = (year: string) => {
    setSelectedYear(selectedYear === year ? "All" : year);
  };

  const handleMonthFilter = (month: string) => {
    setSelectedMonth(selectedMonth === month ? "All" : month);
  };

  const filteredBlogs = exampleBlogs.filter((blog) => {
    const blogDate = new Date(blog.date);
    const year = blogDate.getFullYear().toString();
    const month = blogDate.toLocaleString("default", { month: "long" });

    const yearMatch = selectedYear === "All" || year === selectedYear;
    const monthMatch = selectedMonth === "All" || month === selectedMonth;

    return yearMatch && monthMatch;
  });

  return (
    <div className="blog-page">
      <div className="blog-content">
        <h2 className="!mt-10 !ml-8 text-4xl font-bold">Dev Diary</h2>
        <div className="blog-posts">
          {filteredBlogs.map((blog, index) => (
            <React.Fragment key={index}>
              <BlogPost {...blog} />
              {index < filteredBlogs.length - 1 && (
                <hr className="blog-separator" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="filter-sidebar">
        <div className="filter-section">
          <h3>Filter by Year</h3>
          <div className="filter-options">
            {years.map((year) => (
              <button
                key={year}
                className={`filter-button ${
                  selectedYear === year ? "active" : ""
                }`}
                onClick={() => handleYearFilter(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-section !mb-2">
          <h3>Filter by Month</h3>
          <div className="filter-options">
            {months.map((month) => (
              <button
                key={month}
                className={`filter-button ${
                  selectedMonth === month ? "active" : ""
                }`}
                onClick={() => handleMonthFilter(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
