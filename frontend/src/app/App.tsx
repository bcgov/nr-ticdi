import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./content/display/Header";
import Footer from "./content/display/Footer";
import Content from "./content/Content";

const App: FC = () => {
  return (
    <Router>
      <Header idirUsername="Michael" isAdmin={true} />
      <Routes>
        <Route path="/" element={<Content page="report" />} />
        <Route path="/search" element={<Content page="search" />} />
        <Route path="/admin" element={<Content page="admin" />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
