import { useEffect, useState } from 'react';
import './App.css';
import Data from './components/Data';
import SearchBar from './components/SearchBar';

const App = () => {
  const [show, setShow] = useState('');

  return (
    <div className="App">
      <SearchBar searchShow={(value) => setShow(value)} />
      <Data show={show} />
    </div>
  );
};

export default App;
