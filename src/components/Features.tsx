import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Code, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
    id: string;
    titulo: string;
    etiquetas: string[];
    imagen: string;
    descripcion: string;
}

export default function Features() {
    const [projects3D, setProjects3D] = useState<ProjectData[]>([]);
    const [projectsProg, setProjectsProg] = useState<ProjectData[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    // Fetch projects data from public/bd.json
    useEffect(() => {
        fetch('/bd.json')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch bd.json');
                }
                return res.json();
            })
            .then((data) => {
                setProjects3D(data['3DAnimations'] || []);
                setProjectsProg(data.Programming || []);
            })
            .catch((err) => console.error('Error loading projects:', err));
    }, []);

    // Set up GSAP entrance animation for projects
    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Animating title & header
            gsap.from('.projects-header', {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });

            // Animating Row 1 cards
            if (row1Ref.current && projects3D.length > 0) {
                gsap.from(row1Ref.current.children, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row1Ref.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            }

            // Animating Row 2 cards
            if (row2Ref.current && projectsProg.length > 0) {
                gsap.from(row2Ref.current.children, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row2Ref.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            }
        });

        // Trigger a refresh after data loaded to correct heights
        ScrollTrigger.refresh();
        const timeoutId = setTimeout(() => ScrollTrigger.refresh(), 200);

        return () => {
            ctx.revert();
            clearTimeout(timeoutId);
        };
    }, [projects3D, projectsProg]);

    // Helper to parse description and extract Markdown links
    const parseProjectDescription = (desc: string) => {
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;
        const match = desc.match(linkRegex);

        let cleanText = desc;
        let ctaLink = '';
        let ctaLabel = '';

        if (match) {
            cleanText = desc.replace(linkRegex, '').trim();
            ctaLabel = match[1];
            ctaLink = match[2];
        }

        // Remove trailing newlines and clean up
        cleanText = cleanText.replace(/\n+$/, '').trim();

        return { cleanText, ctaLabel, ctaLink };
    };

    // Render a horizontal card
    const renderCard = (project: ProjectData, is3D: boolean) => {
        const { cleanText, ctaLabel, ctaLink } = parseProjectDescription(project.descripcion);

        return (
            <div 
                key={project.id}
                className="w-full lg:w-[48%] xl:w-[31%] min-h-[220px] flex flex-col md:flex-row rounded-2xl glass-panel relative border border-panel-border/60 bg-panel backdrop-blur-xl overflow-hidden hover:border-brand-primary/40 transition-all duration-500 shadow-xl"
            >
                {/* Floating shine underlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none"></div>

                {/* Left Side: Image */}
                <div className="w-full md:w-[40%] h-[160px] md:h-full min-h-[160px] shrink-0 overflow-hidden relative border-b md:border-b-0 md:border-r border-panel-border/40">
                    <img 
                        src={project.imagen} 
                        alt={project.titulo} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
                        }}
                    />
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-[60%] p-6 flex flex-col justify-between gap-4">
                    <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {project.etiquetas.slice(0, 3).map((tag, i) => (
                                <span 
                                    key={i} 
                                    className={`text-[10px] font-display font-semibold tracking-wider px-2 py-0.5 rounded border ${
                                        is3D 
                                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary-light' 
                                        : 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary-light'
                                    }`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-display font-bold text-foreground mb-2 line-clamp-1">
                            {project.titulo}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-3">
                            {cleanText}
                        </p>
                    </div>

                    {/* CTA Button */}
                    {ctaLink && (
                        <a 
                            href={ctaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg font-display font-medium text-xs self-start transition-all duration-300 ${
                                is3D 
                                ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary-light hover:bg-brand-primary hover:text-white hover:border-brand-primary' 
                                : 'bg-brand-secondary/10 border-brand-secondary/30 text-brand-secondary-light hover:bg-brand-secondary hover:text-white hover:border-brand-secondary'
                            }`}
                        >
                            <span>{ctaLabel || 'Ver Proyecto'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section 
            id="features" 
            ref={sectionRef} 
            className="w-full py-24 bg-background relative overflow-hidden transition-colors duration-300"
        >
            {/* Ambient Background Lights */}
            <div className="absolute top-1/3 left-[-10%] w-96 h-96 bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/10 rounded-full filter blur-[150px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/3 right-[-10%] w-96 h-96 bg-gradient-to-tr from-brand-secondary/10 to-brand-primary/10 rounded-full filter blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="projects-header text-center mb-16 flex flex-col items-center">
                    <span className="text-brand-primary-light font-display text-sm tracking-widest uppercase mb-3">
                        [ PORTAFOLIO ]
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-text-muted">
                        Proyectos Destacados
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mt-6"></div>
                </div>

                {/* Row 1: Arte y Animación 3D */}
                {projects3D.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-brand-primary" />
                            <h3 className="text-xl font-display font-bold text-foreground">
                                Animación y Arte 3D
                            </h3>
                        </div>
                        <div 
                            ref={row1Ref} 
                            className="flex flex-wrap gap-6 justify-center lg:justify-start"
                        >
                            {projects3D.map((project) => renderCard(project, true))}
                        </div>
                    </div>
                )}

                {/* Row 2: Programación y Desarrollo */}
                {projectsProg.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Code className="w-5 h-5 text-brand-secondary" />
                            <h3 className="text-xl font-display font-bold text-foreground">
                                Programación y Videojuegos
                            </h3>
                        </div>
                        <div 
                            ref={row2Ref} 
                            className="flex flex-wrap gap-6 justify-center lg:justify-start"
                        >
                            {projectsProg.map((project) => renderCard(project, false))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}

