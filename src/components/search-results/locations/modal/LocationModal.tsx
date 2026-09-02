import { Component, type ReactNode } from "react";
import type { Character, Location } from "../../../types/types";
import fetchResults from "../../../../api/apiClient";

type LocationModalProps = {
  location: Location;
  onCloseModal: () => void;
};

type LocationModalState = {
  characters: Character[];
};

class LocationModal extends Component<LocationModalProps, LocationModalState> {
  state: Readonly<LocationModalState> = {
    characters: [],
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
  rederCharactersLinks = (characters: Character[]) => {
    return (
      <ul className="location-modal__characters">
        {characters.map((character) => {
          return (
            <li key={character.id} className="location-modal__characters-item">
              {/* При клике на эпизод вызываем коллбэк запроса App */}
              <a
                className="location-modal__character-name"
                // onClick={() => this.props.onEpisodeSelect(episode)}
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
              {this.rederCharactersLinks(this.state.characters)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LocationModal;
