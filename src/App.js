import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
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
