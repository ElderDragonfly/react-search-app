import { Component, type ReactNode } from "react";
import type { ResultsInfo, Episode, Character } from "../../types/types";
import EpisodesCard from "./EpisodCard";
import EpisodesModal from "./modal/EpisodesModal";

type EpisodeListProps = {
  episodeInfo: ResultsInfo;
  episodesData: Episode[];
  currentPage: number;
  onCharacterSelect: (character: Character) => void;
  renderPagination: () => ReactNode;
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
              <EpisodesCard
                key={episode.id}
                onSelect={this.handleSelecteEpisodeCard}
                episode={episode}
              />
            );
          })}
        </ul>
        <div className="search__results--pagination">
          {this.props.renderPagination()}
        </div>
      </>
    );
  }
}

export default EpisodesList;
