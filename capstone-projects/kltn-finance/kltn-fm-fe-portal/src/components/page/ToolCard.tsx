const ToolCard = ({ item, onButtonClick }: any) => {
  return (
    <div
      onClick={onButtonClick}
      className="hover:cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(45deg, ${item.color}, ${item.color}dd)`,
      }}
    >
      <div className="h-40 relative flex flex-col justify-between p-4">
        <div className="opacity-25">
          {item.icon ? <item.icon className="w-16 h-16 text-white" /> : null}
        </div>
        <h2 className="text-3xl font-bold text-gray-300 tracking-tight whitespace-nowrap">
          {item.label}
        </h2>
      </div>
    </div>
  );
};

export default ToolCard;
