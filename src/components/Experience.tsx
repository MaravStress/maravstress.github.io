import { Briefcase, MapPin, Calendar, ChevronDown } from 'lucide-react';
import profile from '../data/profileData.json';

export default function Experience() {
    const handleScrollToProjects = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="experience-section" className="w-full min-h-screen py-24 px-6 bg-background-secondary relative overflow-hidden transition-colors duration-300">
            {/* Ambient background glow (Magenta-to-Cyan) */}
            <div className="absolute top-1/3 left-[-10%] w-96 h-96 bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/10 rounded-full filter blur-[150px] pointer-events-none animate-pulse"></div>

            <div className="max-w-5xl mx-auto z-10 relative">
                {/* Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <span className="text-brand-primary-light font-display text-sm tracking-widest uppercase mb-3">
                        [ HISTORIAL LABORAL ]
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-text-muted">
                        Experiencia Laboral
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mt-6"></div>
                </div>

                {/* Timeline / Grid of Cards */}
                <div className="flex flex-col gap-8">
                    {profile.experience.map((exp, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                            <div 
                                key={exp.id} 
                                className={`glass-panel p-8 border-l-4 hover:scale-[1.01] transition-all duration-300 shadow-xl group ${
                                    isEven 
                                    ? 'border-l-brand-primary hover:border-brand-primary-light' 
                                    : 'border-l-brand-secondary hover:border-brand-secondary-light'
                                }`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-panel-border/50">
                                    <div>
                                        <h3 className={`text-xl font-display font-bold text-foreground transition-colors ${
                                            isEven ? 'group-hover:text-brand-primary-light' : 'group-hover:text-brand-secondary-light'
                                        }`}>
                                            {exp.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-text-muted font-medium">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className={`w-4 h-4 ${isEven ? 'text-brand-primary-light' : 'text-brand-secondary-light'}`} />
                                                {exp.company}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {exp.location}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 inline-flex items-center gap-2 text-sm font-display font-semibold px-3 py-1.5 rounded-lg md:self-start border ${
                                        isEven 
                                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary-light' 
                                        : 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary-light'
                                    }`}>
                                        <Calendar className="w-4 h-4" />
                                        {exp.dates}
                                    </span>
                                </div>

                                <ul className="list-none space-y-2.5">
                                    {exp.bullets.map((bullet, bulletIdx) => (
                                        <li key={bulletIdx} className="text-sm md:text-base text-text-muted font-light leading-relaxed flex items-start gap-3">
                                            <span className={`mt-1 text-sm select-none ${isEven ? 'text-brand-primary-light' : 'text-brand-secondary-light'}`}>
                                                {isEven ? '✦' : '✨'}
                                            </span>
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Scroll to projects indicator */}
                <div className="flex flex-col items-center mt-16 text-text-muted hover:text-foreground transition-colors cursor-pointer" onClick={handleScrollToProjects}>
                    <span className="text-sm font-display tracking-widest uppercase mb-2">Ver Proyectos</span>
                    <ChevronDown className="w-5 h-5 text-brand-secondary-light animate-bounce" />
                </div>
            </div>
        </section>
    );
}
