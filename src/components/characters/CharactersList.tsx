import { Component, type ReactNode } from "react";
import type { CharactersCardsList as CharactersListProps } from "./charactersType";
import CharacterCard from "./CharacterCard";

class CharactersList extends Component<CharactersListProps> {
  render(): ReactNode {
    return (
      <ul>
        {this.props.CharactersCards.map((character) => {
          return <CharacterCard key={character.id} {...character} />;
        })}
      </ul>
    );
  }
}

export default CharactersList;
