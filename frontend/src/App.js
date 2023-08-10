import { useSearchParams } from 'react-router-dom';
import Content from './components/Content';
import Footer from './components/Layout/Footer';
import Header from './components/Layout/Header';
import UserSearch from './components/Search/SearchBar/UserSearch';
import SearchResults from './components/Search/SearchResults/SearchResults';

import './scss/app.scss';

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  function getContent() {
    if (searchParams.has('title')) {
      return <Content show={searchParams.get('title')} />;
    } else if (searchParams.has('q')) {
      return (
        <SearchResults
          searchQuery={searchParams.get('q')}
          selectTitle={(selectedShow) => {
            if (selectedShow) {
              setSearchParams({ title: selectedShow });
            }
          }}
        />
      );
    }
  }

  return (
    <div className="App">
      <Header />
      <main role="main">
        <UserSearch
          getShow={(value) => console.log('noop')}
          getQuery={(query) => setSearchParams({ q: query })}
        />
        <div className="content-wrapper">{getContent()}</div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
