import {useState} from "react";
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

function EpisodesList(props: EpisodeListProps) {
  // Изначально никакая карточка не выбрана
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  // Callback для выбора карточки по клину на ней
  const handleSelecteEpisodeCard = (episode: Episode) => {
    setSelectedEpisode(episode);
  };
  // Закрытие модального окна
  const handleModalClose = () => {
    setSelectedEpisode(null);
  };

  return (
    <>
      {/* // При выборе персонажа создаётся модальное окно */}
      {selectedEpisode && (
        <EpisodesModal
          episode={selectedEpisode}
          onCloseModal={handleModalClose}
          onCharacterSelect={props.onCharacterSelect}
        />
      )}
      <ul className="search__results--episode episode-list">
        {props.episodesData.map((episode) => {
          return (
            <EpisodeCard
              key={episode.id}
              loading={props.loading}
              onSelect={handleSelecteEpisodeCard}
              episode={episode}
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

export default EpisodesList;
