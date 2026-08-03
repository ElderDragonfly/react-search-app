import { Component, type ReactNode } from "react";
import type { CharactersListProps } from "./types";
import CharacterCard from "./CharacterCard";

class CharactersList extends Component<CharactersListProps> {
  render(): ReactNode {
    return (
      <ul>
        {this.props.characters.map((character) => {
          return <CharacterCard key={character.id} {...character} />;
        })}
      </ul>
    );
  }
}

export default CharactersList;
