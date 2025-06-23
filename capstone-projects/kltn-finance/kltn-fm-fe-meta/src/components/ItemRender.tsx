import { UserIcon } from "lucide-react";
import {
  convertUtcToVn,
  getEnumItem,
  getMediaImage,
  getNestedValue,
} from "../services/utils";
import { ALIGNMENT, STATUS_MAP } from "../services/constant";
import { useGlobalContext } from "./GlobalProvider";
import { parse } from "date-fns";

const basicRender = ({ content, align = ALIGNMENT.LEFT }: any) => {
  return (
    <span className={`text-gray-300 p-4 text-${align} whitespace-nowrap`}>
      {content}
    </span>
  );
};

const renderImage = ({
  label = "Ảnh",
  accessor = "avatarPath",
  Icon = UserIcon,
  align = ALIGNMENT.LEFT,
  className = "ml-2",
}) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => (
      <div
        className={`${className} flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700`}
      >
        {getNestedValue(item, accessor) ? (
          <img
            src={getMediaImage(getNestedValue(item, accessor))}
            className="object-cover"
          />
        ) : (
          <Icon size={20} className={`text-white`} />
        )}
      </div>
    ),
  };
};

const renderEnum = ({
  label = "Trạng thái",
  accessor = "status",
  align = ALIGNMENT.CENTER,
  dataMap = STATUS_MAP,
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const value: any = getEnumItem(dataMap, getNestedValue(item, accessor));
      return (
        <div className={`text-${align}`}>
          <span
            className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap text-sm ${value.className}`}
          >
            {value.label}
          </span>
        </div>
      );
    },
  };
};

const renderHrefLink = ({
  label = "Họ và tên",
  accessor = "fullName",
  align = ALIGNMENT.LEFT,
  onClick,
  role,
}: any) => {
  const { hasRoles } = useGlobalContext();

  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      if (!onClick || (role && !hasRoles(role))) {
        return basicRender({
          content: getNestedValue(item, accessor),
          align,
        });
      }
      return (
        <a
          className={`text-blue-600 hover:underline p-4 text-${align} whitespace-nowrap hover:cursor-pointer`}
          onClick={() => onClick(item)}
        >
          {getNestedValue(item, accessor)}
        </a>
      );
    },
  };
};

const renderActionButton = ({
  label = "Hành động",
  accessor = "action",
  align = ALIGNMENT.CENTER,
  role,
  renderChildren,
}: any) => {
  const { hasAnyRoles } = useGlobalContext();

  if (role && !hasAnyRoles(role)) {
    return null;
  }

  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      return (
        <span className="flex items-center text-center justify-center space-x-2">
          {renderChildren?.(item)}
        </span>
      );
    },
  };
};

const renderLastLogin = ({
  label = "Lần đăng nhập cuối",
  accessor = "lastLogin",
  align = ALIGNMENT.LEFT,
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const dateString = convertUtcToVn(getNestedValue(item, accessor));
      const lastLogin = dateString
        ? parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date())
        : null;

      if (!lastLogin) {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: "Không có dữ liệu",
        });
      }

      const daysAgo = Math.ceil(
        (new Date().getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
      );

      const isRecent = daysAgo <= 1;
      const isWarning = daysAgo > 1 && daysAgo <= 7;
      const isOld = daysAgo > 7 && daysAgo <= 30;
      const isVeryOld = daysAgo > 30;

      return (
        <div className="flex items-center space-x-2 py-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              isRecent
                ? "bg-green-900/20 text-green-300"
                : isWarning
                ? "bg-yellow-900/20 text-yellow-300"
                : isOld
                ? "bg-orange-900/20 text-orange-300"
                : "bg-red-900/20 text-red-300"
            }`}
          >
            {dateString}
          </span>
        </div>
      );
    },
  };
};

export {
  basicRender,
  renderImage,
  renderEnum,
  renderHrefLink,
  renderActionButton,
  renderLastLogin,
};
