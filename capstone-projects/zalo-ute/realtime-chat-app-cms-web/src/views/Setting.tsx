import { useEffect, useState } from "react";
import Table from "../components/Table";
import { LoadingDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import Header from "../components/Header";
import InputBox from "../components/InputBox";
import Sidebar from "../components/Sidebar";
import SelectBox from "../components/SelectBox";
import { CheckIcon, XIcon } from "lucide-react";
import { settingKey } from "../types/constant";
import UpdateSetting from "../components/setting/UpdateSetting";
import { useGlobalContext } from "../types/context";

const Setting = () => {
  const [data, setData] = useState([]);
  const { profile } = useGlobalContext();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [settingId, setSettingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const columns = [
    { label: "Tiêu đề", accessor: "title", align: "left" },
    {
      label: "Giá trị",
      accessor: "value",
      align: "center",
      render: (item: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${
            (item.keyName === settingKey.VERIFY_PUBLIC_POSTS ||
              item.keyName === settingKey.VERIFY_FRIEND_POSTS) &&
            item.value === 1
              ? "bg-green-100 text-blue-800"
              : (item.keyName === settingKey.VERIFY_PUBLIC_POSTS ||
                  item.keyName === settingKey.VERIFY_FRIEND_POSTS) &&
                item.value === 0
              ? "bg-red-100 text-red-800"
              : "bg-gray-50 text-gray-800"
          }`}
        >
          {item.keyName === settingKey.VERIFY_PUBLIC_POSTS ||
          item.keyName === settingKey.VERIFY_FRIEND_POSTS ? (
            <>
              {item.value === 1 ? (
                <>
                  <CheckIcon size={16} />
                  Bật
                </>
              ) : (
                <>
                  <XIcon size={16} />
                  Tắt
                </>
              )}
            </>
          ) : (
            <span>{item.value}</span>
          )}
        </span>
      ),
    },
    {
      label: "Ngày cập nhật",
      accessor: "updatedAt",
      align: "center",
    },
  ];
  const { get, loading } = useFetch();
  const [searchValues, setSearchValues] = useState({
    title: "",
    roleKind: "1",
  });

  const getData = async () => {
    const query: any = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchValues.title) {
      query.title = searchValues.title;
    }
    if (searchValues.roleKind) {
      query.roleKind = searchValues.roleKind;
    }
    const res = await get("/v1/setting/list", query);
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const handleRefreshData = async () => {
    setCurrentPage(0);
    await getData();
  };

  const handleChangeRoleKind = async (roleKind: any) => {
    setCurrentPage(0);
    const query: any = {
      page: 0,
      size: itemsPerPage,
      title: searchValues.title,
      roleKind: roleKind,
    };
    const res = await get("/v1/setting/list", query);
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  const handleClear = async () => {
    setSearchValues({ ...searchValues, title: "" });
    setCurrentPage(0);
    const res = await get("/v1/setting/list", {
      page: 0,
      size: itemsPerPage,
      roleKind: searchValues.roleKind,
    });
    setData(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  return (
    <>
      <Sidebar
        activeItem="setting"
        renderContent={
          <>
            <Header
              createDisabled={true}
              onSearch={handleRefreshData}
              onClear={handleClear}
              SearchBoxes={
                <>
                  <InputBox
                    value={searchValues.title}
                    onChangeText={(value: any) =>
                      setSearchValues({ ...searchValues, title: value })
                    }
                    placeholder="Tiêu đề..."
                  />
                  <SelectBox
                    width="200px"
                    onChange={async (value: any) => {
                      const searchData = {
                        ...searchValues,
                        roleKind: value,
                      };
                      setSearchValues(searchData);
                      await handleChangeRoleKind(value);
                    }}
                    options={[
                      { value: "1", name: "Người dùng" },
                      { value: "2", name: "Quản lý" },
                      { value: "3", name: "Quản trị viên" },
                    ]}
                    labelKey="name"
                    valueKey="value"
                  />
                </>
              }
            />
            <Table
              data={data}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              totalPages={totalPages}
              onEdit={(id: any) => {
                setSettingId(id);
                setUpdateModalVisible(true);
              }}
              disableEditCondition={(item: any) =>
                item.roleKind === 3 && profile.role.kind !== 3
              }
            />
          </>
        }
      />
      <LoadingDialog isVisible={loading} />
      <UpdateSetting
        isVisible={updateModalVisible}
        setVisible={setUpdateModalVisible}
        settingId={settingId}
        onButtonClick={handleClear}
      />
    </>
  );
};

export default Setting;
