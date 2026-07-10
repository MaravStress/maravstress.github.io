import { useState, useEffect } from 'react';

interface NavItem {
    label: string;
    targetId: string;
}

const navItems: NavItem[] = [
    { label: 'Inicio', targetId: 'hero-section' },
    { label: 'Testimonios', targetId: 'reviews-section' },
    { label: 'Experiencia', targetId: 'experience-section' },
    { label: 'Proyectos', targetId: 'features' },
    { label: 'Habilidades', targetId: 'skills-section' },
    { label: 'Contacto', targetId: 'contact-section' },
];

export default function FloatingNavbar() {
    const [activeSection, setActiveSection] = useState('hero-section');

    useEffect(() => {
        const observers = navItems.map((item) => {
            const el = document.getElementById(item.targetId);
            return { id: item.targetId, el };
        });

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -50% 0px', // Trigger when section is in the middle of viewport
            threshold: 0,
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(callback, observerOptions);

        observers.forEach((obs) => {
            if (obs.el) observer.observe(obs.el);
        });

        return () => {
            observers.forEach((obs) => {
                if (obs.el) observer.unobserve(obs.el);
            });
        };
    }, []);

    const handleScroll = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-6 right-6 z-50 hidden md:flex items-center gap-1.5 p-1.5 bg-background/50 backdrop-blur-xl border border-panel-border rounded-full shadow-2xl transition-all duration-300">
            {navItems.map((item) => {
                const isActive = activeSection === item.targetId;
                return (
                    <button
                        key={item.targetId}
                        onClick={() => handleScroll(item.targetId)}
                        className={`px-4 py-2 text-xs font-display font-bold tracking-wider uppercase rounded-full transition-all duration-300 cursor-pointer ${
                            isActive
                                ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md shadow-brand-primary/25'
                                : 'text-text-muted hover:text-foreground hover:bg-foreground/5'
                        }`}
                    >
                        {item.label}
                    </button>
                );
            })}
        </nav>
    );
}
