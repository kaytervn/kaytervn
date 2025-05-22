/* eslint-disable @typescript-eslint/no-explicit-any */

const Button = ({ onPress, title, color, icon: Icon }: any) => {
  return (
    <button
      className="w-full py-3 rounded-lg mt-3 flex flex-row justify-center items-center"
      style={{ backgroundColor: color }}
      onClick={onPress}
    >
      {Icon && <Icon className="mr-2" size={20} color="#fff" />}
      <span className="text-center text-white font-semibold text-lg">
        {title}
      </span>
    </button>
  );
};

export default Button;
