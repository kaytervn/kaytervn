import { Tooltip } from 'react-tooltip';
import { User } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Button với tooltip */}
      <button data-tooltip-id="profile-tooltip" data-tooltip-content="Profile">
        <User size={24} className="hover:scale-110 transition-transform" />
      </button>

      {/* Tooltip component */}
      <Tooltip id="profile-tooltip" />
    </div>
  );
};

export default Home;
