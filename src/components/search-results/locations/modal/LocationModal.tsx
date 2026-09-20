import { Component, type ReactNode } from "react";
import type { Character, Location, ErrorInfo } from "../../../types/types";
import fetchResults from "../../../../api/apiClient";
import { handleError } from "../../../../api/errors/ApiError";

type LocationModalProps = {
  location: Location;
  onCloseModal: () => void;
  onCharacterSelect: (character: Character) => void;
};

type LocationModalState = {
  characters: Character[];
  error: ErrorInfo;
  loading: boolean;
};

class LocationModal extends Component<LocationModalProps, LocationModalState> {
  state: Readonly<LocationModalState> = {
    characters: [],
    error: null,
    loading: true,
  };
  // После первого рендера модального окна загружаем персонажей локации
  componentDidMount(): void {
    this.handleCharactersLinks(this.props.location);
  }
  // Обрабатываем ссылки на персонажей из локации и записываем их в state
  handleCharactersLinks = async (location: Location) => {
    // Извлекаем ссылки на персонажей из данных location
    const characterUrls: string[] = location.residents;
    // Извлекаем id персонажей
    const characterIds: number[] = characterUrls.map((episodeUrl) => {
      return Number(episodeUrl.split("/").at(-1));
    });
    // Если персонажей на локации нет запрос не отправляем
    if (characterIds.length === 0) {
      this.setState({ loading: false });
      return;
    }
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
      const errorInfo = handleError(error);
      this.setState({ error: errorInfo });
    } finally {
      this.setState({ loading: false });
    }
  };
  // Подготавливаем информацию из ссылок на персонажей для рендера
  renderCharactersLinks = (characters: Character[]) => {
    return (
      <ul className="location-modal__characters">
        {characters.map((character) => {
          return (
            <li key={character.id} className="location-modal__characters-item">
              {/* При клике на эпизод вызываем коллбэк запроса App */}
              <a
                className="location-modal__character-name"
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
          className="location-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="location-modal__close"
            aria-label="Close modal"
            onClick={this.props.onCloseModal}
          >
            ×
          </button>
          <div className="location-modal__content">
            <h2 className="location-modal__name">{this.props.location.name}</h2>
            <p className="location-modal__type">{this.props.location.type}</p>
            <p className="location-modal__dimension">
              {this.props.location.dimension}
            </p>
            <div className="location-modal__residents">
              <span className="location-modal__label">Characters:</span>
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

export default LocationModal;
