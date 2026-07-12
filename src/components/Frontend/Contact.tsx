import { Mail, Phone, MapPin, Linkedin, Settings, Github } from 'lucide-react';
import bd from '../../data/bd.json';

const profile = bd;

interface ContactProps {
    onEnterBackend: () => void;
}

export default function Contact({ onEnterBackend }: ContactProps) {
    const upworkUrl = bd.links?.upwork || 'https://www.upwork.com/freelancers/~017c66dbe126786cbe';
    const githubUrl = bd.links?.github || 'https://github.com/MaravStress';

    return (
        <section id="contact-section" className="w-full min-h-screen py-24 px-6 bg-gradient-to-b from-background-secondary to-background relative overflow-hidden transition-colors duration-300">
            {/* Background elements (Magenta to Cyan glow) */}
            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none animate-pulse"></div>

            <div className="max-w-7xl mx-auto z-10 relative">
                {/* Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <span className="text-brand-secondary-light font-display text-sm tracking-widest uppercase mb-3">
                        [ CONEXIÓN ]
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-text-muted">
                        Ponte en Contacto
                    </h2>
                    <p className="text-text-muted mt-4 max-w-lg font-light leading-relaxed">
                        ¿Tienes una propuesta o quieres colaborar en algún proyecto? Escríbeme o búscame en mis redes.
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mt-6"></div>
                </div>

                <div className="max-w-xl mx-auto w-full">
                    <div className="flex flex-col gap-8 w-full">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-display font-bold text-brand-secondary-light uppercase border-b border-panel-border pb-3 text-center">
                                Información de Contacto
                            </h3>
                            
                            {/* Email Card */}
                            <a 
                                href={`mailto:${profile.personalInfo.email}`}
                                className="glass-panel p-5 flex items-center gap-4 border-l-2 border-l-brand-primary hover:border-brand-primary-light hover:scale-[1.02] transition-all duration-300 group"
                            >
                                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-display text-text-muted uppercase tracking-wider">Correo Electrónico</p>
                                    <p className="text-sm font-mono text-foreground truncate mt-0.5">{profile.personalInfo.email}</p>
                                </div>
                            </a>

                            {/* Phone Card */}
                            <a 
                                href={`tel:${profile.personalInfo.phone}`}
                                className="glass-panel p-5 flex items-center gap-4 border-l-2 border-l-brand-secondary hover:border-brand-secondary-light hover:scale-[1.02] transition-all duration-300 group"
                            >
                                <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-lg group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-display text-text-muted uppercase tracking-wider">Teléfono</p>
                                    <p className="text-sm font-mono text-foreground mt-0.5">{profile.personalInfo.phone}</p>
                                </div>
                            </a>

                            {/* Location Card */}
                            <div className="glass-panel p-5 flex items-center gap-4 border-l-2 border-l-brand-primary hover:border-brand-primary-light hover:scale-[1.02] transition-all duration-300 group">
                                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-display text-text-muted uppercase tracking-wider">Ubicación</p>
                                    <p className="text-sm font-mono text-foreground mt-0.5">{profile.personalInfo.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Buttons Block */}
                        <div className="flex flex-col gap-4 mt-2">
                            <h3 className="text-lg font-display font-bold text-text-muted uppercase tracking-widest text-center">
                                Enlaces Profesionales
                            </h3>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* LinkedIn */}
                                <a 
                                    href={profile.personalInfo.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="glass-panel py-4 flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:text-brand-primary-light hover:scale-[1.05] transition-all duration-300"
                                >
                                    <Linkedin className="w-6 h-6 text-brand-primary" />
                                    <span className="text-xs font-display font-semibold">LinkedIn</span>
                                </a>

                                {/* Upwork */}
                                <a 
                                    href={upworkUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="glass-panel py-4 flex flex-col items-center justify-center gap-2 hover:border-brand-secondary hover:text-brand-secondary-light hover:scale-[1.05] transition-all duration-300"
                                >
                                    <svg className="w-6 h-6 fill-current text-brand-secondary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.57 6.72c-1.89 0-3.32 1.34-3.79 3.23l-.11.56c-.57-1.87-1.42-3.8-2.61-5.18h-2.31v7.65c0 1.37-.87 2.25-2.24 2.25s-2.24-.88-2.24-2.25V5.33H3.01v7.65c0 2.47 1.99 4.3 4.46 4.3s4.46-1.83 4.46-4.3v-.68c.84 1.36 1.77 2.76 2.89 3.65l-1.39 6.72h2.3l1.1-5.32c.59.2 1.22.31 1.88.31 2.87 0 4.96-2.12 4.96-5.18-.01-3.08-2.1-5.24-5.02-5.24zm0 8.35c-1.63 0-2.88-1.02-2.88-3.11s1.25-3.11 2.88-3.11 2.88 1.02 2.88 3.11-1.25 3.11-2.88 3.11z"/>
                                    </svg>
                                    <span className="text-xs font-display font-semibold">Upwork</span>
                                </a>

                                {/* GitHub */}
                                <a 
                                    href={githubUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="glass-panel py-4 flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:text-brand-primary-light hover:scale-[1.05] transition-all duration-300"
                                >
                                    <Github className="w-6 h-6 text-brand-primary" />
                                    <span className="text-xs font-display font-semibold">GitHub</span>
                                </a>

                                {/* Backend */}
                                <button 
                                    onClick={onEnterBackend}
                                    className="glass-panel py-4 flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:text-brand-secondary hover:scale-[1.05] transition-all duration-300 cursor-pointer w-full"
                                >
                                    <Settings className="w-6 h-6 text-brand-secondary" />
                                    <span className="text-xs font-display font-semibold">Backend</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
