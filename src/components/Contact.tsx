import { Mail, Phone, MapPin, Linkedin, Globe, Send, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import profile from '../data/profileData.json';
import content from '../data/content.json';

export default function Contact() {
    const [email, setEmail] = useState('');
    const [messageText, setMessageText] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            // Attempt to insert contact request.
            const { error } = await supabase.from(content.waitlistInput.tableName).insert([
                { email, name: name || undefined, message: messageText || undefined }
            ]);

            if (error) {
                if (error.message && (error.message.includes('column') || error.code === 'PGRST111')) {
                    const { error: fallbackError } = await supabase.from(content.waitlistInput.tableName).insert([{ email }]);
                    if (fallbackError) {
                        if (fallbackError.code === '23505') {
                            throw new Error(content.waitlistInput.emailDuplicado);
                        }
                        throw fallbackError;
                    }
                } else {
                    if (error.code === '23505') {
                        throw new Error(content.waitlistInput.emailDuplicado);
                    }
                    throw error;
                }
            }

            setStatus('success');
            setMessage(content.waitlistInput.successMessage);
            setEmail('');
            setName('');
            setMessageText('');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || content.waitlistInput.errorMessage);
        }
    };

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
                        ¿Tienes una propuesta o quieres colaborar en algún proyecto? Envíame un mensaje o búscame en mis redes.
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mt-6"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    
                    {/* Left Column: Direct Info & Social buttons */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-display font-bold text-brand-secondary-light uppercase border-b border-panel-border pb-3">
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
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-display font-bold text-text-muted uppercase tracking-widest">
                                Enlaces Profesionales
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {/* LinkedIn */}
                                <a 
                                    href="https://linkedin.com/in/eliam-paredes" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="glass-panel py-4 flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:text-brand-primary-light hover:scale-[1.05] transition-all duration-300"
                                >
                                    <Linkedin className="w-6 h-6 text-brand-primary" />
                                    <span className="text-xs font-display font-semibold">LinkedIn</span>
                                </a>

                                {/* Upwork */}
                                <a 
                                    href="https://www.upwork.com/freelancers/~017c66dbe126786cbe" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="glass-panel py-4 flex flex-col items-center justify-center gap-2 hover:border-brand-secondary hover:text-brand-secondary-light hover:scale-[1.05] transition-all duration-300"
                                >
                                    <svg className="w-6 h-6 fill-current text-brand-secondary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.57 6.72c-1.89 0-3.32 1.34-3.79 3.23l-.11.56c-.57-1.87-1.42-3.8-2.61-5.18h-2.31v7.65c0 1.37-.87 2.25-2.24 2.25s-2.24-.88-2.24-2.25V5.33H3.01v7.65c0 2.47 1.99 4.3 4.46 4.3s4.46-1.83 4.46-4.3v-.68c.84 1.36 1.77 2.76 2.89 3.65l-1.39 6.72h2.3l1.1-5.32c.59.2 1.22.31 1.88.31 2.87 0 4.96-2.12 4.96-5.18-.01-3.08-2.1-5.24-5.02-5.24zm0 8.35c-1.63 0-2.88-1.02-2.88-3.11s1.25-3.11 2.88-3.11 2.88 1.02 2.88 3.11-1.25 3.11-2.88 3.11z"/>
                                    </svg>
                                    <span className="text-xs font-display font-semibold">Upwork</span>
                                </a>

                                {/* Web */}
                                <a 
                                    href={profile.personalInfo.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="glass-panel py-4 flex flex-col items-center justify-center gap-2 hover:border-brand-primary hover:text-brand-secondary hover:scale-[1.05] transition-all duration-300"
                                >
                                    <Globe className="w-6 h-6 text-brand-secondary" />
                                    <span className="text-xs font-display font-semibold">Sitio Web</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-7 glass-panel p-8 md:p-12 border-t-2 border-t-brand-primary/50 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-display font-bold text-foreground mb-2">
                                Envíame un Mensaje
                            </h3>
                            <p className="text-sm text-text-muted mb-8 font-light">
                                Llena este formulario y me pondré en contacto contigo a la brevedad.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {/* Name Input */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-name" className="text-xs font-display text-brand-primary-light uppercase tracking-wider">
                                        Nombre / Empresa
                                    </label>
                                    <input 
                                        type="text" 
                                        id="contact-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tu nombre o empresa"
                                        disabled={status === 'loading' || status === 'success'}
                                        className="w-full px-5 py-3 rounded-lg bg-background-secondary border border-panel-border text-foreground placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50"
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-email" className="text-xs font-display text-brand-secondary-light uppercase tracking-wider">
                                        Correo Electrónico *
                                    </label>
                                    <input 
                                        type="email" 
                                        id="contact-email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu-correo@ejemplo.com"
                                        disabled={status === 'loading' || status === 'success'}
                                        className="w-full px-5 py-3 rounded-lg bg-background-secondary border border-panel-border text-foreground placeholder-text-muted focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all disabled:opacity-50"
                                    />
                                </div>

                                {/* Message Input */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="contact-message" className="text-xs font-display text-brand-primary-light uppercase tracking-wider">
                                        Mensaje
                                    </label>
                                    <textarea 
                                        id="contact-message"
                                        rows={4}
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Escribe aquí tu mensaje o los detalles del proyecto..."
                                        disabled={status === 'loading' || status === 'success'}
                                        className="w-full px-5 py-3 rounded-lg bg-background-secondary border border-panel-border text-foreground placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="w-full mt-2 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-light hover:to-brand-secondary-light text-white font-display font-semibold rounded-lg shadow-lg shadow-brand-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Estableciendo conexión...</span>
                                        </>
                                    ) : status === 'success' ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Mensaje Enviado</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Enviar Mensaje</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Status feedback message */}
                        {message && (
                            <p className={`text-sm font-display font-medium text-center mt-6 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
