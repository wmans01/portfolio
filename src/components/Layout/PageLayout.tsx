import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="page-container">
      <div className="content-container">{children}</div>
    </div>
  );
};

export default PageLayout;
