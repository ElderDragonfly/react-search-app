import { Component, type ReactNode } from "react";
import type { Location } from "../../types/types";

type LocationCardProps = {
  location: Location;
  loading: boolean;
  onSelect: (location: Location) => void;
};

class LocationCard extends Component<LocationCardProps> {
  render(): ReactNode {
    return (
      <li
        className={`location-card${this.props.loading ? " location-card--disabled" : ""}`}
      >
        <button
          onClick={() => this.props.onSelect(this.props.location)}
          disabled={this.props.loading}
        >
          <div className="location-card__content">
            <h2 className="location-card__name">{this.props.location.name}</h2>

            <p className="location-card__type">{this.props.location.type}</p>

            <p className="location-card__dimension">
              {this.props.location.dimension}
            </p>

            <p className="location-card__residents">Residents &#9660;</p>
          </div>
        </button>
      </li>
    );
  }
}

export default LocationCard;
