// import TechTag from './TechTag';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  gradient: string;
  liveDemo: string;
  github: string;
  variant: 'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'indigo';
}

export default function ProjectCard({ 
  title, 
  description, 
  technologies, 
  gradient, 
  liveDemo, 
  github
}: ProjectCardProps) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 hover:border-red-500/50 p-8 transition-all duration-500 group hover:bg-gray-800/50">
      {/* Project Image/Placeholder */}
      <div className={`w-full h-56 ${gradient} mb-8 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
        <span className="text-white text-xl font-light tracking-wide uppercase">{title}</span>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>
      
      {/* Project Info */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-light text-white mb-3 tracking-wide">{title}</h3>
          <p className="text-gray-400 font-light leading-relaxed text-sm">{description}</p>
        </div>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs font-light tracking-wide border border-gray-600 hover:border-red-500/50 transition-colors">
              {tech}
            </span>
          ))}
        </div>
        
        {/* Links */}
        <div className="flex gap-6 pt-2">
          <a 
            href={liveDemo} 
            className="text-red-500 hover:text-red-400 font-light text-sm tracking-wide uppercase transition-colors duration-300 border-b border-transparent hover:border-red-500/50 pb-1"
          >
            Live Demo
          </a>
          <a 
            href={github} 
            className="text-gray-400 hover:text-white font-light text-sm tracking-wide uppercase transition-colors duration-300 border-b border-transparent hover:border-gray-400 pb-1"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
