import { Component, type ReactNode } from "react";
import type { Character, Episode } from "../../../types/types";
import fetchResults from "../../../../api/apiClient";

type EpisodeModalProps = {
  episode: Episode;
  onCloseModal: () => void;
  onCharacterSelect: (character: Character) => void;
};

type EpisodeModalState = {
  characters: Character[];
};

class EpisodesModal extends Component<EpisodeModalProps, EpisodeModalState> {
  state: Readonly<EpisodeModalState> = {
    characters: [],
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
    if (characterIds.length === 0) return;
    try {
      // Отправляем запрос с id персонажей
      const characterData = await fetchResults("characters", characterIds);
      // Записываем данные о персонажах в state locationModal
      this.setState({
        characters: Array.isArray(characterData.results)
          ? characterData.results
          : [characterData.results],
      });
    } catch (error) {
      console.error(error);
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
              {this.renderCharactersLinks(this.state.characters)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EpisodesModal;
