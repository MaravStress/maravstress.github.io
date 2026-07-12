import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface CvEditorProps {
    bdData: any;
    onUpdateCv: (json: any) => void;
}

export default function CvEditor({ bdData, onUpdateCv }: CvEditorProps) {
    const [cvUploadStatus, setCvUploadStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);

                // Validate schema loosely
                if (!json.personalInfo || !json.summary || !json.experience || !json.education || !json.skills) {
                    setCvUploadStatus({
                        type: 'error',
                        message: 'El archivo JSON no cumple con la estructura requerida del currículum (debe contener personalInfo, summary, experience, education, skills).'
                    });
                    return;
                }

                // Merge into current state in parent
                onUpdateCv(json);

                setCvUploadStatus({
                    type: 'success',
                    message: `Currículum de ${json.personalInfo.name} importado exitosamente con ${json.experience.length} experiencias y ${json.skills.length} categorías de habilidades.`
                });
            } catch (err) {
                setCvUploadStatus({
                    type: 'error',
                    message: 'Error al parsear el archivo JSON. Asegúrese de que sea un archivo JSON válido.'
                });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-primary/50 bg-panel">
                    <h2 className="text-xl font-display font-bold text-foreground">Importar Currículum</h2>
                    <p className="text-sm text-text-muted leading-relaxed font-light">
                        Sube un archivo de currículum en formato JSON exportado de <a href="https://maravstress.github.io/CV_buildeao/" target="_blank" rel="noopener noreferrer" className="text-brand-primary-light underline hover:text-brand-primary transition-colors font-semibold">CV Builder</a>  para actualizar automáticamente tu información personal, resumen, historial laboral, educación e idiomas.
                    </p>

                    {/* Upload Trigger Dropzone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-panel-border hover:border-brand-secondary/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-foreground/[0.01] hover:bg-foreground/[0.02] cursor-pointer transition-all group"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleCvUpload}
                            accept=".json"
                            className="hidden"
                        />
                        <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-full group-hover:bg-brand-secondary group-hover:text-white transition-all">
                            <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-display font-bold uppercase tracking-wider text-text-muted group-hover:text-foreground">Seleccionar Archivo JSON</span>
                        <span className="text-[10px] text-text-muted/60 font-mono">Formato aceptado: .json</span>
                    </div>

                    {/* Upload Status Feedbacks */}
                    {cvUploadStatus.type !== 'idle' && (
                        <div className={`p-4 rounded-xl flex gap-3 text-sm border ${cvUploadStatus.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                            }`}>
                            {cvUploadStatus.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <span className="leading-relaxed">{cvUploadStatus.message}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="glass-panel p-6 md:p-8 flex flex-col gap-6 border-t-2 border-t-brand-secondary/50 bg-panel">
                    <h2 className="text-xl font-display font-bold text-foreground">Datos del Currículum Actual</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-background-secondary rounded-xl border border-panel-border/30">
                            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted block mb-1">Nombre</span>
                            <span className="text-sm font-semibold font-display text-foreground">{bdData.personalInfo?.name || 'N/A'}</span>
                        </div>
                        <div className="p-4 bg-background-secondary rounded-xl border border-panel-border/30">
                            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted block mb-1">Ubicación</span>
                            <span className="text-sm font-semibold font-display text-foreground">{bdData.personalInfo?.location || 'N/A'}</span>
                        </div>
                        <div className="p-4 bg-background-secondary rounded-xl border border-panel-border/30">
                            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted block mb-1">Email</span>
                            <span className="text-sm font-mono text-foreground">{bdData.personalInfo?.email || 'N/A'}</span>
                        </div>
                        <div className="p-4 bg-background-secondary rounded-xl border border-panel-border/30">
                            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted block mb-1">Experiencia Laboral</span>
                            <span className="text-sm font-semibold font-display text-foreground">{(bdData.experience || []).length} puestos</span>
                        </div>
                    </div>

                    <div className="p-4 bg-background-secondary rounded-xl border border-panel-border/30">
                        <span className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted block mb-1.5">Resumen de Perfil</span>
                        <p className="text-xs text-text-muted leading-relaxed font-light">{bdData.summary || 'N/A'}</p>
                    </div>

                    <div>
                        <span className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted block mb-2">Categorías de Habilidades</span>
                        <div className="flex flex-wrap gap-1.5">
                            {(bdData.skills || []).map((s: any, idx: number) => (
                                <span key={idx} className="text-[10px] font-mono bg-panel border border-panel-border px-2.5 py-1 rounded text-text-muted">
                                    {s.categoryName} ({s.skills.length})
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
