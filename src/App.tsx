import { Component, type ReactNode } from "react";
import Header from "./components/header/Header";
import SearchForm from "./components/search-form/SearchForm";
import fetchCharacters from "./api/characters";
import CharactersList from "./components/characters/CharactersList";
import type {
  Character as CharacterData,
  SearchType,
} from "./components/characters/types";

type AppState = {
  characters: CharacterData[];
  searchType: SearchType;
};

export class App extends Component<object, AppState> {
  // Создаём поле state
  state: AppState = {
    characters: [],
    searchType: "character",
  };
  // Функция-колбек для поиска
  handleSearch = async (searchValue: string, searchType: SearchType) => {
    if (searchType === "character") {
      const data = await fetchCharacters(searchValue);
      this.setState({ characters: data.results });
    }
  };

  render(): ReactNode {
    return (
      <>
        <Header />
        <main>
          <SearchForm onSearch={this.handleSearch} />
          <CharactersList characters={this.state.characters} />
        </main>
      </>
    );
  }
}

export default App;
