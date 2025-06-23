import { UserIcon } from "lucide-react";
import {
  convertAlignment,
  convertUtcToVn,
  getEnumItem,
  getMediaImage,
  getNestedValue,
} from "../../services/utils";
import {
  ALIGNMENT,
  KEY_KIND_MAP,
  STATUS_MAP,
  VALID_PATTERN,
} from "../../services/constant";
import { useGlobalContext } from "./GlobalProvider";
import { parse } from "date-fns";

const basicRender = ({ content, align = ALIGNMENT.LEFT }: any) => {
  return (
    <span className={`text-gray-300 text-sm text-${align} whitespace-nowrap`}>
      {content}
    </span>
  );
};

const renderImage = ({
  label = "Ảnh",
  accessor = "avatarPath",
  Icon = UserIcon,
  align = ALIGNMENT.LEFT,
}) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => (
      <div
        className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-700`}
      >
        {getNestedValue(item, accessor) ? (
          <img
            src={getMediaImage(getNestedValue(item, accessor))}
            className="object-cover"
          />
        ) : (
          <Icon size={20} className={`text-white text-sm`} />
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
            className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap text-xs ${value.className}`}
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
          className={`text-blue-600 hover:underline text-sm text-${align} whitespace-nowrap hover:cursor-pointer`}
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
        <span
          className={`flex items-center text-sm text-${align} justify-${convertAlignment(
            align
          )} space-x-1`}
        >
          {renderChildren?.(item)}
        </span>
      );
    },
  };
};

const renderLastLogin = ({
  label = "Lần đăng nhập cuối",
  accessor = "lastLogin",
  align = ALIGNMENT.CENTER,
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
          align,
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
        <div className={`flex items-center justify-${align} space-x-2 py-2`}>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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

const renderColorCode = ({
  label = "Mã màu",
  accessor = "colorCode",
  align = ALIGNMENT.CENTER,
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const colorCode =
        getNestedValue(item, accessor)?.toLowerCase() || "#000000";
      const isValidColor = VALID_PATTERN.COLOR_CODE.test(colorCode);

      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
      };
      const { r, g, b } = hexToRgb(colorCode);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const textColor = brightness > 128 ? "#1f2937" : "#ffffff";

      return (
        <div className={`text-${align}`}>
          {isValidColor ? (
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm"
              style={{
                backgroundColor: colorCode,
                color: textColor,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {colorCode.toUpperCase()}
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-400 bg-gray-800/50 whitespace-nowrap">
              Không hợp lệ
            </span>
          )}
        </div>
      );
    },
  };
};

const renderTagField = ({
  label = "Tên ghi chú",
  accessor = "name",
  align = ALIGNMENT.LEFT,
  colorCodeField = "",
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const value = getNestedValue(item, accessor);
      const colorCode = getNestedValue(item, colorCodeField);

      return (
        <div
          className={`text-${align} flex items-center space-x-2 whitespace-nowrap`}
        >
          {colorCode && (
            <span
              className="inline-block w-4 h-4 rounded"
              style={{ backgroundColor: colorCode }}
            />
          )}
          <span className="text-gray-300 text-sm">{value}</span>
        </div>
      );
    },
  };
};

const renderIconField = ({
  label = "Tên",
  accessor = "name",
  iconMapField = "kind",
  align = ALIGNMENT.LEFT,
  dataMap = KEY_KIND_MAP,
  role,
  onClick,
}: any) => {
  const { hasRoles } = useGlobalContext();
  const isHref = onClick && role && hasRoles(role);

  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const kindValue = getNestedValue(item, iconMapField);
      const displayValue = getNestedValue(item, accessor);
      const kind: any = Object.values(dataMap).find(
        (entry: any) => entry.value === kindValue
      );
      const IconComponent = kind.icon;

      return (
        <div
          className={`text-${align} flex items-center space-x-2 whitespace-nowrap`}
        >
          {IconComponent && (
            <span
              className={`${kind.textColor}`}
              title={kind.label || kindValue}
            >
              <IconComponent size={20} />
            </span>
          )}
          {isHref ? (
            <a
              onClick={() => onClick(item)}
              className="text-gray-300 text-sm hover:underline whitespace-nowrap hover:cursor-pointer"
            >
              {displayValue}
            </a>
          ) : (
            <span className="text-gray-300 text-sm">{displayValue}</span>
          )}
        </div>
      );
    },
  };
};

const renderMoneyField = ({
  label = "Số tiền",
  accessor = "amount",
  align = ALIGNMENT.RIGHT,
  currencySymbol = "đ",
}: any) => {
  const formatMoney = (val: string | number) => {
    if (!val && val !== 0) return `0 ${currencySymbol}`;

    const num = Math.round(parseFloat(val.toString().replace(/[^0-9.-]/g, "")));
    if (isNaN(num)) return `0 ${currencySymbol}`;

    const formattedInteger = num
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedInteger} ${currencySymbol}`;
  };

  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const value = getNestedValue(item, accessor);
      const formattedValue = formatMoney(value);

      return (
        <span
          className={`text-gray-300 text-sm text-${align} whitespace-nowrap`}
        >
          {formattedValue}
        </span>
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
  renderColorCode,
  renderTagField,
  renderIconField,
  renderMoneyField,
};
