import {
  Component,
  type ReactNode,
  type ChangeEvent,
  type SubmitEvent,
} from "react";

type SearchProps = {
  onSearch: (searchValue: string) => void;
};

type SearchState = {
  query: string;
  placeholder: string;
};

class SearchInput extends Component<SearchProps, SearchState> {
  state: SearchState = {
    query: "",
    placeholder: "Search characters...",
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
        </form>
      </>
    );
  }
}

export default SearchInput;
