// import React, { useState } from "react";
// import { Button } from "./components/ui/Button";
// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Dashboard from "./components/dashboard/Dashboard";

// const App = () => {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Index />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
      
//     </div>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/dashboard/Dashboard";

const App = () => {
  return (
      <Routes>
        {/* Index handles landing + auth logic */}
        <Route path="/" element={<Index />} />

        {/* Dashboard handles tabs via URL param */}
        <Route path="/dashboard/:tab" element={<Dashboard />} />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default App;
