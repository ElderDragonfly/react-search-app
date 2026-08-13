import { Component, type ReactNode } from "react";
import type { Episode, EpisodeListProps } from "../../types/types";
import EpisodesCard from "./EpisodCard";

type EpisodeListState = {
  selectedEpisode: Episode | null;
};

class EpisodesList extends Component<EpisodeListProps, EpisodeListState> {
  // Изначально никакая карточка не выбрана
  state: EpisodeListState = {
    selectedEpisode: null,
  };
  // Callback для выбора карточки по клину на ней
  handleSelecteEpisodeCard = (episode: Episode) => {
    this.setState({ selectedEpisode: episode });
  };
  // Закрытие модального окна
  handleModalClose = () => {
    this.setState({ selectedEpisode: null });
  };

  render(): ReactNode {
    return (
      <>
        {/* // При выборе персонажа создаётся модальное окно */}
        {/* {this.state.selectedLocation && (
          <CharacterModal
            character={this.state.selectedCharacter}
            onCloseModal={this.handleModalClose}
          />
        )} */}
        <ul className="search__results--episode episode-list">
          {this.props.episodesData.map((episode) => {
            return (
              <EpisodesCard
                key={episode.id}
                onSelect={this.handleSelecteEpisodeCard}
                episode={episode}
              />
            );
          })}
        </ul>
        {/* <div className="search__results--pagination">
          {this.handlePagination()}
        </div> */}
      </>
    );
  }
}

export default EpisodesList;
