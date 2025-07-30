import { useEffect, useState } from "react";
import { useGlobalContext } from "../../config/GlobalProvider";
import useModal from "../../../hooks/useModal";
import {
  BANK_NUMBER_FIELD_CONFIG,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
} from "../../../types/constant";
import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { ConfirmationDialog } from "../Dialog";
import CreateObject from "./CreateObject";
import UpdateObject from "./UpdateObject";
import { normalizeVietnamese } from "../../../types/utils";

const JsonListField = ({
  title = "",
  isRequired = false,
  value = "[]",
  onChange,
  disabled = false,
  fieldConfig = BANK_NUMBER_FIELD_CONFIG,
}: any) => {
  const fieldLabel = title.toLowerCase();
  const { setToast } = useGlobalContext();
  const [items, setItems] = useState<{ name: string; note: string }[]>([]);
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const {
    isModalVisible: createFormVisible,
    showModal: showCreateForm,
    hideModal: hideCreateForm,
    formConfig: createFormConfig,
  } = useModal();
  const {
    isModalVisible: updateFormVisible,
    showModal: showUpdateForm,
    hideModal: hideUpdateForm,
    formConfig: updateFormConfig,
  } = useModal();

  useEffect(() => {
    try {
      const parsedItems = JSON.parse(value);
      if (Array.isArray(parsedItems)) {
        setItems(parsedItems);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateName = (name: string, excludeIndex?: number) => {
    return !items.some(
      (item, index) => item.name === name && index !== excludeIndex
    );
  };

  const sortItemsByName = (items: any[]) => {
    return [...items].sort((a, b) => {
      const nameA = normalizeVietnamese(a.name || "");
      const nameB = normalizeVietnamese(b.name || "");
      return nameA.localeCompare(nameB);
    });
  };

  const handleCreate = (newItem: any) => {
    const updatedItems = sortItemsByName([...items, newItem]);
    setItems(updatedItems);
    onChange(JSON.stringify(updatedItems));
    setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
  };

  const handleUpdate = (newItem: any) => {
    const editIndex = newItem.id;
    delete newItem.id;
    const updatedItems = sortItemsByName(
      items.map((item, index) => (index === editIndex ? newItem : item))
    );
    setItems(updatedItems);
    onChange(JSON.stringify(updatedItems));
    setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
  };

  const handleDelete = (index: number) => {
    hideDeleteDialog();
    const updatedItems = sortItemsByName(items.filter((_, i) => i !== index));
    setItems(updatedItems);
    onChange(JSON.stringify(updatedItems));
    setToast(BASIC_MESSAGES.DELETED, TOAST.SUCCESS);
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog({
      title: `Delete ${fieldLabel}`,
      message: "You want to delete?",
      color: "crimson",
      onConfirm: () => {
        hideDeleteDialog();
        handleDelete(id);
      },
      confirmText: BUTTON_TEXT.DELETE,
      onCancel: hideDeleteDialog,
    });
  };

  const onCreateButtonClick = () => {
    showCreateForm({
      title: `Create ${fieldLabel}`,
      onButtonClick: async (form: any) => {
        if (!validateName(form.name)) {
          setToast("Item existed", TOAST.ERROR);
          return;
        }
        hideCreateForm();
        handleCreate(form);
      },
      hideModal: hideCreateForm,
      initForm: {
        name: "",
        note: "",
      },
      fieldConfig,
    });
  };

  const onUpdateButtonClick = (id: any) => {
    const item = items[id];
    showUpdateForm({
      title: `Update ${fieldLabel}`,
      onButtonClick: async (form: any) => {
        if (!validateName(form.name, form.id)) {
          setToast("Item existed", TOAST.ERROR);
          return;
        }
        hideUpdateForm();
        handleUpdate(form);
      },
      hideModal: hideUpdateForm,
      initForm: {
        id,
        name: item.name || "",
        note: item.note || "",
      },
      fieldConfig,
    });
  };

  return (
    <div className="flex-1 items-center">
      <ConfirmationDialog
        isVisible={deleteDialogVisible}
        formConfig={deleteDialogConfig}
      />
      <CreateObject
        isVisible={createFormVisible}
        formConfig={createFormConfig}
      />
      <UpdateObject
        isVisible={updateFormVisible}
        formConfig={updateFormConfig}
      />
      <div className="flex items-center mb-2">
        {title && (
          <label className="text-base font-semibold text-gray-200 text-left flex items-center">
            {title}
            {isRequired && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}
        {!disabled && (
          <div className="ml-2">
            <button
              title={`Add new ${fieldLabel}`}
              onClick={onCreateButtonClick}
              className="font-bold flex rounded-full items-center p-1 bg-blue-700 text-white hover:bg-blue-600 transition-colors"
            >
              <PlusIcon size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-800 border border-gray-600 rounded-md"
          >
            <div className="flex truncate flex-row space-x-2">
              <span className="text-gray-200 font-medium">{item.name}</span>
              {item.note && (
                <p className="text-gray-400 text-sm truncate">{item.note}</p>
              )}
            </div>
            {!disabled && (
              <div className="flex flex-row space-x-2 items-center">
                <button
                  title="Edit"
                  onClick={() => onUpdateButtonClick(index)}
                  className="text-gray-400 hover:text-blue-400"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  title="Delete"
                  onClick={() => onDeleteButtonClick(index)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JsonListField;
