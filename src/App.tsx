import { Component, type ReactNode } from "react";
import Header from "./components/header/Header";
import SearchInput from "./components/search/Search";
import requestCharacter from "./api/characters";
import CharactersList from "./components/characters/CharactersList";
import type { CharacterCard as CharacterData } from "./components/characters/charactersType";

type AppState = {
  results: CharacterData[];
};

export class App extends Component<object, AppState> {
  // Создаём поле state
  state: Readonly<AppState> = {
    results: [],
  };
  // Функция-колбек для поиска
  handleSearch = async (searchValue: string) => {
    const charactersData = await requestCharacter(searchValue);
    this.setState({ results: charactersData.results });
  };

  render(): ReactNode {
    return (
      <>
        <Header />
        <main>
          <SearchInput onSearch={this.handleSearch} />
          <CharactersList CharactersCards={this.state.results} />
        </main>
      </>
    );
  }
}

export default App;
