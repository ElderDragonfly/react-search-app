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
  characters: Character[];
};

// Типы для выбора где искать персонаж/локация/эпизод
export type SearchType = "character" | "location" | "episode";
