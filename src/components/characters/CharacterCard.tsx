import { Component, type ReactNode } from "react";
import type { CharacterCard as CharacterCardProps } from "./charactersType";

class CharacterCard extends Component<CharacterCardProps> {
  render(): ReactNode {
    return (
      <li>
        <img src={this.props.image} alt="character image" />
        <p>{this.props.name}</p>
      </li>
    );
  }
}

export default CharacterCard;
