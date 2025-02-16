import { useState } from "react";
import AppRouter from "./routes";
function App() {
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">
          Mock Test System
        </h1>
        <AppRouter />
      </div>
    </>
  );
}

export default App;
