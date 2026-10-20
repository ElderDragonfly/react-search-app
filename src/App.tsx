import { Component, type ReactNode } from "react";
import type {
  ResultsInfo,
  Character as CharacterData,
  SearchType,
  Location,
  Episode,
  ErrorInfo,
} from "./components/types/types";
import fetchResults from "./api/apiClient";
import Header from "./components/header/Header";
import SearchForm from "./components/search-form/SearchForm";
import CharactersList from "./components/search-results/characters/CharactersList";
import LocationsList from "./components/search-results/locations/LocationsList";
import EpisodesList from "./components/search-results/episodes/EpisodesList";
import { handleError } from "./api/errors/ApiError";

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
  error: ErrorInfo;
  loading: boolean;
};

const defoultState: AppState = {
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
  error: null,
  loading: false,
};

class App extends Component<object, AppState> {
  // Создаём поле state
  state: AppState = (() => {
    const savedType = localStorage.getItem("searchType");
    const savedQuery = localStorage.getItem("searchQuery");
    const initialState = structuredClone(defoultState);
    if (savedType && savedQuery) {
      initialState.searchType = JSON.parse(savedType);
      initialState.searchValue = JSON.parse(savedQuery);
      return initialState;
    }
    return initialState;
  })();

  // При создании App отправляем запрос с записанными в localStorage данными, если они есть
  async componentDidMount(): Promise<void> {
    const savedType = localStorage.getItem("searchType");
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedType && savedQuery) {
      await this.fetchSearchResults();
    }
  }

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
    // Записываем данные в localStorage
    localStorage.setItem("searchType", JSON.stringify(this.state.searchType));
    localStorage.setItem("searchQuery", JSON.stringify(searchValue));
  };

  // Сбрасываем state и меняем тип поиска
  handleSearchType = (searchType: SearchType) => {
    // Не меняем state если загрузка активна
    if (this.state.loading) return;
    this.setState({ ...defoultState, searchType });
    // Записываем данные в localStorage
    localStorage.removeItem("searchType");
    localStorage.removeItem("searchQuery");
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
    // Переключаем в режим загрузки и сбрасываем старые ошибки
    this.setState({
      loading: true,
      error: null,
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
          error: null,
        });
      } else if (this.state.searchType === "locations") {
        const data = await fetchResults(
          this.state.searchType,
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          locations: { info: data.info, data: data.results },
          error: null,
        });
      } else if (this.state.searchType === "episodes") {
        const data = await fetchResults(
          this.state.searchType,
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          episodes: { info: data.info, data: data.results },
          error: null,
        });
      }
    } catch (error: unknown) {
      const errorInfo = handleError(error);
      this.setState({ error: errorInfo });
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
            searchValue={this.state.searchValue}
            searchType={this.state.searchType}
            loading={this.state.loading}
            onSearchTypeChange={this.handleSearchType}
            onSearch={this.handleSearch}
          />
          {this.state.searchType === "characters" &&
            this.state.error === null && (
              <CharactersList
                characters={this.state.characters.data}
                loading={this.state.loading}
                paginationProps={paginationProps}
                onEpisodeSelect={this.handleEpisodeSelect}
                onLocationSelect={this.handleLocationSelect}
              />
            )}
          {this.state.searchType === "locations" &&
            this.state.error === null && (
              <LocationsList
                locationsData={this.state.locations.data}
                loading={this.state.loading}
                paginationProps={paginationProps}
                onCharacterSelect={this.handleCharacterSelect}
              />
            )}
          {this.state.searchType === "episodes" &&
            this.state.error === null && (
              <EpisodesList
                episodesData={this.state.episodes.data}
                loading={this.state.loading}
                paginationProps={paginationProps}
                onCharacterSelect={this.handleCharacterSelect}
              />
            )}
          {this.state.error && (
            <>
              <p className="error__message">{this.state.error.message}</p>
            </>
          )}
        </main>
      </>
    );
  }
}

export default App;
