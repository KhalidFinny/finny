import { motion } from 'framer-motion';
import { experiences } from '@/data/experienceData';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 md:py-40 px-6 md:px-20 lg:px-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Editorial Swiss style */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-32 border-b border-[var(--line)] pb-12">
          <motion.h2 
            className="text-7xl md:text-[9rem] font-urbanist font-semibold text-[var(--foreground)] leading-none tracking-[-0.06em]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            JOURNEY
          </motion.h2>
          <motion.div 
            className="max-w-xs text-right md:ml-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-[var(--mclaren-red)] font-urbanist font-semibold tracking-widest text-xs block mb-4">MILESTONES</span>
            <p className="text-[var(--text-muted)] font-urbanist font-medium text-base">
              A timeline of professional growth and creative explorations.
            </p>
          </motion.div>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Vertical line helper */}
          <div className="absolute left-0 md:left-1/2 top-0 w-px h-full bg-gradient-to-b from-[var(--line)] via-[var(--mclaren-red)]/40 to-[var(--line)]" />

          <div className="space-y-32">
            {experiences.map((exp, idx) => (
              <motion.div 
                key={exp.id}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Year/Period Bubble */}
                <div className="absolute left-[-12px] md:left-1/2 md:translate-x-[-50%] top-0 z-10">
                  <div className="w-6 h-6 rounded-full border-2 border-[var(--mclaren-red)] bg-[var(--surface)]" />
                </div>

                {/* Content Side */}
                <div className={`md:w-1/2 px-8 ${idx % 2 === 0 ? 'md:pl-20 text-left' : 'md:pr-20 md:text-right'}`}>
                  <span className="text-[var(--mclaren-red)] font-urbanist font-semibold tracking-widest text-sm block mb-2 uppercase">
                    {exp.period}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-urbanist font-medium text-[var(--foreground)] mb-4 leading-tight">
                    {exp.role.split(' ').map((word, i) => (
                      <span key={i} className={i === 0 ? 'font-medium' : ''}>{word} </span>
                    ))}
                  </h3>
                  <div className={`flex items-center gap-4 mb-8 ${idx % 2 !== 0 ? 'md:justify-end' : ''}`}>
                    <span className="text-[var(--text-muted)] font-urbanist text-lg tracking-widest uppercase">{exp.company}</span>
                  </div>
                </div>

                {/* Detail Side */}
                <div className={`md:w-1/2 px-8 ${idx % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20 text-left'} flex flex-col justify-center`}>
                  <ul className={`space-y-4 text-[var(--text-muted)] font-urbanist font-medium text-base md:text-lg leading-relaxed ${idx % 2 !== 0 ? 'text-left' : 'md:text-right'}`}>
                    {exp.description.map((line, i) => (
                      <li key={i} className="relative">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 select-none pointer-events-none opacity-[0.02]">
        <span className="text-[20rem] font-urbanist font-bold text-[var(--foreground)] leading-none whitespace-nowrap">HISTORY HISTORY HISTORY</span>
      </div>
    </section>
  );
}
