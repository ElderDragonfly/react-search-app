import { Component, type ReactNode } from "react";
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

type CharacterListState = {
  selectedCharacter: Character | null;
};

class CharactersList extends Component<
  CharactersListProps,
  CharacterListState
> {
  // Изначально никакая карточка не выбрана
  state: CharacterListState = {
    selectedCharacter: null,
  };
  // Callback для выбора карточки по клину на ней
  handleSelectCharacterCard = (character: Character) => {
    this.setState({ selectedCharacter: character });
  };
  // Закрытие модального окна
  handleModalClose = () => {
    this.setState({ selectedCharacter: null });
  };

  render(): ReactNode {
    return (
      <>
        {/* // При выборе персонажа создаётся модальное окно */}
        {this.state.selectedCharacter && (
          <CharacterModal
            character={this.state.selectedCharacter}
            onCloseModal={this.handleModalClose}
            onEpisodeSelect={this.props.onEpisodeSelect}
            onLocationSelect={this.props.onLocationSelect}
          />
        )}
        <ul className="search__results--characters characters-list">
          {this.props.characters.map((character) => {
            return (
              <CharacterCard
                key={character.id}
                loading={this.props.loading}
                onSelect={this.handleSelectCharacterCard}
                character={character}
              />
            );
          })}
        </ul>
        <div className="search__results--pagination">
          <Pagination {...this.props.paginationProps} />
        </div>
      </>
    );
  }
}

export default CharactersList;
