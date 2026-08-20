import { Component, type ReactNode } from "react";
import type { Character, Episode } from "../../../types/types";
import request from "../../../../api/apiClient";

type CharacterModalProps = {
  character: Character;
  onCloseModal: () => void;
};

type CharacterModalState = {
  episode: Episode[];
};

class CharacterModal extends Component<
  CharacterModalProps,
  CharacterModalState
> {
  state: Readonly<CharacterModalState> = {
    episode: [],
  };

  componentDidMount(): void {
    this.handleEpisodeLinks(this.props.character);
  }

  // Обрабатываем ссылки на эпизоды с персонажами из props
  handleEpisodeLinks = async (character: Character) => {
    const episodesUrls: string[] = character.episode;
    const episodesIds: number[] = episodesUrls.map((episodeUrl) => {
      return Number(episodeUrl.split("/").at(-1));
    });
    try {
      const episodesData = await request(`/episode/${episodesIds}`);

      this.setState({
        episode: Array.isArray(episodesData) ? episodesData : [episodesData],
      });
    } catch (error) {
      console.error(error);
    }
  };

  renderEpisodeLinks = (episodes: Episode[]) => {
    return (
      <ul className="character-modal__episodes">
        {episodes.map((episode) => {
          return (
            <li key={episode.id} className="character-modal__episode">
              <a href="#">{episode.name}</a>
            </li>
          );
        })}
      </ul>
    );
  };

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

            <div className="character-modal__detail">
              <span className="character-modal__episode">Episodes:</span>
              {this.renderEpisodeLinks(this.state.episode)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CharacterModal;
