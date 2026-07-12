
interface LinkEditorProps {
    links: any;
    onUpdateLink: (key: string, value: string) => void;
}

export default function LinkEditor({ links, onUpdateLink }: LinkEditorProps) {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-6 md:p-8 flex flex-col gap-6 border-t-2 border-t-brand-primary/50 bg-panel">
                <h2 className="text-xl font-display font-bold text-foreground">Gestionar Enlaces del Sitio</h2>
                
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-display font-bold uppercase tracking-wider text-brand-secondary-light">URL de Freelancer en Upwork</label>
                    <input 
                        type="url" 
                        value={links?.upwork || ''}
                        onChange={(e) => onUpdateLink('upwork', e.target.value)}
                        placeholder="https://www.upwork.com/freelancers/..."
                        className="w-full px-5 py-3.5 rounded-xl bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                    />
                    <span className="text-[10px] text-text-muted font-light leading-relaxed mt-1">
                        Este enlace se aplica automáticamente en los accesos de Upwork del encabezado (Hero) y del bloque de enlaces profesionales.
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-display font-bold uppercase tracking-wider text-brand-primary-light">URL de GitHub</label>
                    <input 
                        type="url" 
                        value={links?.github || ''}
                        onChange={(e) => onUpdateLink('github', e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-5 py-3.5 rounded-xl bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                    <span className="text-[10px] text-text-muted font-light leading-relaxed mt-1">
                        Este enlace se aplica automáticamente en los accesos de GitHub del encabezado (Hero) y del bloque de enlaces profesionales.
                    </span>
                </div>
            </div>
        </div>
    );
}
