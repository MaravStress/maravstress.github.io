import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '../data/content.json';

gsap.registerPlugin(ScrollTrigger);

const panelsData = content.features.panels;

export default function Features() {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const panels = gsap.utils.toArray('.feature-panel');
            const bgPanels = document.querySelectorAll('.feature-bg-panel');

            gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (panels.length - 1),
                    end: () => "+=" + (panelsRef.current?.offsetWidth || 0),
                    // En cada frame del scroll leemos el progreso y movemos el fondo
                    onUpdate: (self) => {
                        // progress va de 0 a 1 mientras el usuario baja
                        // Mapeamos a un rango de backgroundPosition: 30% (izq) → 70% (der)
                        const xPos = 30 + self.progress * 40;
                        bgPanels.forEach((el) => {
                            (el as HTMLElement).style.backgroundPositionX = `${xPos}%`;
                        });
                    }
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleNextSection = () => {
        document.getElementById('skills-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section ref={containerRef} id="features" className="overflow-hidden w-full h-screen bg-background-secondary flex items-center relative transition-colors duration-300">

            <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none -translate-x-1/2" />

            <div ref={panelsRef} className="flex h-full w-max">
                {panelsData.map((panel) => (
                    <div key={panel.id} className="feature-panel w-screen h-full shrink-0 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">

                        <div
                            className="feature-bg-panel w-full max-w-6xl mx-auto rounded-2xl h-[80vh] relative overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-black/50 border border-white/10"
                            style={{
                                backgroundImage: `url(${panel.image})`,
                                backgroundSize: '180% auto',
                                backgroundPositionX: '30%',
                                backgroundPositionY: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            {/* Overlay for better text readability */}
                            <div className="absolute inset-0 bg-black/30 z-0"></div>

                            {/* Top/Left spacer - shows background image */}
                            <div className="block w-full h-[45%] md:w-1/2 md:h-full z-10"></div>

                            {/* Bottom/Right content panel with glass effect */}
                            <div className="w-full h-[55%] md:w-1/2 md:h-full flex flex-col justify-center p-6 md:p-16 gap-4 md:gap-8 bg-panel backdrop-blur-xl border-t md:border-t-0 md:border-l border-panel-border z-10 rounded-b-2xl md:rounded-b-none md:rounded-r-2xl transition-colors duration-300">

                                {/* <div className="text-brand-primary-light font-semibold tracking-wide text-sm">Característica 0{idx + 1}</div> */}

                                <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight drop-shadow-md pb-4 border-b border-panel-border text-foreground">{panel.title}</h2>
                                <p className="text-lg text-text-muted leading-relaxed font-light">{panel.text}</p>

                                <div className="mt-4">
                                    <button
                                        onClick={handleNextSection}
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-foreground/10 hover:bg-brand-primary text-foreground hover:text-white transition-all duration-300 rounded-lg font-medium border border-panel-border hover:border-brand-primary group shadow-lg"
                                    >
                                        <span>{content.features.joinButton}</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
