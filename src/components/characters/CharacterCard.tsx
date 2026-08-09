import { Component, type ReactNode } from "react";
import type { Character } from "../types/types";

type CharacterCardProps = {
  character: Character;
  onSelect: (character: Character) => void;
};

class CharacterCard extends Component<CharacterCardProps> {
  render(): ReactNode {
    return (
      <li className="character-card">
        <button onClick={() => this.props.onSelect(this.props.character)}>
          <img
            className="character-card__image"
            src={this.props.character.image}
            alt={this.props.character.name}
          />

          <div className="character-card__content">
            <h2 className="character-card__name">
              {this.props.character.name}
            </h2>

            <p
              className={`character-card__status character-card__status--${this.props.character.status.toLowerCase()}`}
            >
              {this.props.character.status}
            </p>

            <p className="character-card__detail">
              <span className="character-card__label">Species:</span>
              {this.props.character.species}
            </p>

            <p className="character-card__detail">
              <span className="character-card__label">Gender:</span>
              {this.props.character.gender}
            </p>
          </div>
        </button>
      </li>
    );
  }
}

export default CharacterCard;
