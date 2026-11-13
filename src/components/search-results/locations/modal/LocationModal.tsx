import { useEffect, useState } from "react";
import type { Character, Location, ErrorInfo } from "../../../types/types";
import fetchResults from "../../../../api/apiClient";
import { handleError } from "../../../../api/errors/ApiError";

type LocationModalProps = {
  location: Location;
  onCloseModal: () => void;
  onCharacterSelect: (character: Character) => void;
};

function LocationModal(props: LocationModalProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState<ErrorInfo>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // После первого рендера модального окна загружаем персонажей локации
  useEffect(() => {
    // Обрабатываем ссылки на персонажей из локации и записываем их в state
    const handleCharactersLinks = async (location: Location) => {
      // Извлекаем ссылки на персонажей из данных location
      const characterUrls: string[] = location.residents;
      // Извлекаем id персонажей
      const characterIds: number[] = characterUrls.map((episodeUrl) => {
        return Number(episodeUrl.split("/").at(-1));
      });
      // Если персонажей на локации нет запрос не отправляем
      if (characterIds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        // Отправляем запрос с id персонажей
        const characterData = await fetchResults("characters", characterIds);
        // Записываем данные о персонажах в state locationModal
        setCharacters(characterData.results);
      } catch (error) {
        const errorInfo = handleError(error);
        setError(errorInfo);
      } finally {
        setLoading(false);
      }
    };

    handleCharactersLinks(props.location);
  }, [props.location]);
  // Подготавливаем информацию из ссылок на персонажей для рендера
  const renderCharactersLinks = (characters: Character[]) => {
    return (
      <ul className="location-modal__characters">
        {characters.map((character) => {
          return (
            <li key={character.id} className="location-modal__characters-item">
              {/* При клике на эпизод вызываем коллбэк запроса App */}
              <a
                className="location-modal__character-name"
                onClick={() => props.onCharacterSelect(character)}
              >
                {character.name}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="modal" onClick={props.onCloseModal}>
      <div
        className="location-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="location-modal__close"
          aria-label="Close modal"
          onClick={props.onCloseModal}
        >
          ×
        </button>
        <div className="location-modal__content">
          <h2 className="location-modal__name">{props.location.name}</h2>
          <p className="location-modal__type">{props.location.type}</p>
          <p className="location-modal__dimension">
            {props.location.dimension}
          </p>
          <div className="location-modal__residents">
            <span className="location-modal__label">Characters:</span>
            {loading && (
              <div
                className="modal__message modal__message--loading"
                role="status"
              >
                Loading...
              </div>
            )}
            {loading === false &&
              error === null &&
              renderCharactersLinks(characters)}
            {error && (
              <div
                className="modal__message modal__message--error"
                role="alert"
              >
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
