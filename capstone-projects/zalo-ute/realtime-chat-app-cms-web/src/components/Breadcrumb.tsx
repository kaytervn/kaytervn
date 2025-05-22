const Breadcrumb = ({
  currentView,
  setView,
  listLabel = "samplelabel",
  detailLabel = "samplelabel",
}: any) => {
  return (
    <>
      {currentView === "detail" && (
        <nav className="text-gray-500">
          <ul className="flex space-x-2">
            <li
              className="cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              onClick={() => setView("list")}
            >
              {listLabel}
            </li>
            <>
              <li className="p-1 rounded-lg">/</li>
              <li className="text-blue-500 p-1 font-semibold">{detailLabel}</li>
            </>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Breadcrumb;
