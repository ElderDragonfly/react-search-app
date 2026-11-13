import { useState } from "react";
import type { Location, Character, PaginationProps } from "../../types/types";
import LocationCard from "./LocationCard";
import LocationModal from "./modal/LocationModal";
import Pagination from "../../pagination/Pagination";

type LocationsListProps = {
  locationsData: Location[];
  loading: boolean;
  paginationProps: PaginationProps;
  onCharacterSelect: (character: Character) => void;
};

function LocationsList(props: LocationsListProps) {
  // Изначально никакая карточка не выбрана
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  // Callback для выбора карточки по клину на ней
  const handleSelecteLocationCard = (location: Location) => {
    setSelectedLocation(location);
  };
  // Закрытие модального окна
  const handleModalClose = () => {
    setSelectedLocation(null);
  };

  return (
    <>
      {/* // При выборе локации создаётся модальное окно */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onCloseModal={handleModalClose}
          onCharacterSelect={props.onCharacterSelect}
        />
      )}
      <ul className="search__results--locations locations-list">
        {props.locationsData.map((location) => {
          return (
            <LocationCard
              key={location.id}
              loading={props.loading}
              onSelect={handleSelecteLocationCard}
              location={location}
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

export default LocationsList;
