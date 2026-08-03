import { Component, type ReactNode } from "react";
import type { Character } from "./types";

class CharacterCard extends Component<Character> {
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
