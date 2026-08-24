import type { ReactNode } from "react";

// Типы для выбора где искать персонаж/локация/эпизод
export type SearchType = "characters" | "locations" | "episodes";

export type ResultsInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

// Типы для персонажей
export type Character = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
};

export type CharactersListProps = {
  charactersInfo: ResultsInfo;
  characters: Character[];
  currentPage: number;
  renderPagination: () => ReactNode;
  onEpisodeSelect: (episode: Episode) => void;
  onLocationSelect: (locationId: number) => void;
};

// Типы для локаций

export type Location = {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
};

export type LocationsListProps = {
  locationsInfo: ResultsInfo;
  locationsData: Location[];
  currentPage: number;
  // onPaginationChange: (currentPage: number) => void;
};

// Типы для эпизодов

export type Episode = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
};

export type EpisodeListProps = {
  episodeInfo: ResultsInfo;
  episodesData: Episode[];
  currentPage: number;
};
