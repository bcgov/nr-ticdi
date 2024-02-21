import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./content/display/Header";
import Footer from "./content/display/Footer";
import Content from "./content/Content";
import { CURRENT_REPORT_PAGES, PAGE } from "./util/constants";

const App: FC = () => {
  return (
    <Router>
      <Header idirUsername="Michael" isAdmin={true} />
      <Routes>
        {Object.entries(PAGE).map(([key, path]) => (
          <Route
            key={key}
            path={`/${path}`}
            element={<Content page={path} />}
          />
        ))}
        {Object.entries(CURRENT_REPORT_PAGES).map(([key, path]) => (
          <Route
            key={key}
            path={`/${path}`}
            element={<Content page={path} />}
          />
        ))}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
