/* eslint-disable react-hooks/rules-of-hooks */
import { UserIcon } from "lucide-react";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  GRID_TRUNCATE,
  STATUS_MAP,
  VALID_PATTERN,
} from "../../types/constant";
import {
  convertAlignment,
  convertUtcToVn,
  getEnumItem,
  getNestedValue,
  parseDate,
  truncateString,
} from "../../types/utils";
import { parse } from "date-fns";
import { useGlobalContext } from "./GlobalProvider";
import { formatDistanceToNow } from "date-fns";

const basicRender = ({ content, align = ALIGNMENT.LEFT }: any) => {
  return (
    <span className={`text-gray-300 text-sm text-${align} whitespace-nowrap`}>
      {content}
    </span>
  );
};

const renderTextAreaField = ({
  label = "Note",
  accessor = "note",
  align = ALIGNMENT.LEFT,
  truncateLength = GRID_TRUNCATE,
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      return basicRender({
        align,
        content: truncateString(item.note, truncateLength),
      });
    },
  };
};

const renderEnum = ({
  label = "Status",
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

export const renderExpirationDateField = (
  dateStr: any,
  content: any,
  offsets = 30
) => {
  const expiredDate = parseDate(dateStr);
  if (!expiredDate) {
    return basicRender({ align: ALIGNMENT.LEFT, content });
  }
  expiredDate.setDate(expiredDate.getDate() + offsets);
  const now = new Date();
  const isExpired = expiredDate < now;
  const isWarning =
    !isExpired &&
    (expiredDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7;

  const timeText = isExpired
    ? `Expired ${formatDistanceToNow(expiredDate, { addSuffix: true })}`
    : `In ${formatDistanceToNow(expiredDate, { addSuffix: false })}`;

  return (
    <div className="flex items-center space-x-2 py-2">
      <span className="text-gray-300 text-sm text-left whitespace-nowrap">
        {content}
      </span>
      <span
        className={`text-xs whitespace-nowrap px-2 py-1 rounded-full ${
          isExpired
            ? "bg-red-900/20 text-red-300"
            : isWarning
            ? "bg-yellow-900/20 text-yellow-300"
            : "bg-green-900/20 text-green-300"
        }`}
      >
        {timeText}
      </span>
    </div>
  );
};

const renderHrefLink = ({
  label = "Full name",
  accessor = "fullName",
  align = ALIGNMENT.LEFT,
  onClick,
  color = "text-blue-600",
  role,
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const { hasAnyRoles } = useGlobalContext();
      const content = getNestedValue(item, accessor);

      if (role && !hasAnyRoles(role)) {
        return basicRender({
          content,
          align,
        });
      }

      return (
        <a
          title={content}
          className={`${color} hover:underline text-sm text-${align} whitespace-nowrap hover:cursor-pointer`}
          onClick={() => onClick(item)}
        >
          {truncateString(content, GRID_TRUNCATE)}
        </a>
      );
    },
  };
};

export const renderUrlField = ({
  label = "Full name",
  accessor = "platform.name",
  urlAccessor = "platform.url",
  align = ALIGNMENT.LEFT,
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const url = getNestedValue(item, urlAccessor);
      const content = getNestedValue(item, accessor);
      if (!url) {
        return basicRender({
          content,
        });
      }
      return (
        <a
          className={`text-blue-600 hover:underline text-sm text-left whitespace-nowrap hover:cursor-pointer`}
          title={url}
          onClick={() => window.open(url, "_blank")}
        >
          {content}
        </a>
      );
    },
  };
};

const renderActionButton = ({
  label = "Actions",
  accessor = "actions",
  align = ALIGNMENT.CENTER,
  renderChildren,
  role,
}: any) => {
  const { hasAnyRoles } = useGlobalContext();

  if (role && !hasAnyRoles(role.flat(Infinity))) {
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

const renderIconField = ({
  label = "Name",
  accessor = "name",
  iconMapField = "kind",
  align = ALIGNMENT.LEFT,
  dataMap,
  onClick,
}: any) => {
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
          <a
            onClick={() => onClick(item)}
            className="text-gray-300 text-sm hover:underline whitespace-nowrap hover:cursor-pointer"
          >
            {displayValue}
          </a>
        </div>
      );
    },
  };
};

const renderMoneyField = ({
  label = "Money",
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

const renderImage = ({
  label = "Avatar",
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
          <img src={getNestedValue(item, accessor)} className="object-cover" />
        ) : (
          <Icon size={20} className={`text-white text-sm`} />
        )}
      </div>
    ),
  };
};

const renderLastLogin = ({
  label = "Last login",
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
          content: BASIC_MESSAGES.NO_DATA,
        });
      }

      const daysAgo = Math.ceil(
        (new Date().getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
      );

      const isRecent = daysAgo <= 1;
      const isWarning = daysAgo > 1 && daysAgo <= 7;
      const isOld = daysAgo > 7 && daysAgo <= 30;

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
  label = "Color",
  accessor = "color",
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
          {isValidColor && (
            <span
              className="items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm"
              style={{
                backgroundColor: colorCode,
                color: textColor,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {colorCode.toUpperCase()}
            </span>
          )}
        </div>
      );
    },
  };
};

export const renderTagField = ({
  label = "Name",
  accessor = "name",
  align = ALIGNMENT.LEFT,
  colorCodeField = "",
  colorCodePosition = ALIGNMENT.LEFT,
  tagNameField = "",
}: any) => {
  const renderColor = (colorCode: any, label: any) => {
    if (!colorCode) {
      return null;
    }
    return (
      <span
        title={label}
        className="w-4 h-4 rounded"
        style={{ backgroundColor: colorCode }}
      />
    );
  };
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
      const value = getNestedValue(item, accessor);
      const colorCode = getNestedValue(item, colorCodeField);
      const label = getNestedValue(item, tagNameField);

      return (
        <div
          className={`text-${align} flex items-center space-x-2 whitespace-nowrap`}
        >
          {ALIGNMENT.LEFT == colorCodePosition && renderColor(colorCode, label)}
          <span className="text-gray-300 text-sm">{value}</span>
          {ALIGNMENT.RIGHT == colorCodePosition &&
            renderColor(colorCode, label)}
        </div>
      );
    },
  };
};

export {
  basicRender,
  renderEnum,
  renderHrefLink,
  renderActionButton,
  renderIconField,
  renderMoneyField,
  renderTextAreaField,
  renderImage,
  renderLastLogin,
  renderColorCode,
};
