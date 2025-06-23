import { PenLineIcon, RotateCcwIcon, TrashIcon } from "lucide-react";
import { ActionButton } from "../page/GridView";
import { BUTTON_TEXT } from "../../services/constant";
import { useGlobalContext } from "../GlobalProvider";

const SubmitButton = ({ text, onClick, color = "royalblue" }: any) => {
  return (
    <button
      onClick={onClick}
      className="py-2 px-3 rounded-md text-gray-200 text-center font-semibold hover:opacity-90 whitespace-nowrap"
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  );
};

const CancelButton = ({ text = BUTTON_TEXT.CANCEL, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="py-2 px-3 rounded-md bg-gray-600 text-gray-200 text-center font-semibold hover:bg-gray-500 whitespace-nowrap"
    >
      {text}
    </button>
  );
};

const ActionResetMfaButton = ({ onClick, role }: any) => {
  return (
    <ActionButton
      onClick={onClick}
      Icon={RotateCcwIcon}
      role={role}
      title={BUTTON_TEXT.RESET_MFA}
      color="mediumseagreen"
    />
  );
};

const ActionEditButton = ({ onClick, role }: any) => {
  return (
    <ActionButton
      onClick={onClick}
      Icon={PenLineIcon}
      role={role}
      title={BUTTON_TEXT.UPDATE}
      color="royalblue"
    />
  );
};

const ActionDeleteButton = ({ onClick, role }: any) => {
  return (
    <ActionButton
      onClick={onClick}
      Icon={TrashIcon}
      role={role}
      title={BUTTON_TEXT.DELETE}
      color="crimson"
    />
  );
};

const Button = ({ onPress, title = "SAMPLE", icon: Icon }: any) => {
  return (
    <button
      onClick={onPress}
      className="whitespace-nowrap bg-blue-500 flex items-center justify-center text-white p-2 rounded w-full hover:bg-blue-700 transition duration-200"
    >
      {Icon && <Icon className="mr-2" size={20} color="#fff" />}
      <span className="font-semibold text-lg text-center">{title}</span>
    </button>
  );
};

const OptionButton = ({ label, onClick, role }: any) => {
  const { hasRoles } = useGlobalContext();

  if (role && !hasRoles(role)) {
    return null;
  }

  return (
    <button
      className="flex w-full items-center px-4 py-2 text-left text-sm text-white hover:bg-gray-800 whitespace-nowrap"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export {
  Button,
  SubmitButton,
  CancelButton,
  ActionEditButton,
  ActionDeleteButton,
  ActionResetMfaButton,
  OptionButton,
};
