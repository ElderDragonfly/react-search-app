import { Component, type ReactNode } from "react";
import type { Episode } from "../../../types/types";

type EpisodeModalProps = {
  episode: Episode;
  onCloseModal: () => void;
};

class EpisodesModal extends Component<EpisodeModalProps> {
  render(): ReactNode {
    return (
      <div className="modal" onClick={this.props.onCloseModal}>
        <div
          className="episode-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="episode-modal__close"
            aria-label="Close modal"
            onClick={this.props.onCloseModal}
          >
            ×
          </button>
          <div className="episode-modal__content">
            <h2 className="episode-modal__name">{this.props.episode.name}</h2>

            <p className="episode-modal__detail">
              <span className="episode-modal__date">
                Date: {this.props.episode.air_date}
              </span>
            </p>

            <p className="episode-modal__detail">
              <span className="episode-characters">
                Characters:
                <a href="#">placeholder</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default EpisodesModal;
