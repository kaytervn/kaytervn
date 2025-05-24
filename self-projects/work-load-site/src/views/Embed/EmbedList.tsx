/* eslint-disable react-hooks/exhaustive-deps */
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

const EmbedList = ({
  pageConfig = EMBED_STUFF,
  embedList = EMBED_LIST,
}: any) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(embedList);

  useEffect(() => {
    document.title = pageConfig.label;
  }, []);

  useEffect(() => {
    const lower = searchValue.toLowerCase();
    setFilteredData(
      embedList.filter((item: any) => item.label.toLowerCase().includes(lower))
    );
  }, [searchValue]);

  return (
    <Sidebar
      activeItem={pageConfig.name}
      breadcrumbs={[{ label: pageConfig.label }]}
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
