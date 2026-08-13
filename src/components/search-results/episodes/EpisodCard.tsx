import { Component, type ReactNode } from "react";
import type { Episode } from "../../types/types";

type EpisodeCardProps = {
  episode: Episode;
  onSelect: (episode: Episode) => void;
};

class EpisodesCard extends Component<EpisodeCardProps> {
  render(): ReactNode {
    const { episode } = this.props;

    return (
      <li className="episode-card">
        <button
          className="episode-card__button"
          type="button"
          onClick={() => this.props.onSelect(episode)}
        >
          <div className="episode-card__content">
            <div className="episode-card__meta">
              <span className="episode-card__code">{episode.episode}</span>

              <span className="episode-card__characters">
                {episode.characters.length} characters
              </span>
            </div>

            <h2 className="episode-card__name">{episode.name}</h2>

            <p className="episode-card__date">
              <span>Air date</span>
              {episode.air_date}
            </p>
          </div>
        </button>
      </li>
    );
  }
}

export default EpisodesCard;
