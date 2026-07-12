import { useState, useEffect } from 'react';
import ThreeBackground from './ThreeBackground';
import { ChevronDown, Mail, Linkedin } from 'lucide-react';
import profile from '../data/profileData.json';

export default function Hero() {
    const [upworkUrl, setUpworkUrl] = useState('https://www.upwork.com/freelancers/~017c66dbe126786cbe');

    useEffect(() => {
        fetch('/bd.json')
            .then(res => res.json())
            .then(data => {
                if (data.links?.upwork) {
                    setUpworkUrl(data.links.upwork);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleScrollToReviews = () => {
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScrollToContact = () => {
        document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero-section" className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden py-20 lg:py-24">
            {/* 3D Background */}
            <ThreeBackground className="absolute top-0 left-0 z-0 w-full h-screen overflow-hidden pointer-events-none" />

            {/* Content Container (Header) */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mb-8 mt-12 lg:mt-0">

                <h1 className="text-8xl md:text-8xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-purple-500 to-brand-secondary drop-shadow-sm leading-tight">
                    {profile.personalInfo.name.toUpperCase()}
                </h1>
                <span className="text-brand-secondary font-display text-sm tracking-widest uppercase font-bold block mb-2">
                    PROGRAMADOR & DISEÑADOR 3D
                </span>
            </div>

            {/* Grid Layout for Info & Canvas */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">

                {/* Left Side: Personal Info, Summary */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-primary/50 relative overflow-hidden transition-all duration-300">
                        <div className="flex items-center gap-3 text-sm text-brand-primary-light font-display font-semibold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
                            <span>Disponible para proyectos freelance y tiempo completo • {profile.personalInfo.location}</span>
                        </div>

                        <p className="text-base md:text-lg text-text-muted font-light leading-relaxed">
                            {profile.summary}
                        </p>

                        {/* Contact & Social Links */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {/* LinkedIn */}
                            <a
                                href={profile.personalInfo.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-foreground/5 hover:bg-brand-primary/10 border border-panel-border hover:border-brand-primary text-text-muted hover:text-brand-primary-light rounded-lg transition-all duration-300 group"
                            >
                                <Linkedin className="w-4 h-4 text-brand-primary" />
                                <span>LinkedIn</span>
                            </a>

                            {/* Upwork */}
                            <a
                                href={upworkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-foreground/5 hover:bg-brand-secondary/10 border border-panel-border hover:border-brand-secondary text-text-muted hover:text-brand-secondary-light rounded-lg transition-all duration-300 group"
                            >
                                <svg className="w-4 h-4 fill-current text-brand-secondary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.57 6.72c-1.89 0-3.32 1.34-3.79 3.23l-.11.56c-.57-1.87-1.42-3.8-2.61-5.18h-2.31v7.65c0 1.37-.87 2.25-2.24 2.25s-2.24-.88-2.24-2.25V5.33H3.01v7.65c0 2.47 1.99 4.3 4.46 4.3s4.46-1.83 4.46-4.3v-.68c.84 1.36 1.77 2.76 2.89 3.65l-1.39 6.72h2.3l1.1-5.32c.59.2 1.22.31 1.88.31 2.87 0 4.96-2.12 4.96-5.18-.01-3.08-2.1-5.24-5.02-5.24zm0 8.35c-1.63 0-2.88-1.02-2.88-3.11s1.25-3.11 2.88-3.11 2.88 1.02 2.88 3.11-1.25 3.11-2.88 3.11z" />
                                </svg>
                                <span>Upwork</span>
                            </a>

                            {/* Email */}
                            <a
                                href={`mailto:${profile.personalInfo.email}`}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-foreground/5 hover:bg-brand-primary/10 border border-panel-border hover:border-brand-primary text-text-muted hover:text-brand-primary-light rounded-lg transition-all duration-300 group"
                            >
                                <Mail className="w-4 h-4 text-brand-primary" />
                                <span>{profile.personalInfo.email}</span>
                            </a>
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-2 flex gap-4">
                            <button
                                onClick={handleScrollToContact}
                                className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-light hover:to-brand-secondary-light text-white font-display font-semibold rounded-lg shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
                            >
                                Contáctame
                            </button>
                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-6 py-3 border border-panel-border hover:border-brand-secondary text-foreground hover:text-brand-secondary-light font-display rounded-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
                            >
                                Ver Proyectos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Spacer (allowing the background 3D model to show through) */}
                <div className="lg:col-span-5 hidden lg:block pointer-events-none"></div>

                {/* Education Cards: spans all 12 columns, going side-by-side */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {profile.education.map((edu, idx) => (
                        <div
                            key={edu.id}
                            className={`glass-panel p-6 hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between ${idx % 2 === 0
                                ? 'border-l-2 border-l-brand-primary hover:border-brand-primary-light'
                                : 'border-l-2 border-l-brand-secondary hover:border-brand-secondary-light'
                                }`}
                        >
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <h3 className={`text-lg font-display font-bold text-foreground transition-colors ${idx % 2 === 0 ? 'group-hover:text-brand-primary-light' : 'group-hover:text-brand-secondary-light'
                                    }`}>
                                    {edu.degree}
                                </h3>
                                <span className={`shrink-0 text-xs font-display font-semibold px-2.5 py-1 rounded border ${idx % 2 === 0
                                    ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary-light'
                                    : 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary-light'
                                    }`}>
                                    {edu.dates}
                                </span>
                            </div>
                            <p className="text-sm text-text-muted font-medium mt-auto">
                                {edu.institution}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

            {/* Decorative gradient orb (magenta to cyan) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse pointer-events-none"></div>

            {/* Scroll indicator */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce text-text-muted hover:text-foreground transition-colors cursor-pointer"
                onClick={handleScrollToReviews}
            >
                <span className="text-sm font-medium tracking-widest uppercase mb-2">Ver Testimonios</span>
                <ChevronDown className="w-6 h-6 text-brand-secondary-light" />
            </div>
        </section>
    );
}
