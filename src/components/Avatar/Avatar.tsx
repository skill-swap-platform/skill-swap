import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, name = "User", size = 40 }) => {
  const [error, setError] = useState(false);
  const hasImage = src?.trim() && !error;

  return (
    <div
      className="rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-100"
      style={{
        width: size,
        height: size,
      }}
    >
      {hasImage ? (
        <img
          src={src!}
          alt={name}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <User className="text-gray-400" style={{ width: size * 0.5, height: size * 0.5 }} />
      )}
    </div>
  );
};

export default Avatar;
