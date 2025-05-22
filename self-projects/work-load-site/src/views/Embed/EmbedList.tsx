import { useEffect, useState } from "react";
import Sidebar from "../../components/main/Sidebar";
import { EMBED_STUFF } from "../../types/pageConfig";
import ToolCard from "../../components/ToolCard";
import Header from "../../components/swagger/Header";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InputBox } from "../../components/form/InputTextField";
import { NoData } from "../../components/NoData";
import { EMBED_LIST } from "../../components/config/EmbedConfig";

const EmbedList = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(EMBED_LIST);

  useEffect(() => {
    document.title = EMBED_STUFF.label;
  }, []);

  useEffect(() => {
    const lower = searchValue.toLowerCase();
    setFilteredData(
      EMBED_LIST.filter((item) => item.label.toLowerCase().includes(lower))
    );
  }, [searchValue]);

  return (
    <Sidebar
      activeItem={EMBED_STUFF.name}
      breadcrumbs={[{ label: EMBED_STUFF.label }]}
      renderContent={
        <>
          <Header
            SearchBoxes={
              <InputBox
                placeholder="Searching..."
                icon={SearchIcon}
                value={searchValue}
                onChangeText={setSearchValue}
              />
            }
          />
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.map((item: any) => (
                <ToolCard
                  key={item.label}
                  item={item}
                  onButtonClick={() => navigate(item.path)}
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

export default EmbedList;
