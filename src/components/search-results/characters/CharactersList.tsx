import {useState} from "react";
import type { Character, PaginationProps, Episode } from "../../types/types";
import CharacterCard from "./CharacterCard";
import CharacterModal from "./modal/CharacterModal";
import Pagination from "../../pagination/Pagination";

type CharactersListProps = {
  characters: Character[];
  loading: boolean;
  paginationProps: PaginationProps;
  onEpisodeSelect: (episode: Episode) => void;
  onLocationSelect: (locationId: number) => void;
};

function CharactersList(props: CharactersListProps) {
  // Изначально никакая карточка не выбрана
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  // Callback для выбора карточки по клину на ней
  const handleSelectCharacterCard = (character: Character) => {
    setSelectedCharacter(character);
  };
  // Закрытие модального окна
  const handleModalClose = () => {
    setSelectedCharacter(null);
  };

  return (
    <>
      {/* // При выборе персонажа создаётся модальное окно */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onCloseModal={handleModalClose}
          onEpisodeSelect={props.onEpisodeSelect}
          onLocationSelect={props.onLocationSelect}
        />
      )}
      <ul className="search__results--characters characters-list">
        {props.characters.map((character) => {
          return (
            <CharacterCard
              key={character.id}
              loading={props.loading}
              onSelect={handleSelectCharacterCard}
              character={character}
            />
          );
        })}
      </ul>
      <div className="search__results--pagination">
        <Pagination {...props.paginationProps} />
      </div>
    </>
  );
}

export default CharactersList;
