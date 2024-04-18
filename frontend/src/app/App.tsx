import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './content/display/Header';
import Footer from './content/display/Footer';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRoutes from './routes';

const App: FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <AppRoutes />
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
