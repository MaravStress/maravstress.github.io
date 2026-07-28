import { useState } from 'react';
import { Loader2, Check, SquarePlus } from 'lucide-react';
import { usePortfolioData } from '../../context/DataContext';

export default function WaitlistInput() {
    const { data: content } = usePortfolioData();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Simula registro exitoso (sin base de datos/BaaS)
        setTimeout(() => {
            setStatus('success');
            setMessage(content.waitlistInput.successMessage);
            setEmail('');
        }, 800);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
            <div className="relative flex items-center">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.waitlistInput.placeholder}
                    required
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full pl-6 pr-16 py-4 rounded-full bg-panel border border-panel-border text-foreground placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50"
                />
                <button
                    type="submit"
                    title={content.waitlistInput.buttonTitle}
                    disabled={status === 'loading' || status === 'success'}
                    className="absolute right-2 p-3 rounded-full bg-brand-primary text-white hover:bg-brand-primary-light hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-brand-primary disabled:hover:scale-100 shadow-lg shadow-brand-primary/20 flex items-center justify-center group"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : status === 'success' ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <SquarePlus className="w-5 h-5" />
                    )}
                </button>
            </div>

            {message && (
                <p className={`text-sm font-medium text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
