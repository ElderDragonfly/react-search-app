import { Component, type ReactNode } from "react";
import type { Character, CharactersListProps } from "../../types/types";
import CharacterCard from "./CharacterCard";
import CharacterModal from "../modal/CharacterModal";

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
  handleSelecteCharacterCard = (character: Character) => {
    this.setState({ selectedCharacter: character });
  };
  // Закрытие модального окна
  handleModalClose = () => {
    this.setState({ selectedCharacter: null });
  };

  // Управление пагинацией
  handlePagination = () => {
    const currentPage: number = this.props.currentPage;
    const pages: number = this.props.charactersInfo.pages;
    return (
      this.props.characters.length > 0 && (
        <>
          {/* Стрелка для пролистывания пагинации к началу */}
          <button
            className="pagination__button"
            disabled={currentPage === 1}
            onClick={() => {
              if (currentPage - 1 >= 1) {
                this.props.onPaginationChange(this.props.currentPage - 1);
              }
            }}
          >
            &lt;
          </button>
          {/* Если страница не первая, покажет показвается пагинация на 1ю страницу */}
          {currentPage > 1 &&
            currentPage - 1 !== 1 &&
            currentPage - 2 !== 1 && (
              <>
                {" "}
                <button
                  className="pagination__button"
                  onClick={() => {
                    this.props.onPaginationChange(1);
                  }}
                >
                  1
                </button>
                {/* // Точки при непоказанных страницах пагинации */}
                {currentPage - 2 > 2 && <span>...</span>}
              </>
            )}
          {/* Если есть предыдущая страница отобразит и её */}
          {currentPage - 2 >= 1 && (
            <button
              className="pagination__button"
              onClick={() => {
                this.props.onPaginationChange(currentPage - 2);
              }}
            >
              {this.props.currentPage - 2}
            </button>
          )}
          {/* Если есть ещё предыдущая страница отобразит и её */}
          {currentPage - 1 >= 1 && (
            <button
              className="pagination__button"
              onClick={() => {
                this.props.onPaginationChange(currentPage - 1);
              }}
            >
              {this.props.currentPage - 1}
            </button>
          )}
          {/* Если есть персонажи, отображает номер текущей страницы */}
          <button
            className="pagination__button pagination__button--active"
            disabled
          >
            {this.props.currentPage}
          </button>
          {/* Если есть следующая страница отобразит и её */}
          {currentPage + 1 <= pages && (
            <button
              className="pagination__button"
              onClick={() => {
                this.props.onPaginationChange(currentPage + 1);
              }}
            >
              {this.props.currentPage + 1}
            </button>
          )}
          {/* Если есть ещё страница отобразит и её */}
          {currentPage + 2 <= pages && (
            <>
              <button
                className="pagination__button"
                onClick={() => {
                  this.props.onPaginationChange(currentPage + 2);
                }}
              >
                {this.props.currentPage + 2}
              </button>
              {/* // Точки при непоказанных страницах пагинации */}
              {currentPage + 2 < pages - 1 && <span>...</span>}
            </>
          )}
          {/* Если страница не последняя,
          покажет показвается пагинация на последнюю страницу */}
          {currentPage < pages &&
            currentPage + 1 !== pages &&
            currentPage + 2 !== pages && (
              <>
                {" "}
                <button
                  className="pagination__button"
                  onClick={() => {
                    this.props.onPaginationChange(
                      this.props.charactersInfo.pages,
                    );
                  }}
                >
                  {this.props.charactersInfo.pages}
                </button>
              </>
            )}
          {/* Стрелка для пролистывания пагинации к концу */}
          <button
            className={"pagination__button"}
            disabled={currentPage === pages}
            onClick={() => {
              if (currentPage + 1 <= pages) {
                this.props.onPaginationChange(this.props.currentPage + 1);
              }
            }}
          >
            &gt;
          </button>
        </>
      )
    );
  };

  render(): ReactNode {
    return (
      <>
        {/* // При выборе персонажа создаётся модальное окно */}
        {this.state.selectedCharacter && (
          <CharacterModal
            character={this.state.selectedCharacter}
            onCloseModal={this.handleModalClose}
          />
        )}
        <ul className="search__results--characters characters-list">
          {this.props.characters.map((character) => {
            return (
              <CharacterCard
                key={character.id}
                onSelect={this.handleSelecteCharacterCard}
                character={character}
              />
            );
          })}
        </ul>
        <div className="search__results--pagination">
          {this.handlePagination()}
        </div>
      </>
    );
  }
}

export default CharactersList;
