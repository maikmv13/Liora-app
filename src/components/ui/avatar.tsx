interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-medium ${className}`}>
      {initials}
    </div>
  );
} 