import { Component, type ReactNode } from "react";
import type { Character, Episode, ErrorInfo } from "../../../types/types";
import fetchResults from "../../../../api/apiClient";
import { handleError } from "../../../../api/errors/ApiError";

type CharacterModalProps = {
  character: Character;
  onCloseModal: () => void;
  onEpisodeSelect: (episode: Episode) => void;
  onLocationSelect: (locationId: number) => void;
};

type CharacterModalState = {
  episodes: Episode[];
  error: ErrorInfo;
  loading: boolean;
};

class CharacterModal extends Component<
  CharacterModalProps,
  CharacterModalState
> {
  state: Readonly<CharacterModalState> = {
    episodes: [],
    loading: true,
    error: null,
  };

  // После первого рендера модального окна загружаем эпизоды персонажа
  componentDidMount(): void {
    this.handleEpisodeLinks(this.props.character);
  }

  // Обрабатываем ссылки на эпизоды с персонажами из props и записываем их в state
  handleEpisodeLinks = async (character: Character) => {
    const episodesUrls: string[] = character.episode;
    const episodesIds: number[] = episodesUrls.map((episodeUrl) => {
      return Number(episodeUrl.split("/").at(-1));
    });
    try {
      const episodesData = await fetchResults("episodes", episodesIds);

      this.setState({
        episodes: episodesData.results,
      });
    } catch (error) {
      const errorInfo = handleError(error);
      this.setState({ error: errorInfo });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleLocationLink = () => {
    const locationId = Number(
      this.props.character.location.url.split("/").at(-1),
    );
    // Если локация неизвестна, не будет вызываться коллбэк
    if (locationId === 0) return;
    // Если локация известна, вызывается коллбэк
    this.props.onLocationSelect(locationId);
  };

  // Подготавливаем информацию из ссылок на эпизоды для рендера
  renderEpisodeLinks = (episodes: Episode[]) => {
    return (
      <ul className="character-modal__episodes">
        {episodes.map((episode) => {
          return (
            <li key={episode.id} className="character-modal__episode-item">
              <span className="character-modal__season">
                Season: {Number(episode.episode.match(/(?<=S)\d+/)?.[0])}
              </span>
              <span className="character-modal__number">
                Episode: {Number(episode.episode.match(/(?<=E)\d+/)?.[0])}
              </span>
              {/* При клике на эпизод вызываем коллбэк запроса App */}
              <a
                className="character-modal__episode-name"
                onClick={() => this.props.onEpisodeSelect(episode)}
              >
                {episode.name}
              </a>
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
                <a onClick={this.handleLocationLink}>
                  {this.props.character.location.name}
                </a>
              </span>
            </p>

            <div className="character-modal__detail character-modal__detail--episodes">
              <span className="character-modal__label">Episodes:</span>
              {this.state.loading && (
                <div
                  className="modal__message modal__message--loading"
                  role="status"
                >
                  Loading...
                </div>
              )}
              {this.state.loading === false &&
                this.state.error === null &&
                this.renderEpisodeLinks(this.state.episodes)}
              {this.state.error && (
                <div
                  className="modal__message modal__message--error"
                  role="alert"
                >
                  {this.state.error.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CharacterModal;
