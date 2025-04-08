
import React from "react";

export const AppFooter: React.FC = () => {
  return (
    <footer className="bg-kiddo-blue text-white py-6">
      <div className="kiddo-container">
        <div className="text-center md:flex md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Kiddo Class Adventures</h3>
            <p className="text-sm mt-1">Learning Made Fun & Interactive</p>
          </div>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Help</a>
          </div>
        </div>
        <div className="text-center mt-6 text-sm">
          &copy; {new Date().getFullYear()} Kiddo Class Adventures. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
