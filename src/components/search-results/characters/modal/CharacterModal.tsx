import { Component, type ReactNode } from "react";
import type { Character } from "../../../types/types";

type CharacterModalProps = {
  character: Character;
  onCloseModal: () => void;
};

class CharacterModal extends Component<CharacterModalProps> {
  render(): ReactNode {
    return (
      <div className="modal" onClick={this.props.onCloseModal}>
        <div
          className="character-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="character-modal__close"
            aria-label="Close modal"
            onClick={this.props.onCloseModal}
          >
            ×
          </button>
          <img
            className="character-modal__image"
            src={this.props.character.image}
            alt={this.props.character.name}
          />
          <div className="character-modal__content">
            <h2 className="character-modal__name">
              {this.props.character.name}
            </h2>

            <p
              className={`character-modal__status character-modal__status--${this.props.character.status.toLowerCase()}`}
            >
              {this.props.character.status}
            </p>

            <p className="character-modal__detail">
              <span className="character-modal__label">Species:</span>
              {this.props.character.species}
            </p>

            <p className="character-modal__detail">
              <span className="character-modal__label">Gender:</span>
              {this.props.character.gender}
            </p>

            <p className="character-modal__detail">
              <span className="character-modal__location">
                Location:
                <a href="#">{this.props.character.location.name}</a>
              </span>
            </p>

            <p className="character-modal__detail">
              <span className="character-modal__episode">
                Episode:
                <a href="#">placeholder</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default CharacterModal;
