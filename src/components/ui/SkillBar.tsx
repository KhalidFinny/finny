interface SkillBarProps {
  skill: string;
  percentage: number;
}

export default function SkillBar({ skill, percentage }: SkillBarProps) {
  return (
    <div>
      <div className="flex justify-between text-white mb-2">
        <span className="font-light">{skill}</span>
        <span className="text-red-400 font-light text-sm">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800/50 h-1 rounded-full">
        <div 
          className="bg-gradient-to-r from-red-400 to-rose-500 h-1 rounded-full transition-all duration-1000 ease-out" 
          style={{width: `${percentage}%`}}
        ></div>
      </div>
    </div>
  );
}
