import { Component, type ReactNode } from "react";
import type { Location, LocationsListProps } from "../../types/types";
import LocationCard from "./LocationCard";

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
        {/* // При выборе персонажа создаётся модальное окно */}
        {/* {this.state.selectedLocation && (
          <CharacterModal
            character={this.state.selectedCharacter}
            onCloseModal={this.handleModalClose}
          />
        )} */}
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
        {/* <div className="search__results--pagination">
          {this.handlePagination()}
        </div> */}
      </>
    );
  }
}

export default LocationsList;
