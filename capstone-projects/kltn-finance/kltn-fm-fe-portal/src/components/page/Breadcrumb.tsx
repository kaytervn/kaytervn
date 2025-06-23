import { useNavigate } from "react-router-dom";

const Breadcrumb = ({ items }: any) => {
  const navigate = useNavigate();

  return (
    <nav className="text-gray-100 font-semibold">
      <ul className="flex space-x-2">
        {items.map((item: any, index: number) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="px-2">/</span>}
            <span
              className={`py-1 px-2 rounded-lg ${
                item.path || item.onClick
                  ? "cursor-pointer hover:bg-gray-700 hover:text-gray-200"
                  : "text-blue-400 font-semibold"
              }`}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  navigate(item.path, { state: item.state });
                }
              }}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
