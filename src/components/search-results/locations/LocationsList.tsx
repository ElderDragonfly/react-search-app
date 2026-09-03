import { Component, type ReactNode } from "react";
import type { ResultsInfo, Location, Character } from "../../types/types";
import LocationCard from "./LocationCard";
import LocationModal from "./modal/LocationModal";

type LocationsListProps = {
  locationsInfo: ResultsInfo;
  locationsData: Location[];
  currentPage: number;
  onCharacterSelect: (character: Character) => void;
  renderPagination: () => ReactNode;
};

type LocationListState = {
  selectedLocation: Location | null;
};

class LocationsList extends Component<LocationsListProps, LocationListState> {
  // Изначально никакая карточка не выбрана
  state: LocationListState = {
    selectedLocation: null,
  };
  // Callback для выбора карточки по клину на ней
  handleSelecteLocationCard = (location: Location) => {
    this.setState({ selectedLocation: location });
  };
  // Закрытие модального окна
  handleModalClose = () => {
    this.setState({ selectedLocation: null });
  };

  render(): ReactNode {
    return (
      <>
        {/* // При выборе локации создаётся модальное окно */}
        {this.state.selectedLocation && (
          <LocationModal
            location={this.state.selectedLocation}
            onCloseModal={this.handleModalClose}
            onCharacterSelect={this.props.onCharacterSelect}
          />
        )}
        <ul className="search__results--locations locations-list">
          {this.props.locationsData.map((location) => {
            return (
              <LocationCard
                key={location.id}
                onSelect={this.handleSelecteLocationCard}
                location={location}
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

export default LocationsList;
