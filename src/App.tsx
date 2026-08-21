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
  character: {
    charactersInfo: CharactersInfo;
    characters: CharacterData[];
  };
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
  error: boolean;
};

export class App extends Component<object, AppState> {
  // Создаём поле state
  state: AppState = {
    character: {
      charactersInfo: {
        count: 0,
        pages: 0,
        next: "",
        prev: null,
      },
      characters: [],
    },
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
    error: false,
  };
  // Функция-колбек для поиска
  handleSearch = (searchValue: string) => {
    // Записываем текущее значение value и типа поиска
    this.setState(
      {
        searchValue: searchValue,
        currentPage: 1,
      },
      // Вызываем функцию запроса с обновлёнными параметрами
      this.fetchSearchResults,
    );
  };

  handleSearchType = (searchType: SearchType) => {
    this.setState({
      searchType: searchType,
    });
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
    // В зависимости от типа поиска отсылаем нужный fetch и пытаемся записать ответ в state App`а,
    // если приходит ошибка обрабатываем её
    if (this.state.searchType === "character") {
      try {
        const data = await fetchCharacters(
          this.state.searchValue,
          this.state.currentPage,
        );

        this.setState({
          character: {
            charactersInfo: data.info,
            characters: data.results,
          },
          error: false,
        });
      } catch (error) {
        this.setState({
          error: true,
        });
      }
    } else if (this.state.searchType === "location") {
      try {
        const data = await fetchLocations(
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          locations: { locationsInfo: data.info, locationsData: data.results },
          error: false,
        });
      } catch (error) {
        this.setState({
          error: true,
        });
      }
    } else if (this.state.searchType === "episode") {
      try {
        const data = await fetchEpisodes(
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          episodes: { episodesInfo: data.info, episodesData: data.results },
          error: false,
        });
      } catch (error) {
        this.setState({
          error: true,
        });
      }
    }
  };

  // Колбэк для клика по эпизоду
  handleEpisodeClick = (episode: Episode) => {
    this.setState(
      {
        searchValue: String(episode.id),
        searchType: "episode",
        currentPage: 1,
      },
      this.fetchSearchResults,
    );
  };
  // Коллбэк для клика по локации
  handleLocationClick = (locationId: number) => {
    this.setState(
      {
        searchValue: String(locationId),
        searchType: "location",
        currentPage: 1,
      },
      this.fetchSearchResults,
    );
  };

  render(): ReactNode {
    return (
      <>
        <Header />
        <main>
          <SearchForm
            searchType={this.state.searchType}
            onSearchTypeChange={this.handleSearchType}
            onSearch={this.handleSearch}
          />
          {this.state.searchType === "character" &&
            this.state.error === false && (
              <CharactersList
                charactersInfo={this.state.character.charactersInfo}
                characters={this.state.character.characters}
                currentPage={this.state.currentPage}
                onPaginationChange={this.handlePagination}
                onEpisodeSelect={this.handleEpisodeClick}
                onLocationSelect={this.handleLocationClick}
              />
            )}
          {this.state.searchType === "location" &&
            this.state.error === false && (
              <LocationsList
                locationsInfo={this.state.locations.locationsInfo}
                locationsData={this.state.locations.locationsData}
                currentPage={this.state.currentPage}
                // onPaginationChange={this.handlePagination}
              />
            )}
          {this.state.searchType === "episode" &&
            this.state.error === false && (
              <EpisodesList
                episodeInfo={this.state.episodes.episodesInfo}
                episodesData={this.state.episodes.episodesData}
                currentPage={this.state.currentPage}
                // onPaginationChange={this.handlePagination}
              />
            )}
          {this.state.error === true && (
            <>
              <p className="error__not-found">Sorry, can`t found it :&#40;</p>
            </>
          )}
        </main>
      </>
    );
  }
}

export default App;
