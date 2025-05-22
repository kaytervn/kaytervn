import useModal from "../../../hooks/useModal";
import TableRowComponentHeader from "./TableRowComponentHeader";
import HeaderForm from "./HeaderForm";
import { truncateString } from "../../../types/utils";
import { NoData } from "../../NoData";

const ListHeadersComponent = ({ handleRemove, handleEdit, headers }: any) => {
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();

  const columns = [
    {
      accessor: "name",
      align: "left",
      render: (item: any) => (
        <span className="space-x-2">
          <span
            className="bg-gray-700 rounded-lg p-1"
            style={{ fontWeight: 600 }}
          >
            {truncateString(item.key, 50)}
          </span>
          <span>{truncateString(item.value, 50)}</span>
        </span>
      ),
    },
  ];

  const onEditButtonClick = (index: any, header: any) => {
    showModal({
      title: "Edit Header",
      color: "blue",
      buttonText: "EDIT",
      onButtonClick: (header: any) => {
        handleEdit(index, header);
        hideModal();
      },
      initForm: {
        ...header,
      },
    });
  };

  return (
    <>
      <div className="space-y-4 text-gray-300">
        {headers.length > 0 ? (
          <TableRowComponentHeader
            headers={headers}
            columns={columns}
            handleRemove={handleRemove}
            handleEdit={onEditButtonClick}
          />
        ) : (
          <NoData />
        )}
      </div>
      <HeaderForm
        isVisible={isModalVisible}
        hideModal={hideModal}
        formConfig={formConfig}
      />
    </>
  );
};

export default ListHeadersComponent;
