import { Component, type ReactNode } from "react";
import type { Character } from "../types/types";

class CharacterCard extends Component<Character> {
  render(): ReactNode {
    return (
      <li className="character-card">
        <img src={this.props.image} alt="character image" />
        <p>{this.props.name}</p>
      </li>
    );
  }
}

export default CharacterCard;
