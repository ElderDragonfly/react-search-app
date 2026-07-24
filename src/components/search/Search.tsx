import { Component, type ReactNode, type ChangeEvent } from "react";

type SearchState = {
  query: string;
  placeholder: string;
};

class SearchInput extends Component<object, SearchState> {
  state: SearchState = {
    query: "",
    placeholder: "Search characters...",
  };

  handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: event.currentTarget.value,
    });
    console.log(this.state.query);
  };

  render(): ReactNode {
    return (
      <>
        <form role="search" className="search__form">
          <div className="search__input-wrapper">
            <input
              type="search"
              className="search__input"
              placeholder={this.state.placeholder}
              onChange={this.handleSearch}
            />
          </div>
          <button className="search__button">Search</button>
        </form>
      </>
    );
  }
}

export default SearchInput;
