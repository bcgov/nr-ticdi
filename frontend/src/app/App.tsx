import React, { FC } from "react";
import "./App.css";
import Header from "../Content/Header/Header";
import Footer from "../Content/Footer/Footer";
import Content from "../Content/Content";

const App: FC = () => {
  return (
    <>
      <Header idirUsername="MichaelT" isAdmin={true} />
      <Content page="index" />
      <Footer />
    </>
  );
};

export default App;
