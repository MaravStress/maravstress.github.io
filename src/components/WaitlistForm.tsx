import WaitlistInput from './WaitlistInput';
import content from '../data/bd.json';

export default function WaitlistForm() {
    return (
        <section id="waitlist-section" className="w-full min-h-screen flex items-center justify-center relative px-6 py-24 bg-gradient-to-b from-background-secondary to-background overflow-hidden transition-colors duration-300">

            <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-brand-primary/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

            <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center z-10 glass-panel p-10 md:p-16 border-t-2 border-t-brand-primary/50">
                <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-text-muted">
                    {content.waitlistForm.title}
                </h2>

                <p className="text-lg text-text-muted mb-10 max-w-lg">
                    {content.waitlistForm.description}
                </p>

                <WaitlistInput />
            </div>
        </section>
    );
}
