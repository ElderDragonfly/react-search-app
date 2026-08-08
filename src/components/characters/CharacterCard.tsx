import { Component, type ReactNode } from "react";
import type { Character } from "../types/types";

class CharacterCard extends Component<Character> {
  render(): ReactNode {
    return (
      <li className="character-card">
        <img
          className="character-card__image"
          src={this.props.image}
          alt={this.props.name}
        />

        <div className="character-card__content">
          <h2 className="character-card__name">{this.props.name}</h2>

          <p
            className={`character-card__status character-card__status--${this.props.status.toLowerCase()}`}
          >
            {this.props.status}
          </p>

          <p className="character-card__detail">
            <span className="character-card__label">Species:</span>
            {this.props.species}
          </p>

          <p className="character-card__detail">
            <span className="character-card__label">Gender:</span>
            {this.props.gender}
          </p>
        </div>
      </li>
    );
  }
}

export default CharacterCard;
