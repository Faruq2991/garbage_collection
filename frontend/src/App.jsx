import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CollectorsPage from "./pages/CollectorsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collectors" element={<CollectorsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
