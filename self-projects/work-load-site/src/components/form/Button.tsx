import { PenLineIcon, TrashIcon } from "lucide-react";
import { BUTTON_TEXT } from "../../types/constant";
import { ActionButton } from "../main/GridView";

const Button = ({ onPress, title = "SAMPLE", icon: Icon }: any) => {
  return (
    <button
      onClick={onPress}
      className="bg-blue-500 flex items-center justify-center text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition duration-200"
    >
      {Icon && <Icon className="mr-2" size={20} color="#fff" />}
      <span className="font-semibold text-lg text-center">{title}</span>
    </button>
  );
};

const SubmitButton = ({ text, onClick, color = "royalblue" }: any) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 rounded-md text-gray-200 text-center font-semibold hover:opacity-90 whitespace-nowrap`}
      style={{
        backgroundColor: color,
      }}
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

const BasicActionButton = ({
  onClick,
  Icon,
  buttonText,
  color = "royalblue",
}: any) => {
  return (
    <ActionButton
      onClick={onClick}
      Icon={Icon}
      title={buttonText}
      color={color}
    />
  );
};

const ActionEditButton = ({ onClick }: any) => {
  return (
    <ActionButton
      onClick={onClick}
      Icon={PenLineIcon}
      title={BUTTON_TEXT.UPDATE}
      color="royalblue"
    />
  );
};

const ActionDeleteButton = ({ onClick }: any) => {
  return (
    <ActionButton
      onClick={onClick}
      Icon={TrashIcon}
      title={BUTTON_TEXT.DELETE}
      color="crimson"
    />
  );
};

const Button2 = ({ onPress, title = "SAMPLE", icon: Icon }: any) => {
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

const OptionButton = ({ label, onClick }: any) => {
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
  Button2,
  SubmitButton,
  CancelButton,
  BasicActionButton,
  ActionEditButton,
  ActionDeleteButton,
  OptionButton,
};
