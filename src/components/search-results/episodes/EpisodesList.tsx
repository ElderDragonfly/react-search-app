import { Component, type ReactNode } from "react";
import type { Episode, Character, PaginationProps } from "../../types/types";
import EpisodeCard from "./EpisodeCard";
import EpisodesModal from "./modal/EpisodesModal";
import Pagination from "../../pagination/Pagination";

type EpisodeListProps = {
  episodesData: Episode[];
  loading: boolean;
  paginationProps: PaginationProps;
  onCharacterSelect: (character: Character) => void;
};

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
        {this.state.selectedEpisode && (
          <EpisodesModal
            episode={this.state.selectedEpisode}
            onCloseModal={this.handleModalClose}
            onCharacterSelect={this.props.onCharacterSelect}
          />
        )}
        <ul className="search__results--episode episode-list">
          {this.props.episodesData.map((episode) => {
            return (
              <EpisodeCard
                key={episode.id}
                loading={this.props.loading}
                onSelect={this.handleSelecteEpisodeCard}
                episode={episode}
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

export default EpisodesList;
