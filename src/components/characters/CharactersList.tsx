import { Component, type ReactNode } from "react";
import type { CharactersListProps } from "../types/types";
import CharacterCard from "./CharacterCard";

class CharactersList extends Component<CharactersListProps> {
  handlepagination = () => {
    // Определяем текущую страницу
    // если есть следующая страница, то текущая равна следующая - 1
    if (this.props.charactersInfo.next) {
      const currentPageNumber: number =
        Number(this.props.charactersInfo.next.at(-1)) - 1;
    }
    // если есть предыдущая страница, то текущая равна следующая + 1
    else if (this.props.charactersInfo.prev) {
      const currentPageNumber: number =
        Number(this.props.charactersInfo.prev.at(-1)) + 1;
    }
    // если нет не следующей не предыдущей, то страница одна
    else {
      const currentPageNumber: number = 1;
    }

    return <div className="pagination__button">{}</div>;
  };

  render(): ReactNode {
    return (
      <>
        <ul className="search__results--characters characters-list">
          {this.props.characters.map((character) => {
            return <CharacterCard key={character.id} {...character} />;
          })}
        </ul>
        <div className="search__results--pagination"></div>
      </>
    );
  }
}

export default CharactersList;
