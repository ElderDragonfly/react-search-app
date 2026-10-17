import {
  Component,
  type ReactNode,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import type { SearchType } from "../types/types";

type SearchProps = {
  searchValue: string;
  searchType: SearchType;
  loading: boolean;
  onSearchTypeChange: (searchType: SearchType) => void;
  onSearch: (searchValue: string) => void;
};

type SearchState = {
  query: string;
};

class SearchForm extends Component<SearchProps, SearchState> {
  // Задаём начальные значения state
  state: SearchState = {
    query: "",
  };

  // Метод сохраняет текущее значение поля в state
  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
  };

  // Метод вызывает переданный колбек с отправкой формы
  handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSearch(this.state.query);
    // Очищаем поле ввода после отправки формы
    this.setState({
      query: "",
    });
  };

  render(): ReactNode {
    return (
      <>
        <form
          role="search"
          className="search__form"
          onSubmit={this.handleSubmit}
        >
          <div className="search__input-wrapper">
            <input
              type="search"
              className="search__input"
              // Placeholder меняется вместе с изменением state
              placeholder={`Search ${this.props.searchType}...`}
              onChange={this.handleChange}
              // Для очистки после нажатия кнопки отправки
              value={this.state.query}
            />
            <button
              type="submit"
              className="search__button"
              disabled={this.props.loading}
            >
              {this.props.loading ? "Loading..." : "Search"}
            </button>
          </div>

          <div className="search__query-summary">
            Results for{" "}
            <span className="search__query-value">
              "{this.props.searchValue}"
            </span>{" "}
            in {this.props.searchType}
          </div>

          <fieldset
            className="search__type-wrapper"
            disabled={this.props.loading}
          >
            <label className="search__label">
              <input
                type="radio"
                name="searchType"
                value="character"
                className="search__type"
                onChange={() => {
                  (this.props.onSearchTypeChange("characters"),
                    this.setState({ query: "" }));
                }}
                checked={this.props.searchType === "characters"}
              />
              Characters
            </label>
            <label className="search__label">
              <input
                type="radio"
                name="searchType"
                value="location"
                className="search__type"
                onChange={() => {
                  this.props.onSearchTypeChange("locations");
                  this.setState({ query: "" });
                }}
                checked={this.props.searchType === "locations"}
              />
              Locations
            </label>
            <label className="search__label">
              <input
                type="radio"
                name="searchType"
                value="episode"
                className="search__type"
                onChange={() => {
                  (this.props.onSearchTypeChange("episodes"),
                    this.setState({ query: "" }));
                }}
                checked={this.props.searchType === "episodes"}
              />
              Episodes
            </label>
          </fieldset>
        </form>
      </>
    );
  }
}

export default SearchForm;
