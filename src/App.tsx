import { Component, type ReactNode } from "react";
import Header from "./components/header/Header";
import SearchForm from "./components/search-form/SearchForm";
import fetchCharacters from "./api/characters";
import fetchLocations from "./api/locations";
import CharactersList from "./components/search-results/characters/CharactersList";
import LocationsList from "./components/search-results/locations/LocationsList";
import type {
  ResultsInfo,
  CharactersInfo,
  Character as CharacterData,
  SearchType,
  Location,
  Episode,
} from "./components/types/types";
import fetchEpisodes from "./api/episodes";
import EpisodesList from "./components/search-results/episodes/EpisodesList";

type AppState = {
  charactersInfo: CharactersInfo;
  characters: CharacterData[];
  locations: {
    locationsInfo: ResultsInfo;
    locationsData: Location[];
  };
  episodes: {
    episodesInfo: ResultsInfo;
    episodesData: Episode[];
  };
  searchValue: string;
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
    locations: {
      locationsInfo: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      locationsData: [],
    },
    episodes: {
      episodesInfo: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      episodesData: [],
    },
    searchValue: "",
    searchType: "character",
    currentPage: 1,
  };
  // Функция-колбек для поиска
  handleSearch = (searchValue: string, searchType: SearchType) => {
    // Записываем текущее значение value и типа поиска
    this.setState(
      {
        searchValue: searchValue,
        searchType: searchType,
        currentPage: 1,
      },
      // Вызываем функцию запроса с обновлёнными параметрами
      this.fetchSearchResults,
    );
  };

  // Управление запросом с помощью пагинации
  handlePagination = (currentPage: number) => {
    this.setState(
      { currentPage: currentPage },
      // Вызываем функцию запроса с обновлёнными параметрами
      this.fetchSearchResults,
    );
  };

  // Запрос в зависимости от введённого value,
  // выбранного типа поиска и номера страницы
  // и запись ответа в state App
  fetchSearchResults = async () => {
    // В зависимости от типа поиска отсылаем нужный fetch и записываем ответ в state App`а
    if (this.state.searchType === "character") {
      const data = await fetchCharacters(
        this.state.searchValue,
        this.state.currentPage,
      );
      this.setState({
        charactersInfo: data.info,
        characters: data.results,
      });
    } else if (this.state.searchType === "location") {
      const data = await fetchLocations(
        this.state.searchValue,
        this.state.currentPage,
      );
      this.setState({
        locations: { locationsInfo: data.info, locationsData: data.results },
      });
    } else if (this.state.searchType === "episode") {
      const data = await fetchEpisodes(
        this.state.searchValue,
        this.state.currentPage,
      );
      this.setState({
        episodes: { episodesInfo: data.info, episodesData: data.results },
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
              currentPage={this.state.currentPage}
              onPaginationChange={this.handlePagination}
            />
          )}
          {this.state.searchType === "location" && (
            <LocationsList
              locationsInfo={this.state.locations.locationsInfo}
              locationsData={this.state.locations.locationsData}
              currentPage={this.state.currentPage}
              // onPaginationChange={this.handlePagination}
            />
          )}
          {this.state.searchType === "episode" && (
            <EpisodesList
              episodeInfo={this.state.episodes.episodesInfo}
              episodesData={this.state.episodes.episodesData}
              currentPage={this.state.currentPage}
              // onPaginationChange={this.handlePagination}
            />
          )}
        </main>
      </>
    );
  }
}

export default App;
