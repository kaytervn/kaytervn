import { useEffect, useState } from "react";
import Table from "../components/Table";
import { ConfimationDialog, LoadingDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import userImg from "../assets/user_icon.png";
import useDialog from "../hooks/useDialog";
import { toast } from "react-toastify";
import Header from "../components/Header";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";
import UpdateUser from "../components/user/UpdateUser";
import CreateUser from "../components/user/CreateUser";
import Sidebar from "../components/Sidebar";
import VerifyEdit from "../components/user/VerifyEdit";
import { useGlobalContext } from "../types/context";

const User = () => {
  const { profile } = useGlobalContext();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [verifyEditModalVisible, setVerifyEditModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const { isDialogVisible, showDialog, hideDialog } = useDialog();
  const [deleteId, setDeleteId] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const columns = [
    {
      label: "Ảnh",
      accessor: "avatarUrl",
      align: "left",
      render: (item: any) => (
        <img
          className="w-10 object-cover h-10 rounded-full border-gray-300 border"
          src={item.avatarUrl ? item.avatarUrl : userImg}
        ></img>
      ),
    },
    { label: "Tên hiển thị", accessor: "displayName", align: "left" },
    {
      label: "Địa chỉ email",
      accessor: "email",
      align: "left",
      render: (item: any) => (
        <span>
          {profile.role.kind === 3 ? item.email : "********************"}
        </span>
      ),
    },
    {
      label: "Mã sinh viên",
      accessor: "studentId",
      align: "center",
      render: (item: any) => (
        <span>{profile.role.kind === 3 ? item.studentId : "********"}</span>
      ),
    },
    {
      label: "Số điện thoại",
      accessor: "phone",
      align: "center",
      render: (item: any) => (
        <span>{profile.role.kind === 3 ? item.phone : "**********"}</span>
      ),
    },
    {
      label: "Vai trò",
      accessor: "role",
      align: "center",
      render: (item: any) => <span>{item.role.name}</span>,
    },
    {
      label: "Trạng thái",
      accessor: "status",
      align: "center",
      render: (item: any) => (
        <span
          className={`px-2 py-1 rounded-md ${
            item.status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status === 1 ? "Hoạt động" : "Chưa kích hoạt"}
        </span>
      ),
    },
    {
      label: "Truy cập",
      accessor: "lastLogin",
      align: "center",
    },
  ];
  const { get, del, loading } = useFetch();
  const [searchValues, setSearchValues] = useState({
    displayName: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });
  const [roles, setRoles] = useState([]);

  const getData = async () => {
    const query: any = {
      page: currentPage,
      size: itemsPerPage,
    };
    if (searchValues.displayName) {
      query.displayName = searchValues.displayName;
    }
    if (searchValues.email) {
      query.email = searchValues.email;
    }
    if (searchValues.phone) {
      query.phone = searchValues.phone;
    }
    if (searchValues.role) {
      query.role = searchValues.role;
    }
    if (searchValues.status) {
      query.status = searchValues.status;
    }
    const userRes = await get("/v1/user/list", query);
    setData(userRes.data.content);
    setTotalPages(userRes.data.totalPages);
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const roleRes = await get(`/v1/role/list?isPaged=0`);
      setRoles(roleRes.data.content);
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async () => {
    hideDialog();
    const res = await del("/v1/user/delete/" + deleteId);
    if (res.result) {
      toast.success("Xóa thành công");
      await handleClear();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteDialog = (id: any) => {
    setDeleteId(id);
    showDialog();
  };

  const handleRefreshData = async () => {
    setCurrentPage(0);
    await getData();
  };

  const handleClear = async () => {
    setSearchValues({
      displayName: "",
      email: "",
      phone: "",
      role: "",
      status: "",
    });
    setCurrentPage(0);
    const userRes = await get("/v1/user/list", {
      page: 0,
      size: itemsPerPage,
    });
    setData(userRes.data.content);
    setTotalPages(userRes.data.totalPages);
  };

  const handleVerifyEdit = () => {
    setUserPhone(null);
    setVerifyEditModalVisible(false);
    setUpdateModalVisible(true);
  };

  return (
    <>
      <Sidebar
        activeItem="user"
        renderContent={
          <>
            <Header
              createDisabled={profile?.role?.kind !== 3}
              onCreate={() => {
                setCreateModalVisible(true);
              }}
              onClear={handleClear}
              onSearch={handleRefreshData}
              SearchBoxes={
                <>
                  <InputBox
                    value={searchValues.displayName}
                    onChangeText={(value: any) =>
                      setSearchValues({ ...searchValues, displayName: value })
                    }
                    placeholder="Tên hiển thị..."
                  />
                  <InputBox
                    value={searchValues.email}
                    onChangeText={(value: any) =>
                      setSearchValues({ ...searchValues, email: value })
                    }
                    placeholder="Địa chỉ email..."
                  />
                  <InputBox
                    value={searchValues.phone}
                    onChangeText={(value: any) =>
                      setSearchValues({ ...searchValues, phone: value })
                    }
                    placeholder="Số điện thoại..."
                  />
                  {roles && (
                    <SelectBox
                      onChange={(value: any) =>
                        setSearchValues({
                          ...searchValues,
                          role: value,
                        })
                      }
                      value={searchValues.role}
                      placeholder="Vai trò..."
                      options={roles}
                      labelKey="name"
                      valueKey="_id"
                    />
                  )}
                  <SelectBox
                    onChange={(value: any) =>
                      setSearchValues({
                        ...searchValues,
                        status: value,
                      })
                    }
                    placeholder="Trạng thái..."
                    options={[
                      { value: "0", name: "Chưa kích hoạt" },
                      { value: "1", name: "Hoạt động" },
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
              onEdit={(data: { id: any; phone: any }) => {
                setUserId(data.id);
                if (profile.role.kind === 3) {
                  setUpdateModalVisible(true);
                } else {
                  setUserPhone(data.phone);
                  setVerifyEditModalVisible(true);
                }
              }}
              onDelete={(id: any) => {
                handleDeleteDialog(id);
              }}
              disableEditCondition={(item: any) =>
                (profile.role.kind !== 3 && item.role.kind === 3) ||
                item._id === profile._id ||
                item.isSuperAdmin
              }
              disableDeleteCondition={(item: any) =>
                (profile.role.kind !== 3 && item.role.kind === 3) ||
                item._id === profile._id ||
                item.isSuperAdmin
              }
            />
          </>
        }
      />
      <LoadingDialog isVisible={loading} />
      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Xóa người dùng"
        message="Bạn có chắc muốn xóa người dùng này?"
        onConfirm={handleDelete}
        confirmText="Xóa"
        onCancel={hideDialog}
        color="red"
      />
      <UpdateUser
        isVisible={updateModalVisible}
        setVisible={setUpdateModalVisible}
        userId={userId}
        roles={roles}
        profileRoleKind={profile?.role.kind}
        onButtonClick={handleClear}
      />
      <VerifyEdit
        isVisible={verifyEditModalVisible}
        setVisible={setVerifyEditModalVisible}
        phone={userPhone}
        onButtonClick={handleVerifyEdit}
      />
      <CreateUser
        isVisible={createModalVisible}
        setVisible={setCreateModalVisible}
        userId={userId}
        roles={roles}
        onButtonClick={handleClear}
      />
    </>
  );
};

export default User;
