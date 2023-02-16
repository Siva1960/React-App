import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";
import Universities from "./pages/universities";
import Admissions from "./pages/admission";
function App() {
  return (
    <div className="App">
      <Sidebar />
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/home" exact element={<Home />} />
          <Route path="/universities" exact element={<Universities />} />
          <Route path="/admission" exact element={<Admissions />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
