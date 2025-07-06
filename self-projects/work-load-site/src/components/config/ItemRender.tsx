import { ALIGNMENT, GRID_TRUNCATE } from "../../types/constant";
import {
  convertAlignment,
  getEnumItem,
  getNestedValue,
  truncateString,
} from "../../types/utils";

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
  label = "Trạng thái",
  accessor = "status",
  align = ALIGNMENT.CENTER,
  dataMap,
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
}: any) => {
  return {
    label,
    accessor,
    align,
    render: (item: any) => {
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
  label = "Action",
  accessor = "action",
  align = ALIGNMENT.CENTER,
  renderChildren,
}: any) => {
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
  label = "Tên",
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
  renderEnum,
  renderHrefLink,
  renderActionButton,
  renderIconField,
  renderMoneyField,
  renderTextAreaField,
};
