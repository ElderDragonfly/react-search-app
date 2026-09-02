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
};

export class App extends Component<object, AppState> {
  // Создаём поле state
  state: AppState = {
    characters: {
      info: {
        count: 0,
        pages: 0,
        next: "",
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

  // Управление пагинацией
  handlePagination = (newPage: number) => {
    this.setState(
      { currentPage: newPage },
      // Вызываем функцию запроса с обновлёнными параметрами
      this.fetchSearchResults,
    );
  };
  // Рендер пагинации
  renderPagination = (): ReactNode => {
    // Тип "characters" | "locations" | "episodes" в разделе связанным с которым будет происходить взаимодействие со state
    const type = this.state.searchType;

    const currentPage: number = this.state.currentPage;
    const pages: number = this.state[type].info.pages;
    return (
      this.state[type].info.pages > 1 && (
        <>
          {/* Стрелка для пролистывания пагинации к началу */}
          <button
            className="pagination__button"
            disabled={currentPage === 1}
            onClick={() => {
              if (currentPage - 1 >= 1) {
                this.handlePagination(this.state.currentPage - 1);
              }
            }}
          >
            &lt;
          </button>
          {/* Если страница не первая, покажет показвается пагинация на 1ю страницу */}
          {currentPage > 1 &&
            currentPage - 1 !== 1 &&
            currentPage - 2 !== 1 && (
              <>
                {" "}
                <button
                  className="pagination__button"
                  onClick={() => {
                    this.handlePagination(1);
                  }}
                >
                  1
                </button>
                {/* // Точки при непоказанных страницах пагинации */}
                {currentPage - 2 > 2 && <span>...</span>}
              </>
            )}
          {/* Если есть предыдущая страница отобразит и её */}
          {currentPage - 2 >= 1 && (
            <button
              className="pagination__button"
              onClick={() => {
                this.handlePagination(currentPage - 2);
              }}
            >
              {this.state.currentPage - 2}
            </button>
          )}
          {/* Если есть ещё предыдущая страница отобразит и её */}
          {currentPage - 1 >= 1 && (
            <button
              className="pagination__button"
              onClick={() => {
                this.handlePagination(currentPage - 1);
              }}
            >
              {this.state.currentPage - 1}
            </button>
          )}
          {/* Если есть персонажи, отображает номер текущей страницы */}
          <button
            className="pagination__button pagination__button--active"
            disabled
          >
            {this.state.currentPage}
          </button>
          {/* Если есть следующая страница отобразит и её */}
          {currentPage + 1 <= pages && (
            <button
              className="pagination__button"
              onClick={() => {
                this.handlePagination(currentPage + 1);
              }}
            >
              {this.state.currentPage + 1}
            </button>
          )}
          {/* Если есть ещё страница отобразит и её */}
          {currentPage + 2 <= pages && (
            <>
              <button
                className="pagination__button"
                onClick={() => {
                  this.handlePagination(currentPage + 2);
                }}
              >
                {this.state.currentPage + 2}
              </button>
              {/* // Точки при непоказанных страницах пагинации */}
              {currentPage + 2 < pages - 1 && <span>...</span>}
            </>
          )}
          {/* Если страница не последняя,
          покажет показвается пагинация на последнюю страницу */}
          {currentPage < pages &&
            currentPage + 1 !== pages &&
            currentPage + 2 !== pages && (
              <>
                {" "}
                <button
                  className="pagination__button"
                  onClick={() => {
                    this.handlePagination(this.state[type].info.pages);
                  }}
                >
                  {this.state[type].info.pages}
                </button>
              </>
            )}
          {/* Стрелка для пролистывания пагинации к концу */}
          <button
            className={"pagination__button"}
            disabled={currentPage === pages}
            onClick={() => {
              if (currentPage + 1 <= pages) {
                this.handlePagination(this.state.currentPage + 1);
              }
            }}
          >
            &gt;
          </button>
        </>
      )
    );
  };

  // Запрос в зависимости от введённого value,
  // выбранного типа поиска и номера страницы
  // и запись ответа в state App
  fetchSearchResults = async () => {
    // В зависимости от типа поиска отсылаем нужный fetch и пытаемся записать ответ в state App`а,
    // если приходит ошибка обрабатываем её
    if (this.state.searchType === "characters") {
      try {
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
      } catch (error) {
        console.log(error);
        this.setState({
          error: true,
        });
      }
    } else if (this.state.searchType === "locations") {
      try {
        const data = await fetchResults(
          this.state.searchType,
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          locations: { info: data.info, data: data.results },
          error: false,
        });
      } catch (error) {
        console.log(error);
        this.setState({
          error: true,
        });
      }
    } else if (this.state.searchType === "episodes") {
      try {
        const data = await fetchResults(
          this.state.searchType,
          this.state.searchValue,
          this.state.currentPage,
        );
        this.setState({
          episodes: { info: data.info, data: data.results },
          error: false,
        });
      } catch (error) {
        console.log(error);
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
        searchType: "episodes",
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
        searchType: "locations",
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
          {this.state.searchType === "characters" &&
            this.state.error === false && (
              <CharactersList
                charactersInfo={this.state.characters.info}
                characters={this.state.characters.data}
                currentPage={this.state.currentPage}
                renderPagination={this.renderPagination}
                onEpisodeSelect={this.handleEpisodeClick}
                onLocationSelect={this.handleLocationClick}
              />
            )}
          {this.state.searchType === "locations" &&
            this.state.error === false && (
              <LocationsList
                locationsInfo={this.state.locations.info}
                locationsData={this.state.locations.data}
                currentPage={this.state.currentPage}
                // onPaginationChange={this.handlePagination}
              />
            )}
          {this.state.searchType === "episodes" &&
            this.state.error === false && (
              <EpisodesList
                episodeInfo={this.state.episodes.info}
                episodesData={this.state.episodes.data}
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
