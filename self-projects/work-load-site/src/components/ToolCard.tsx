const ToolCard = ({ item, onButtonClick }: any) => {
  return (
    <div
      onClick={onButtonClick}
      className="hover:cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl relative group"
      style={{
        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
      }}
    >
      <div className="h-40 p-6 flex flex-col justify-between relative z-10">
        <div className="absolute top-4 left-4 opacity-25 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110">
          {item.icon && <item.icon className="w-16 h-16 text-white" />}
        </div>

        <div className="flex flex-col h-full justify-between">
          <div className="flex justify-end">
            <h2 className="text-2xl font-bold text-white tracking-tight text-end">
              {item.label}
            </h2>
          </div>

          <div className="w-full flex justify-end">
            <div className="w-12 h-1 bg-white opacity-50 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-20 bg-white"></div>
      <div className="absolute top-0 left-0 w-16 h-16 rounded-br-full opacity-10 bg-black"></div>
    </div>
  );
};

export default ToolCard;
