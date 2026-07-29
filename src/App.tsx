import Header from "./components/header/Header";
import SearchInput from "./components/search/Search";

function App() {
  // Функция-колбек для поиска
  const handleSearch = (searchValue: string) => {
    console.log(searchValue);
  };

  return (
    <>
      <Header />
      <main>
        <SearchInput onSearch={handleSearch} />
      </main>
    </>
  );
}

export default App;
