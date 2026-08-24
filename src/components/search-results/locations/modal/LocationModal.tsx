import { Component, type ReactNode } from "react";
import type { Location } from "../../../types/types";

type LocationModalProps = {
  location: Location;
  onCloseModal: () => void;
  //   onCharacterSelect: (character: Character) => void;
};

class LocationModal extends Component<LocationModalProps> {
  render(): ReactNode {
    return (
      <div className="modal" onClick={this.props.onCloseModal}>
        <div
          className="location-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="location-modal__close"
            aria-label="Close modal"
            onClick={this.props.onCloseModal}
          >
            ×
          </button>
          <div className="location-modal__content">
            <h2 className="location-modal__name">{this.props.location.name}</h2>
            <p className="location-card__type">{this.props.location.type}</p>
            <p className="location-card__dimension">
              {this.props.location.dimension}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default LocationModal;
