export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export interface CreateProps {
  onClick: () => void;
}

export interface AppBarProps {
  title: string;
  children: React.ReactNode;
  search?: SearchProps;
  create?: CreateProps;
}
