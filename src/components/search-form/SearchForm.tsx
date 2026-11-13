import {
  type ChangeEvent,
  type SubmitEvent,
  useState,
} from "react";
import type { SearchType } from "../types/types";

type SearchProps = {
  searchValue: string;
  searchType: SearchType;
  loading: boolean;
  hasSearched: boolean;
  onSearchTypeChange: (searchType: SearchType) => void;
  onSearch: (searchValue: string) => void;
};

function SearchForm(props: SearchProps) {
  // Задаём начальные значения state
  const [query, setQuery] = useState("");

  // Метод сохраняет текущее значение поля в state
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  // Метод вызывает переданный колбек с отправкой формы
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearch(query);
    // Очищаем поле ввода после отправки формы
    setQuery("");
  };

  return (
    <>
      <form role="search" className="search__form" onSubmit={handleSubmit}>
        <div className="search__input-wrapper">
          <input
            type="search"
            className="search__input"
            // Placeholder меняется вместе с изменением state
            placeholder={`Search ${props.searchType}...`}
            onChange={handleChange}
            // Для очистки после нажатия кнопки отправки
            value={query}
          />
          <button
            type="submit"
            className="search__button"
            disabled={props.loading}
          >
            {props.loading ? "Loading..." : "Search"}
          </button>
        </div>

        <div className="search__query-summary">
          {props.hasSearched ? (
            <>
              Results for{" "}
              <span className="search__query-value">"{props.searchValue}"</span>{" "}
              in {props.searchType}
            </>
          ) : (
            "Search to see results"
          )}
        </div>

        <fieldset className="search__type-wrapper" disabled={props.loading}>
          <label className="search__label">
            <input
              type="radio"
              name="searchType"
              value="character"
              className="search__type"
              onChange={() => {
                props.onSearchTypeChange("characters");
                setQuery("");
              }}
              checked={props.searchType === "characters"}
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
                props.onSearchTypeChange("locations");
                setQuery("");
              }}
              checked={props.searchType === "locations"}
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
                props.onSearchTypeChange("episodes");
                setQuery("");
              }}
              checked={props.searchType === "episodes"}
            />
            Episodes
          </label>
        </fieldset>
      </form>
    </>
  );
}

export default SearchForm;
