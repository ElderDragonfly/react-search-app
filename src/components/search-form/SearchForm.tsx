import {
  Component,
  type ReactNode,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import type { SearchType } from "../characters/types";

type SearchProps = {
  onSearch: (searchValue: string, searchType: SearchType) => void;
};

type SearchState = {
  query: string;
  placeholder: string;
  searchType: SearchType;
};

class SearchForm extends Component<SearchProps, SearchState> {
  state: SearchState = {
    query: "",
    placeholder: "Search characters...",
    searchType: "character",
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
    this.props.onSearch(this.state.query, this.state.searchType);
  };

  // Метод записывает в state поле где искать персонаж/локация/эпизод
  handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedType = event.currentTarget.value as SearchType;
    this.setState({
      searchType: selectedType,
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
              placeholder={this.state.placeholder}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit" className="search__button">
            Search
          </button>

          <fieldset>
            <label>
              <input
                type="radio"
                name="searchType"
                value="character"
                onChange={this.handleTypeChange}
                checked={this.state.searchType === "character"}
              />
              Characters
            </label>
            <label>
              <input
                type="radio"
                name="searchType"
                value="location"
                onChange={this.handleTypeChange}
                checked={this.state.searchType === "location"}
              />
              Locations
            </label>
            <label>
              <input
                type="radio"
                name="searchType"
                value="episode"
                onChange={this.handleTypeChange}
                checked={this.state.searchType === "episode"}
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
