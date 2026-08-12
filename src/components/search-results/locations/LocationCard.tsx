import { Component, type ReactNode } from "react";
import type { Location } from "../../types/types";

type LocationCardProps = {
  location: Location;
  onSelect: (location: Location) => void;
};

class LocationCard extends Component<LocationCardProps> {
  render(): ReactNode {
    return (
      <li className="location-card">
        <button onClick={() => this.props.onSelect(this.props.location)}>
          <div className="location-card__content">
            <h2 className="location-card__name">{this.props.location.name}</h2>

            <p className="location-card__type">{this.props.location.type}</p>

            <p className="location-card__dimension">
              {this.props.location.dimension}
            </p>

            <p className="location-card__residents">
              {<a href="#">first resident</a>}
            </p>
          </div>
        </button>
      </li>
    );
  }
}

export default LocationCard;
