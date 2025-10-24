interface TechTagProps {
  tech: string;
  variant?: 'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'indigo';
}

export default function TechTag({ tech, variant = 'purple' }: TechTagProps) {
  const variants = {
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  };

  return (
    <span className={`px-3 py-1 ${variants[variant]} rounded-full text-sm border`}>
      {tech}
    </span>
  );
}
