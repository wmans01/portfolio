import React, { useState } from "react";
import BlogPost from "../components/BlogPost";
import "../styles/Blog.css";

const Blog: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const exampleBlogs = [
    {
      title: "Starting My Development Journey",
      date: "March 15, 2024",
      content:
        "Today marks the beginning of my journey into web development. I've decided to focus on React and TypeScript, as they seem to be the most in-demand skills right now. Spent the day setting up my development environment and going through the basics of React components. The learning curve is steep, but I'm excited to see where this takes me.",
      tags: ["Learning", "React", "TypeScript"],
    },
    {
      title: "First Project Struggles",
      date: "February 28, 2024",
      content:
        "Hit my first major roadblock today. State management in React is more complex than I initially thought. Tried implementing Redux but ended up going with Context API for my first project. The documentation was helpful, but I still spent hours debugging a simple state update issue. Lesson learned: always console.log your state changes!",
      tags: ["React", "State Management", "Learning"],
    },
    {
      title: "CSS Grid Breakthrough",
      date: "February 10, 2024",
      content:
        "Finally had that 'aha' moment with CSS Grid today. After struggling with layouts for weeks, something clicked. Created a responsive portfolio layout that actually works on all screen sizes. The grid-template-areas property is a game-changer. Feeling more confident about my frontend skills now.",
      tags: ["CSS", "Frontend", "Learning"],
    },
    {
      title: "TypeScript Type Errors",
      date: "January 22, 2024",
      content:
        "Spent the entire day fixing TypeScript type errors. At first, it was frustrating, but now I see how it's actually helping me write better code. The compiler caught several potential bugs before they made it to production. TypeScript might be strict, but it's definitely worth the extra effort.",
      tags: ["TypeScript", "Learning", "Debugging"],
    },
    {
      title: "First Pull Request",
      date: "January 5, 2024",
      content:
        "Submitted my first pull request to an open-source project today! It was just a small documentation fix, but it felt great to contribute. The maintainers were very welcoming and provided helpful feedback. Looking forward to making more contributions in the future.",
      tags: ["Open Source", "Git", "Learning"],
    },
  ];

  const years = ["All", "2024"];
  const months = ["All", "January", "February", "March"];

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
