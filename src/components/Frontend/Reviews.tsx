import { useEffect, useRef } from 'react';
import { Quote, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bd from '../../data/bd.json';

gsap.registerPlugin(ScrollTrigger);

interface ReviewData {
    id: string;
    titulo: string;
    etiquetas: string[];
    imagen: string;
    descripcion: string;
}

export default function Reviews() {
    const reviews3D = bd.reviews_3D || [];
    const reviewsProg = bd.reviews_Programming || [];
    const sectionRef = useRef<HTMLDivElement>(null);
    const row1Ref = useRef<HTMLDivElement>(null);
    const row2Ref = useRef<HTMLDivElement>(null);

    // Set up GSAP horizontal scroll animations for both rows
    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Row 1: 3D Reviews (Right to Left)
            if (row1Ref.current && reviews3D.length > 0) {
                const row = row1Ref.current;
                gsap.fromTo(row,
                    { 
                        x: () => {
                            const scrollWidth = row.scrollWidth;
                            const clientWidth = window.innerWidth;
                            const centerOffset = (clientWidth - scrollWidth) / 2;
                            const delta = scrollWidth > clientWidth 
                                ? (scrollWidth - clientWidth) / 2 + 80 
                                : 60;
                            return centerOffset + delta;
                        }
                    },
                    {
                        x: () => {
                            const scrollWidth = row.scrollWidth;
                            const clientWidth = window.innerWidth;
                            const centerOffset = (clientWidth - scrollWidth) / 2;
                            const delta = scrollWidth > clientWidth 
                                ? (scrollWidth - clientWidth) / 2 + 80 
                                : 60;
                            return centerOffset - delta;
                        },
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.2, // Scrub speed
                            invalidateOnRefresh: true,
                        }
                    }
                );
            }

            // Row 2: Programming Reviews (Right to Left with Parallax offset/speed)
            if (row2Ref.current && reviewsProg.length > 0) {
                const row = row2Ref.current;
                gsap.fromTo(row,
                    { 
                        x: () => {
                            const scrollWidth = row.scrollWidth;
                            const clientWidth = window.innerWidth;
                            const centerOffset = (clientWidth - scrollWidth) / 2;
                            // Add slightly different offset delta for row 2 to create parallax depth
                            const delta = scrollWidth > clientWidth 
                                ? (scrollWidth - clientWidth) / 2 + 120 
                                : 80;
                            return centerOffset + delta;
                        }
                    },
                    {
                        x: () => {
                            const scrollWidth = row.scrollWidth;
                            const clientWidth = window.innerWidth;
                            const centerOffset = (clientWidth - scrollWidth) / 2;
                            const delta = scrollWidth > clientWidth 
                                ? (scrollWidth - clientWidth) / 2 + 120 
                                : 80;
                            return centerOffset - delta;
                        },
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.6, // Different scrub speed for parallax feel
                            invalidateOnRefresh: true,
                        }
                    }
                );
            }
        });

        // Force ScrollTrigger to recalculate all trigger positions since dynamic content loading changes the page height
        ScrollTrigger.refresh();
        
        const timeoutId = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);

        return () => {
            ctx.revert();
            clearTimeout(timeoutId);
        };
    }, [reviews3D, reviewsProg]);

    // Helper to parse description text into quote and date
    const parseDescription = (desc: string) => {
        const quoteMatch = desc.match(/"([^"]+)"/);
        const quote = quoteMatch ? quoteMatch[1] : desc.split('\n').pop()?.replace(/"/g, '') || desc;

        const lines = desc.split('\n');
        let date = '';
        for (const line of lines) {
            if (line.match(/\b(202\d)\b/) || line.match(/dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov/i)) {
                date = line.replace(/"/g, '').trim();
                break;
            }
        }

        return { quote, date };
    };

    // Render a single review card
    const renderCard = (review: ReviewData) => {
        const { quote, date } = parseDescription(review.descripcion);
        const isUpwork = review.etiquetas.some(tag => tag.toLowerCase().includes('upwork'));
        const isFiverr = review.etiquetas.some(tag => tag.toLowerCase().includes('fiverr'));

        return (
            <div 
                key={review.id}
                className={`w-[350px] md:w-[420px] h-[320px] p-8 rounded-2xl glass-panel relative group hover:border-brand-primary/40 transition-all duration-500 shadow-xl bg-panel backdrop-blur-xl border border-panel-border/60 flex flex-col justify-between`}
                style={{
                    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(217, 70, 239, 0.03) 0%, transparent 60%)'
                }}
            >
                {/* Floating Light Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-panel-border/50">
                        <span className={`text-xs font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${isUpwork
                            ? 'bg-brand-secondary/15 border-brand-secondary/30 text-brand-secondary-light'
                            : isFiverr
                                ? 'bg-brand-primary/15 border-brand-primary/30 text-brand-primary-light'
                                : 'bg-foreground/10 border-panel-border text-text-muted'
                            }`}>
                            {isUpwork ? 'Upwork' : isFiverr ? 'Fiverr' : 'Freelance'}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-display font-bold text-foreground mb-4 group-hover:text-brand-secondary-light transition-colors duration-300 line-clamp-1">
                        {review.titulo}
                    </h3>

                    {/* Quote */}
                    <div className="relative">
                        <Quote className="absolute -top-3 -left-3 w-8 h-8 text-brand-primary/10 group-hover:text-brand-primary/20 transition-colors duration-300 -rotate-180" />
                        <p className="text-sm md:text-base text-text-muted font-light leading-relaxed pl-4 italic relative z-10 line-clamp-4">
                            "{quote}"
                        </p>
                    </div>
                </div>

                {/* Date */}
                <div className="text-xs text-text-muted/70 font-display font-medium text-right mt-4">
                    {date || 'Freelance'}
                </div>
            </div>
        );
    };

    return (
        <section
            id="reviews-section"
            ref={sectionRef}
            className="w-full py-24 bg-background relative overflow-hidden transition-colors duration-300"
        >
            {/* Background Glows */}
            <div className="absolute top-1/4 right-[-10%] w-96 h-96 bg-gradient-to-tr from-brand-secondary/15 to-brand-primary/10 rounded-full filter blur-[130px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 left-[-10%] w-[450px] h-[450px] bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/15 rounded-full filter blur-[150px] pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto px-6 relative z-10 mb-12 text-center md:text-left">
                <span className="text-brand-secondary font-display text-sm tracking-widest uppercase font-bold block mb-3">
                    [ TESTIMONIOS ]
                </span>
                <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-text-muted">
                    Reviews de Clientes
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-brand-secondary to-brand-primary mt-6 mx-auto md:mx-0"></div>
            </div>

            {/* Scrolling Tracks Container */}
            <div className="flex flex-col gap-10 py-6">

                {/* Row 1: 3D Reviews */}
                {reviews3D.length > 0 && (
                    <div className="w-full overflow-hidden py-8 select-none pointer-events-auto">
                        <div
                            ref={row1Ref}
                            className="flex gap-8 px-12 md:px-24 w-max items-center"
                        >
                            {reviews3D.map((review) => renderCard(review))}
                        </div>
                    </div>
                )}

                {/* Row 2: Programming Reviews */}
                {reviewsProg.length > 0 && (
                    <div className="w-full overflow-hidden py-8 select-none pointer-events-auto">
                        <div
                            ref={row2Ref}
                            className="flex gap-8 px-12 md:px-24 w-max items-center"
                        >
                            {reviewsProg.map((review) => renderCard(review))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}

