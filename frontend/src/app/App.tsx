import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './content/display/Header';
import Footer from './content/display/Footer';
import Content from './content/Content';
import { CURRENT_REPORTS, PAGE } from './util/constants';

const App: FC = () => {
  return (
    <Router>
      <Header idirUsername="Michael" isAdmin={true} />
      <Routes>
        {PAGE.map((item, index) =>
          CURRENT_REPORTS.includes(item.title) ? (
            <Route key={index} path={`/dtid/:dtid/${item.path}`} element={<Content pageTitle={item.title} />} />
          ) : (
            <Route key={index} path={`/${item.path}/`} element={<Content pageTitle={item.title} />} />
          )
        )}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
