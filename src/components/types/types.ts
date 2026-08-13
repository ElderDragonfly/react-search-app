// Типы для выбора где искать персонаж/локация/эпизод
export type SearchType = "character" | "location" | "episode";

export type ResultsInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

// Типы для персонажей
export type CharactersInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

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
  charactersInfo: CharactersInfo;
  characters: Character[];
  currentPage: number;
  onPaginationChange: (currentPage: number) => void;
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
