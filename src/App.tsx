import { Component, type ReactNode } from "react";
import Header from "./components/header/Header";
import SearchForm from "./components/search-form/SearchForm";
import fetchCharacters from "./api/characters";
import CharactersList from "./components/characters/CharactersList";
import type {
  CharactersInfo,
  Character as CharacterData,
  SearchType,
} from "./components/types/types";

type AppState = {
  charactersInfo: CharactersInfo;
  characters: CharacterData[];
  searchType: SearchType;
  currentPage: number;
};

export class App extends Component<object, AppState> {
  // Создаём поле state
  state: AppState = {
    charactersInfo: {
      count: 0,
      pages: 0,
      next: "",
      prev: null,
    },
    characters: [],
    searchType: "character",
    currentPage: 1,
  };
  // Функция-колбек для поиска
  handleSearch = async (searchValue: string, searchType: SearchType) => {
    // Записываем текущее значение типа поиска
    this.setState({ searchType: searchType });
    // В зависимости от типа поиска создаём нужный компонент
    if (searchType === "character") {
      const data = await fetchCharacters(searchValue, this.state.currentPage);
      this.setState({
        charactersInfo: data.info,
        characters: data.results,
      });
    }
  };

  render(): ReactNode {
    return (
      <>
        <Header />
        <main>
          <SearchForm onSearch={this.handleSearch} />
          {this.state.searchType === "character" && (
            <CharactersList
              charactersInfo={this.state.charactersInfo}
              characters={this.state.characters}
            />
          )}
        </main>
      </>
    );
  }
}

export default App;
