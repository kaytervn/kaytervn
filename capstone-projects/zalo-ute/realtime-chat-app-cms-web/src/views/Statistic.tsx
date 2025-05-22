import { useState } from "react";
import Header from "../components/Header";
import SelectBox from "../components/SelectBox";
import Sidebar from "../components/Sidebar";
import UserStatistic from "../components/statistic/UserStatistic";
import ConversationStatistic from "../components/statistic/ConversationStatistic";
import PostStatistic from "../components/statistic/PostStatistic";

const Statistic = () => {
  const [searchValues, setSearchValues] = useState({
    category: "0",
  });

  return (
    <>
      <Sidebar
        activeItem="statistic"
        renderContent={
          <>
            <Header
              createDisabled={true}
              SearchBoxes={
                <>
                  <SelectBox
                    width="400px"
                    onChange={(value: any) =>
                      setSearchValues({
                        ...searchValues,
                        category: value,
                      })
                    }
                    options={[
                      { value: "0", name: "Thống kê người dùng" },
                      { value: "1", name: "Thống kê cuộc trò chuyện" },
                      { value: "2", name: "Thống kê bài đăng" },
                    ]}
                    labelKey="name"
                    valueKey="value"
                  />
                </>
              }
            />
            {searchValues.category == "0" ? (
              <UserStatistic />
            ) : searchValues.category == "1" ? (
              <ConversationStatistic />
            ) : (
              <PostStatistic />
            )}
          </>
        }
      />
    </>
  );
};

export default Statistic;
