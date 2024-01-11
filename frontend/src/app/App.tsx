import { FC } from "react";
import Header from "./content/display/Header";
import Footer from "./content/display/Footer";
import Content from "./content/Content";

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
