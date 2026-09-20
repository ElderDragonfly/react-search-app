import { Component, type ReactNode } from "react";
import type { Character, Episode, ErrorInfo } from "../../../types/types";
import fetchResults from "../../../../api/apiClient";
import { handleError } from "../../../../api/errors/ApiError";

type EpisodeModalProps = {
  episode: Episode;
  onCloseModal: () => void;
  onCharacterSelect: (character: Character) => void;
};

type EpisodeModalState = {
  characters: Character[];
  error: ErrorInfo;
  loading: boolean;
};

class EpisodesModal extends Component<EpisodeModalProps, EpisodeModalState> {
  state: Readonly<EpisodeModalState> = {
    characters: [],
    error: null,
    loading: true,
  };
  // После первого рендера модального окна загружаем персонажей локации
  componentDidMount(): void {
    this.handleCharactersLinks(this.props.episode);
  }
  // Обрабатываем ссылки на персонажей из эпизода и записываем их в state
  handleCharactersLinks = async (episode: Episode) => {
    // Извлекаем ссылки на персонажей из данных location
    const characterUrls: string[] = episode.characters;
    // Извлекаем id персонажей
    const characterIds: number[] = characterUrls.map((episodeUrl) => {
      return Number(episodeUrl.split("/").at(-1));
    });
    // Если персонажей в эпизоде нет запрос не отправляем
    if (characterIds.length === 0) {
      this.setState({ loading: false });
      return;
    }
    try {
      // Отправляем запрос с id персонажей
      const characterData = await fetchResults("characters", characterIds);
      // Записываем данные о персонажах в state locationModal
      this.setState({
        characters: characterData.results,
      });
    } catch (error) {
      const errorInfo = handleError(error);
      this.setState({ error: errorInfo });
    } finally {
      this.setState({ loading: false });
    }
  };
  // Подготавливаем информацию из ссылок на персонажей для рендера
  renderCharactersLinks = (characters: Character[]) => {
    return (
      <ul className="episode-modal__characters">
        {characters.map((character) => {
          return (
            <li key={character.id} className="episode-modal__character-item">
              {/* При клике на эпизод вызываем коллбэк запроса App */}
              <a
                className="episode-modal__character-name"
                onClick={() => this.props.onCharacterSelect(character)}
              >
                {character.name}
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
          className="episode-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="episode-modal__close"
            aria-label="Close modal"
            onClick={this.props.onCloseModal}
          >
            ×
          </button>
          <div className="episode-modal__content">
            <h2 className="episode-modal__name">{this.props.episode.name}</h2>

            <p className="episode-modal__detail">
              <span className="episode-modal__date">
                Date: {this.props.episode.air_date}
              </span>
            </p>

            <p className="episode-modal__detail">
              <span className="episode-modal__season">
                Season: {this.props.episode.episode}
              </span>
            </p>

            <div className="episode-modal__characters-section">
              <span className="episode-modal__label">Characters:</span>
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
                this.renderCharactersLinks(this.state.characters)}
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

export default EpisodesModal;
