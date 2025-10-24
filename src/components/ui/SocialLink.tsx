interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
  gradient: string;
}

export default function SocialLink({ href, children, gradient }: SocialLinkProps) {
  return (
    <a 
      href={href} 
      className={`w-12 h-12 ${gradient} rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="font-bold">{children}</span>
    </a>
  );
}
