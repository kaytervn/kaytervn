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
  children: React.ReactNode;
  renderToolbar?: React.ReactNode;
}
