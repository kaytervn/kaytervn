import React from 'react';

const StoryItem = ({ imageUrl, userDisplayName, onClick }: any) => {
    return (
        <div
            onClick={onClick}
            className="w-40 h-80 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden shadow-lg flex flex-col justify-between items-center cursor-pointer"
        >
            <img src={imageUrl} alt={userDisplayName} className="w-full h-3/4 object-cover" />
            <p className="text-xs text-center mt-2">{userDisplayName}</p>
        </div>
    );
};

export default StoryItem;
