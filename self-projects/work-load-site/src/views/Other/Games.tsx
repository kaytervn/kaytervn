/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Sidebar from "../../components/main/Sidebar";
import {
  FIGHTING_GAME,
  GAMES,
  MULTIROOM_PLATFORMER,
  THREE_D_RACING_GAME,
} from "../../types/pageConfig";
import ToolCard from "../../components/ToolCard";
import Header from "../../components/swagger/Header";
import {
  CarFrontIcon,
  LayoutTemplateIcon,
  SearchIcon,
  SwordsIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InputBox } from "../../components/form/InputTextField";
import { NoData } from "../../components/NoData";
import { normalizeVietnamese } from "../../types/utils";

const Games = () => {
  const navigate = useNavigate();
  const data = [
    {
      label: FIGHTING_GAME.label,
      icon: SwordsIcon,
      color: "#A35454",
      onButtonClick: () => navigate(FIGHTING_GAME.path),
    },
    {
      label: MULTIROOM_PLATFORMER.label,
      icon: LayoutTemplateIcon,
      color: "#7B5C7F",
      onButtonClick: () => navigate(MULTIROOM_PLATFORMER.path),
    },
    {
      label: THREE_D_RACING_GAME.label,
      icon: CarFrontIcon,
      color: "#6A8B87",
      onButtonClick: () => navigate(THREE_D_RACING_GAME.path),
    },
  ];
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState<any>(data);

  useEffect(() => {
    document.title = GAMES.label;
  }, []);

  useEffect(() => {
    const lowercasedValue = normalizeVietnamese(searchValue);
    const filtered = data.filter((item: any) =>
      normalizeVietnamese(item.label).includes(lowercasedValue)
    );
    setFilteredData(filtered);
  }, [searchValue]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Sidebar
      activeItem={GAMES.name}
      breadcrumbs={[{ label: GAMES.label }]}
      renderContent={
        <>
          <Header
            SearchBoxes={
              <InputBox
                placeholder="Searching..."
                icon={SearchIcon}
                value={searchValue}
                onChangeText={handleSearch}
              />
            }
          />
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.map((item: any) => (
                <ToolCard
                  key={item.label}
                  item={item}
                  onButtonClick={item.onButtonClick}
                />
              ))}
            </div>
          ) : (
            <NoData />
          )}
        </>
      }
    />
  );
};

export default Games;
