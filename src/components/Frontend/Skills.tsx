import { Code, Server, Database, Palette, Gamepad2, Box, Film, Languages } from 'lucide-react';
import { usePortfolioData } from '../../context/DataContext';

const getCategoryIcon = (category: string, colorClass: string) => {
    switch (category.toLowerCase()) {
        case 'front end':
            return <Code className={`w-5 h-5 ${colorClass}`} />;
        case 'back end':
            return <Server className={`w-5 h-5 ${colorClass}`} />;
        case 'base de datos':
            return <Database className={`w-5 h-5 ${colorClass}`} />;
        case 'ui & ux':
            return <Palette className={`w-5 h-5 ${colorClass}`} />;
        case 'game dev':
            return <Gamepad2 className={`w-5 h-5 ${colorClass}`} />;
        case '3d':
            return <Box className={`w-5 h-5 ${colorClass}`} />;
        case 'vfx / edición de video':
            return <Film className={`w-5 h-5 ${colorClass}`} />;
        case 'idiomas':
            return <Languages className={`w-5 h-5 ${colorClass}`} />;
        default:
            return <Code className={`w-5 h-5 ${colorClass}`} />;
    }
};

export default function Skills() {
    const { data: profile } = usePortfolioData();
    return (
        <section id="skills-section" className="w-full min-h-screen py-24 px-6 bg-background relative overflow-hidden transition-colors duration-300">
            {/* Background dual glowing elements */}
            <div className="absolute top-1/2 left-1/2 w-[60vw] h-[60vh] bg-gradient-to-tr from-brand-primary/5 to-brand-secondary/5 rounded-full mix-blend-screen filter blur-[180px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"></div>

            <div className="max-w-7xl mx-auto z-10 relative">
                {/* Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <span className="text-brand-secondary-light font-display text-sm tracking-widest uppercase mb-3">
                        [ STACK TECNOLÓGICO ]
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-text-muted">
                        Habilidades y Tecnologías
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(profile.skills || []).map((category: any, idx: number) => {
                        const isEven = idx % 2 === 0;
                        const accentColorClass = isEven ? 'text-brand-primary' : 'text-brand-secondary';
                        
                        return (
                            <div 
                                key={category.id} 
                                className={`glass-panel p-6 hover:scale-[1.03] transition-all duration-300 shadow-lg group border-t-2 ${
                                    isEven 
                                    ? 'border-t-brand-primary hover:border-brand-primary/50 hover:shadow-brand-primary/5' 
                                    : 'border-t-brand-secondary hover:border-brand-secondary/50 hover:shadow-brand-secondary/5'
                                }`}
                            >
                                {/* Card Title & Icon */}
                                <div className="flex items-center gap-3 border-b border-panel-border pb-4 mb-4">
                                    {getCategoryIcon(category.categoryName, accentColorClass)}
                                    <h3 className={`text-lg font-display font-bold text-foreground transition-colors ${
                                        isEven ? 'group-hover:text-brand-primary-light' : 'group-hover:text-brand-secondary-light'
                                    }`}>
                                        {category.categoryName}
                                    </h3>
                                </div>

                                {/* Skills List */}
                                <div className="flex flex-wrap gap-2">
                                    {(category.skills || []).map((skill: any, index: number) => (
                                        <span 
                                            key={index} 
                                            className={`text-xs font-mono bg-background-secondary border border-panel-border px-3 py-1.5 rounded transition-all duration-200 text-text-muted ${
                                                isEven 
                                                ? 'hover:border-brand-primary hover:text-brand-primary-light' 
                                                : 'hover:border-brand-secondary hover:text-brand-secondary-light'
                                            }`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
