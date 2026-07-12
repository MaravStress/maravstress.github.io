import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Code, Sparkles } from 'lucide-react';
import bd from '../data/bd.json';

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
    id: string;
    titulo: string;
    etiquetas: string[];
    imagen: string;
    descripcion: string;
}

export default function Features() {
    const projects3D = bd['3DAnimations'] || [];
    const projectsProg = bd.Programming || [];
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Set up GSAP responsive horizontal scroll pinning
    useEffect(() => {
        if (projects3D.length === 0 && projectsProg.length === 0) return;
        if (!containerRef.current || !scrollContainerRef.current) return;

        const mm = gsap.matchMedia();

        // Desktop and tablet: Pin section and scroll horizontally
        mm.add("(min-width: 768px)", () => {
            const scrollWidth = scrollContainerRef.current!.scrollWidth;
            const clientWidth = window.innerWidth;
            const xTranslation = -(scrollWidth - clientWidth + 160);

            gsap.to(scrollContainerRef.current, {
                x: xTranslation < 0 ? xTranslation : -100,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + (scrollWidth * 0.8), // Control scroll length speed
                    invalidateOnRefresh: true,
                }
            });
        });

        // Mobile: No pinning, normal vertical scroll with fade-in animations
        mm.add("(max-width: 767px)", () => {
            gsap.from(".project-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Trigger a refresh after rendering
        ScrollTrigger.refresh();
        const timeoutId = setTimeout(() => ScrollTrigger.refresh(), 200);

        return () => {
            mm.revert();
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
                className="project-card w-full md:w-[580px] h-auto md:h-[240px] shrink-0 flex flex-col md:flex-row rounded-2xl glass-panel relative border border-panel-border/60 bg-panel backdrop-blur-xl overflow-hidden hover:border-brand-primary/40 transition-all duration-500 shadow-xl"
            >
                {/* Floating shine underlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none"></div>

                {/* Left Side: Image */}
                <div className="w-full md:w-[40%] h-[180px] md:h-full min-h-[180px] shrink-0 overflow-hidden relative border-b md:border-b-0 md:border-r border-panel-border/40">
                    <img
                        src={project.imagen}
                        alt={project.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop';
                        }}
                    />
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-[60%] p-6 flex flex-col justify-between gap-4">
                    <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {project.etiquetas.slice(0, 4).map((tag, i) => (
                                <span
                                    key={i}
                                    className={`text-[10px] font-display font-semibold tracking-wider px-2 py-0.5 rounded border ${is3D
                                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary-light'
                                        : 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary-light'
                                        }`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-base md:text-lg font-display font-bold text-foreground mb-1.5 line-clamp-1">
                            {project.titulo}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-4">
                            {cleanText}
                        </p>
                    </div>

                    {/* CTA Button */}
                    {ctaLink && (
                        <a
                            href={ctaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg font-display font-medium text-xs self-start transition-all duration-300 ${is3D
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
            ref={containerRef}
            className="w-full min-h-screen md:h-screen py-24 md:py-0 bg-background relative overflow-hidden flex flex-col justify-center transition-colors duration-300"
        >
            {/* Ambient Background Lights */}
            <div className="absolute top-1/4 left-[-10%] w-96 h-96 bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/10 rounded-full filter blur-[150px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-[-10%] w-96 h-96 bg-gradient-to-tr from-brand-secondary/10 to-brand-primary/10 rounded-full filter blur-[150px] pointer-events-none"></div>

            {/* fixed header wrapper on desktop */}
            <div className="max-w-7xl mx-auto w-full px-6 relative z-10 mb-8 md:mb-12 shrink-0 text-center md:text-left">
                <div className="projects-header flex flex-col items-center md:items-start">
                    <span className="text-brand-primary-light font-display text-sm tracking-widest uppercase mb-2">
                        [ PORTAFOLIO ]
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-text-muted">
                        Proyectos Destacados
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mt-5"></div>
                </div>
            </div>

            {/* Scrolling Tracks Container */}
            <div className="w-full relative z-10 overflow-hidden md:overflow-visible py-4 select-none">
                {/* Horizontal container for desktop, stacked container for mobile */}
                <div
                    ref={scrollContainerRef}
                    className="flex flex-col gap-10 md:gap-12 w-full md:w-max px-6 md:px-24"
                >
                    {/* Row 1: Programación y Desarrollo */}
                    {projectsProg.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center">
                            {/* Mobile Title */}
                            <div className="flex md:hidden items-center gap-2 mb-1.5 mt-4">
                                <Code className="w-4 h-4 text-brand-secondary" />
                                <h3 className="font-display font-bold text-base uppercase tracking-wider text-foreground">Programación</h3>
                            </div>

                            {/* Desktop Title Block */}
                            <div className="hidden md:flex items-center gap-2 pr-6 text-brand-secondary shrink-0 border-r border-panel-border/30 min-w-[160px] h-full justify-end font-semibold">
                                <Code className="w-4 h-4" />
                                <span className="font-display font-bold text-xs uppercase tracking-wider">Software</span>
                            </div>

                            {/* Cards list */}
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                {projectsProg.map((project) => renderCard(project, false))}
                            </div>
                        </div>
                    )}

                    {/* Row 2: Arte y Animación 3D */}
                    {projects3D.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-center">
                            {/* Mobile Title */}
                            <div className="flex md:hidden items-center gap-2 mb-1.5 mt-2">
                                <Sparkles className="w-4 h-4 text-brand-primary" />
                                <h3 className="font-display font-bold text-base uppercase tracking-wider text-foreground">Arte 3D</h3>
                            </div>

                            {/* Desktop Title Block */}
                            <div className="hidden md:flex items-center gap-2 pr-6 text-brand-primary shrink-0 border-r border-panel-border/30 min-w-[160px] h-full justify-end font-semibold">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-display font-bold text-xs uppercase tracking-wider">Arte 3D</span>
                            </div>

                            {/* Cards list */}
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                {projects3D.map((project) => renderCard(project, true))}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </section>
    );
}

