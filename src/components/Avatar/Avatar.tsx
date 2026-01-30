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
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        background: "#eee",
        flexShrink: 0,
      }}
    >
      <img
        src={safeSrc}
        alt="avatar"
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallback(name);
        }}
      />
    </div>
  );
};

export default Avatar;
