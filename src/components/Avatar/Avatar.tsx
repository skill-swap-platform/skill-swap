import React from 'react';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
}

const fallback = (name: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    name || "user"
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const Avatar: React.FC<AvatarProps> = ({ src, name = "User", size = 40 }) => {
  const safeSrc = src?.trim() ? src : fallback(name);

  return (
    <div
      className="rounded-full overflow-hidden bg-gray-200 flex-shrink-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <img
        src={safeSrc}
        alt="avatar"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallback(name);
        }}
      />
    </div>
  );
};

export default Avatar;
