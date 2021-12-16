import Header from './components/Layout/Header';
import Content from './components/Content';
import Footer from './components/Layout/Footer';
import './sass/app.scss';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Content />
      <Footer />
    </div>
  );
};

export default App;
