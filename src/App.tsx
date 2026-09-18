import { Component, type ReactNode } from "react";
import type {
  ResultsInfo,
  Character as CharacterData,
  SearchType,
  Location,
  Episode,
} from "./components/types/types";
import fetchResults from "./api/apiClient";
import Header from "./components/header/Header";
import SearchForm from "./components/search-form/SearchForm";
import CharactersList from "./components/search-results/characters/CharactersList";
import LocationsList from "./components/search-results/locations/LocationsList";
import EpisodesList from "./components/search-results/episodes/EpisodesList";

type AppState = {
  characters: {
    info: ResultsInfo;
    data: CharacterData[];
  };
  locations: {
    info: ResultsInfo;
    data: Location[];
  };
  episodes: {
    info: ResultsInfo;
    data: Episode[];
  };
  searchValue: string;
  searchType: SearchType;
  currentPage: number;
  error: boolean;
  loading: boolean;
};

const createInitialState = (): AppState => ({
  characters: {
    info: {
      count: 0,
      pages: 0,
      next: null,
      prev: null,
    },
    data: [],
  },

  locations: {
    info: {
      count: 0,
      pages: 0,
      next: null,
      prev: null,
    },
    data: [],
  },

  episodes: {
    info: {
      count: 0,
      pages: 0,
      next: null,
      prev: null,
    },
    data: [],
  },

  searchValue: "",
  searchType: "characters",
  currentPage: 1,
  error: false,
  loading: false,
});

class App extends Component<object, AppState> {
  // Создаём поле state
  state: AppState = createInitialState();

  // Функция-колбек для поиска
  handleSearch = (searchValue: string) => {
    // Не меняем state если загрузка активна
    if (this.state.loading) return;
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

  // Сбрасываем state и меняем тип поиска
  handleSearchType = (searchType: SearchType) => {
    // Не меняем state если загрузка активна
    if (this.state.loading) return;
    this.setState({ ...createInitialState(), searchType });
  };

  // Управление пагинацией
  handlePagination = (newPage: number) => {
    // Не меняем state если загрузка активна
    if (this.state.loading) return;
    this.setState(
      { currentPage: newPage },
      // Вызываем функцию запроса с обновлёнными параметрами
      this.fetchSearchResults,
    );
  };

  // Запрос в зависимости от введённого value,
  // выбранного типа поиска и номера страницы
  // и запись ответа в state App
  fetchSearchResults = async () => {
    // Если загрузка уже идёт выходим из функции
    if (this.state.loading === true) {
      return;
    }
    // Переключаем в режим загрузки
    this.setState({
      loading: true,
    });
    // Отсылаем fetch и пытаемся записать ответ в state App`а,
    // если приходит ошибка обрабатываем её
    try {
      if (this.state.searchType === "characters") {
        const data = await fetchResults(
          this.state.searchType,
          this.state.searchValue,
          this.state.currentPage,
        );

        this.setState({
          characters: {
            info: data.info,
            data: data.results,
          },
          error: false,
        });
      } else if (this.state.searchType === "locations") {
        const data = await fetchResults(
          this.state.searchType,
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          locations: { info: data.info, data: data.results },
          error: false,
        });
      } else if (this.state.searchType === "episodes") {
        const data = await fetchResults(
          this.state.searchType,
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          episodes: { info: data.info, data: data.results },
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        error: true,
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  // Колбэк для клика по эпизоду
  handleEpisodeSelect = (episode: Episode) => {
    this.setState(
      {
        searchValue: String(episode.id),
        searchType: "episodes",
        currentPage: 1,
      },
      this.fetchSearchResults,
    );
  };
  // Коллбэк для клика по локации
  handleLocationSelect = (locationId: number) => {
    this.setState(
      {
        searchValue: String(locationId),
        searchType: "locations",
        currentPage: 1,
      },
      this.fetchSearchResults,
    );
  };
  // Коллбэк для клика по персонажу
  handleCharacterSelect = (character: CharacterData) => {
    this.setState(
      {
        searchValue: String(character.id),
        searchType: "characters",
        currentPage: 1,
      },
      this.fetchSearchResults,
    );
  };

  render(): ReactNode {
    const paginationProps = {
      type: this.state.searchType,
      currentPage: this.state.currentPage,
      pages: this.state[this.state.searchType].info.pages,
      loading: this.state.loading,
      handlePagination: this.handlePagination,
    };
    return (
      <>
        <Header />
        <main>
          <SearchForm
            searchType={this.state.searchType}
            loading={this.state.loading}
            onSearchTypeChange={this.handleSearchType}
            onSearch={this.handleSearch}
          />
          {this.state.searchType === "characters" &&
            this.state.error === false && (
              <CharactersList
                characters={this.state.characters.data}
                loading={this.state.loading}
                paginationProps={paginationProps}
                onEpisodeSelect={this.handleEpisodeSelect}
                onLocationSelect={this.handleLocationSelect}
              />
            )}
          {this.state.searchType === "locations" &&
            this.state.error === false && (
              <LocationsList
                locationsData={this.state.locations.data}
                loading={this.state.loading}
                paginationProps={paginationProps}
                onCharacterSelect={this.handleCharacterSelect}
              />
            )}
          {this.state.searchType === "episodes" &&
            this.state.error === false && (
              <EpisodesList
                episodesData={this.state.episodes.data}
                loading={this.state.loading}
                paginationProps={paginationProps}
                onCharacterSelect={this.handleCharacterSelect}
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
