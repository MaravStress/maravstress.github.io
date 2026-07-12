import React, { useState, useRef } from 'react';
import { 
    ArrowLeft, 
    Download, 
    Upload, 
    Plus, 
    Trash, 
    Edit, 
    Settings, 
    Layers, 
    Star, 
    Link, 
    AlertCircle, 
    CheckCircle,
    User,
    Check
} from 'lucide-react';
import bd from '../data/bd.json';

interface BackendPanelProps {
    onBack: () => void;
}

export default function BackendPanel({ onBack }: BackendPanelProps) {
    const [bdData, setBdData] = useState<any>(bd);
    const [activeTab, setActiveTab] = useState<'cv' | 'projects' | 'reviews' | 'links'>('cv');
    const [cvUploadStatus, setCvUploadStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
    
    // Sub-toggles for editing arrays
    const [projectType, setProjectType] = useState<'Programming' | '3DAnimations'>('Programming');
    const [reviewType, setReviewType] = useState<'reviews_Programming' | 'reviews_3D'>('reviews_Programming');

    // Forms states
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [projectForm, setProjectForm] = useState({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });

    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [reviewForm, setReviewForm] = useState({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // CV Upload parsing
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

                // Merge into current state
                setBdData((prev: any) => ({
                    ...prev,
                    personalInfo: json.personalInfo,
                    summary: json.summary,
                    experience: json.experience,
                    education: json.education,
                    skills: json.skills,
                    settings: json.settings || prev.settings
                }));

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

    // Download/Export bd.json
    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bdData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "bd.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Manage Projects
    const handleSaveProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectForm.titulo || !projectForm.descripcion) return;

        const tagsArray = projectForm.etiquetas
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        let updatedList = [...(bdData[projectType] || [])];

        if (editingProjectId) {
            // Edit existing
            updatedList = updatedList.map(p => 
                p.id === editingProjectId 
                    ? { ...p, titulo: projectForm.titulo, etiquetas: tagsArray, imagen: projectForm.imagen, descripcion: projectForm.descripcion }
                    : p
            );
            setEditingProjectId(null);
        } else {
            // Add new
            const newProject = {
                id: `${projectType}-${Date.now()}`,
                titulo: projectForm.titulo,
                etiquetas: tagsArray,
                imagen: projectForm.imagen || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
                descripcion: projectForm.descripcion
            };
            updatedList.push(newProject);
        }

        setBdData((prev: any) => ({
            ...prev,
            [projectType]: updatedList
        }));

        setProjectForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });
    };

    const handleEditProject = (project: any) => {
        setEditingProjectId(project.id);
        setProjectForm({
            titulo: project.titulo,
            etiquetas: project.etiquetas.join(', '),
            imagen: project.imagen || '',
            descripcion: project.descripcion
        });
    };

    const handleDeleteProject = (id: string) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este proyecto?')) return;
        setBdData((prev: any) => ({
            ...prev,
            [projectType]: (prev[projectType] || []).filter((p: any) => p.id !== id)
        }));
        if (editingProjectId === id) {
            setEditingProjectId(null);
            setProjectForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });
        }
    };

    // Manage Reviews
    const handleSaveReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewForm.titulo || !reviewForm.descripcion) return;

        const tagsArray = reviewForm.etiquetas
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        let updatedList = [...(bdData[reviewType] || [])];

        if (editingReviewId) {
            // Edit existing
            updatedList = updatedList.map(r => 
                r.id === editingReviewId 
                    ? { ...r, titulo: reviewForm.titulo, etiquetas: tagsArray, descripcion: reviewForm.descripcion }
                    : r
            );
            setEditingReviewId(null);
        } else {
            // Add new
            const newReview = {
                id: `${reviewType}-${Date.now()}`,
                titulo: reviewForm.titulo,
                etiquetas: tagsArray.length > 0 ? tagsArray : ['Upwork', '⭐⭐⭐⭐⭐'],
                imagen: '',
                descripcion: reviewForm.descripcion
            };
            updatedList.push(newReview);
        }

        setBdData((prev: any) => ({
            ...prev,
            [reviewType]: updatedList
        }));

        setReviewForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });
    };

    const handleEditReview = (review: any) => {
        setEditingReviewId(review.id);
        setReviewForm({
            titulo: review.titulo,
            etiquetas: review.etiquetas.join(', '),
            imagen: '',
            descripcion: review.descripcion
        });
    };

    const handleDeleteReview = (id: string) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este testimonio?')) return;
        setBdData((prev: any) => ({
            ...prev,
            [reviewType]: (prev[reviewType] || []).filter((r: any) => r.id !== id)
        }));
        if (editingReviewId === id) {
            setEditingReviewId(null);
            setReviewForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });
        }
    };

    // Manage Links
    const handleLinkChange = (value: string) => {
        setBdData((prev: any) => ({
            ...prev,
            links: {
                ...prev.links,
                upwork: value
            }
        }));
    };

    return (
        <section className="w-full min-h-screen bg-background text-foreground relative overflow-hidden p-6 md:p-12 font-body transition-colors duration-300">
            {/* Ambient glowing shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/15 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-gradient-to-tr from-brand-secondary/15 to-brand-primary/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto z-10 relative flex flex-col gap-8">
                {/* Header Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-panel-border pb-6">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onBack}
                            className="p-2.5 rounded-xl border border-panel-border bg-panel hover:bg-brand-primary/10 hover:border-brand-primary hover:text-brand-primary-light transition-all cursor-pointer group"
                            title="Volver al Sitio"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div>
                            <span className="text-brand-secondary font-display text-xs tracking-widest uppercase font-bold block mb-1">
                                [ CONFIGURACIÓN ]
                            </span>
                            <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
                                <Settings className="w-7 h-7 text-brand-primary animate-spin-slow" />
                                Editor de bd.json (Backend)
                            </h1>
                        </div>
                    </div>

                    <button 
                        onClick={handleExport}
                        className="px-6 py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-light hover:to-brand-secondary-light text-white font-display font-semibold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer self-start md:self-auto"
                    >
                        <Download className="w-5 h-5" />
                        <span>Exportar bd.json</span>
                    </button>
                </div>

                {/* Tabs Selector */}
                <div className="flex border-b border-panel-border/50 gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
                    <button
                        onClick={() => setActiveTab('cv')}
                        className={`px-5 py-3.5 text-sm font-display font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                            activeTab === 'cv'
                                ? 'border-brand-primary text-brand-primary-light'
                                : 'border-transparent text-text-muted hover:text-foreground'
                        }`}
                    >
                        <User className="w-4 h-4" />
                        Curriculum (CV)
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-5 py-3.5 text-sm font-display font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                            activeTab === 'projects'
                                ? 'border-brand-primary text-brand-primary-light'
                                : 'border-transparent text-text-muted hover:text-foreground'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        Proyectos
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-5 py-3.5 text-sm font-display font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                            activeTab === 'reviews'
                                ? 'border-brand-primary text-brand-primary-light'
                                : 'border-transparent text-text-muted hover:text-foreground'
                        }`}
                    >
                        <Star className="w-4 h-4" />
                        Testimonios
                    </button>
                    <button
                        onClick={() => setActiveTab('links')}
                        className={`px-5 py-3.5 text-sm font-display font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                            activeTab === 'links'
                                ? 'border-brand-primary text-brand-primary-light'
                                : 'border-transparent text-text-muted hover:text-foreground'
                        }`}
                    >
                        <Link className="w-4 h-4" />
                        Enlaces
                    </button>
                </div>

                {/* Tab Content */}
                <div className="w-full">
                    {/* TAB CV */}
                    {activeTab === 'cv' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-primary/50">
                                    <h2 className="text-xl font-display font-bold text-foreground">Importar Currículum</h2>
                                    <p className="text-sm text-text-muted leading-relaxed font-light">
                                        Sube un archivo de currículum en formato JSON (como <code className="font-mono text-brand-primary-light text-xs">ELIAM_PAREDES_Data(6).json</code>) para actualizar automáticamente tu información personal, resumen, historial laboral, educación e idiomas.
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
                                        <div className={`p-4 rounded-xl flex gap-3 text-sm border ${
                                            cvUploadStatus.type === 'success' 
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
                                <div className="glass-panel p-6 md:p-8 flex flex-col gap-6 border-t-2 border-t-brand-secondary/50">
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
                    )}

                    {/* TAB PROJECTS */}
                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Side: Form */}
                            <div className="lg:col-span-5">
                                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-primary/50">
                                    <h2 className="text-xl font-display font-bold text-foreground">
                                        {editingProjectId ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}
                                    </h2>
                                    
                                    {/* Selector de tipo */}
                                    <div className="flex rounded-lg bg-background-secondary p-1 border border-panel-border/40">
                                        <button 
                                            onClick={() => { setProjectType('Programming'); setEditingProjectId(null); setProjectForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' }); }}
                                            className={`flex-1 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                                projectType === 'Programming' 
                                                    ? 'bg-brand-primary text-white' 
                                                    : 'text-text-muted hover:text-foreground'
                                            }`}
                                        >
                                            Software / Prog
                                        </button>
                                        <button 
                                            onClick={() => { setProjectType('3DAnimations'); setEditingProjectId(null); setProjectForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' }); }}
                                            className={`flex-1 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                                projectType === '3DAnimations' 
                                                    ? 'bg-brand-primary text-white' 
                                                    : 'text-text-muted hover:text-foreground'
                                            }`}
                                        >
                                            Arte 3D
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted">Título *</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={projectForm.titulo}
                                                onChange={(e) => setProjectForm(prev => ({ ...prev, titulo: e.target.value }))}
                                                placeholder="Ej. Trap Night"
                                                className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted">Etiquetas (separadas por coma) *</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={projectForm.etiquetas}
                                                onChange={(e) => setProjectForm(prev => ({ ...prev, etiquetas: e.target.value }))}
                                                placeholder="Ej. c#, Unity, Game Dev"
                                                className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted">Imagen URL (Unsplash o CDN)</label>
                                            <input 
                                                type="text" 
                                                value={projectForm.imagen}
                                                onChange={(e) => setProjectForm(prev => ({ ...prev, imagen: e.target.value }))}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted font-mono">Descripción * (Soporta Markdown para enlaces `[Texto](http...)` )</label>
                                            <textarea 
                                                required
                                                rows={5}
                                                value={projectForm.descripcion}
                                                onChange={(e) => setProjectForm(prev => ({ ...prev, descripcion: e.target.value }))}
                                                placeholder="Escribe la descripción del proyecto...
Puedes añadir un botón al final usando el formato:
[Ver en Google Play](https://play.google.com/...)"
                                                className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none font-sans"
                                            />
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            {editingProjectId && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => { setEditingProjectId(null); setProjectForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' }); }}
                                                    className="flex-1 py-3 border border-panel-border hover:bg-foreground/5 text-xs font-display font-bold uppercase rounded-lg transition-all cursor-pointer"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                            <button 
                                                type="submit" 
                                                className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-display font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                {editingProjectId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                <span>{editingProjectId ? 'Guardar' : 'Agregar'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right Side: List */}
                            <div className="lg:col-span-7">
                                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-secondary/50">
                                    <h2 className="text-xl font-display font-bold text-foreground">
                                        Proyectos Registrados ({projectType === 'Programming' ? 'Software' : 'Arte 3D'})
                                    </h2>

                                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
                                        {(bdData[projectType] || []).length === 0 ? (
                                            <p className="text-sm text-text-muted italic py-4 text-center">No hay proyectos registrados en esta categoría.</p>
                                        ) : (
                                            (bdData[projectType] || []).map((project: any) => (
                                                <div 
                                                    key={project.id}
                                                    className="p-4 bg-background-secondary rounded-xl border border-panel-border/30 flex items-start justify-between gap-4 hover:border-brand-primary/20 transition-all group"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-display font-bold text-sm text-foreground mb-1 line-clamp-1">{project.titulo}</h3>
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {project.etiquetas.map((tag: string, idx: number) => (
                                                                <span key={idx} className="text-[9px] font-mono bg-panel border border-panel-border/50 px-1.5 py-0.5 rounded text-text-muted">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-text-muted leading-relaxed font-light line-clamp-2">{project.descripcion}</p>
                                                    </div>

                                                    <div className="flex gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEditProject(project)}
                                                            className="p-1.5 rounded bg-panel hover:bg-brand-secondary/15 hover:text-brand-secondary border border-panel-border/40 transition-all cursor-pointer"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteProject(project.id)}
                                                            className="p-1.5 rounded bg-panel hover:bg-red-500/10 hover:text-red-400 border border-panel-border/40 transition-all cursor-pointer"
                                                            title="Eliminar"
                                                        >
                                                            <Trash className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB REVIEWS */}
                    {activeTab === 'reviews' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Side: Form */}
                            <div className="lg:col-span-5">
                                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-primary/50">
                                    <h2 className="text-xl font-display font-bold text-foreground">
                                        {editingReviewId ? 'Editar Testimonio' : 'Agregar Nuevo Testimonio'}
                                    </h2>
                                    
                                    {/* Selector de tipo */}
                                    <div className="flex rounded-lg bg-background-secondary p-1 border border-panel-border/40">
                                        <button 
                                            onClick={() => { setReviewType('reviews_Programming'); setEditingReviewId(null); setReviewForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' }); }}
                                            className={`flex-1 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                                reviewType === 'reviews_Programming' 
                                                    ? 'bg-brand-primary text-white' 
                                                    : 'text-text-muted hover:text-foreground'
                                            }`}
                                        >
                                            Software / Prog
                                        </button>
                                        <button 
                                            onClick={() => { setReviewType('reviews_3D'); setEditingReviewId(null); setReviewForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' }); }}
                                            className={`flex-1 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                                reviewType === 'reviews_3D' 
                                                    ? 'bg-brand-primary text-white' 
                                                    : 'text-text-muted hover:text-foreground'
                                            }`}
                                        >
                                            Arte 3D
                                        </button>
                                    </div>

                                    <form onSubmit={handleSaveReview} className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted">Título del Trabajo / Cargo *</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={reviewForm.titulo}
                                                onChange={(e) => setReviewForm(prev => ({ ...prev, titulo: e.target.value }))}
                                                placeholder="Ej. Game Developer, 3D Animator"
                                                className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted">Etiquetas (ej. plataforma, estrellas) *</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={reviewForm.etiquetas}
                                                onChange={(e) => setReviewForm(prev => ({ ...prev, etiquetas: e.target.value }))}
                                                placeholder="Ej. Upwork, ⭐⭐⭐⭐⭐"
                                                className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-display font-bold uppercase tracking-wider text-text-muted">Descripción de la Reseña *</label>
                                            <textarea 
                                                required
                                                rows={6}
                                                value={reviewForm.descripcion}
                                                onChange={(e) => setReviewForm(prev => ({ ...prev, descripcion: e.target.value }))}
                                                placeholder="Ej.
Client's review
Rating is 5.0 out of 5.
⭐⭐⭐⭐⭐ 5.0
Dec 22, 2024
'Eliam did an amazing job on our 3D animation project! ...'"
                                                className="w-full px-4 py-2.5 rounded-lg bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none font-sans"
                                            />
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            {editingReviewId && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => { setEditingReviewId(null); setReviewForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' }); }}
                                                    className="flex-1 py-3 border border-panel-border hover:bg-foreground/5 text-xs font-display font-bold uppercase rounded-lg transition-all cursor-pointer"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                            <button 
                                                type="submit" 
                                                className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary-light text-white text-xs font-display font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                {editingReviewId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                <span>{editingReviewId ? 'Guardar' : 'Agregar'}</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right Side: List */}
                            <div className="lg:col-span-7">
                                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-secondary/50">
                                    <h2 className="text-xl font-display font-bold text-foreground">
                                        Testimonios Registrados ({reviewType === 'reviews_Programming' ? 'Software' : 'Arte 3D'})
                                    </h2>

                                    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
                                        {(bdData[reviewType] || []).length === 0 ? (
                                            <p className="text-sm text-text-muted italic py-4 text-center">No hay testimonios registrados en esta categoría.</p>
                                        ) : (
                                            (bdData[reviewType] || []).map((review: any) => (
                                                <div 
                                                    key={review.id}
                                                    className="p-4 bg-background-secondary rounded-xl border border-panel-border/30 flex items-start justify-between gap-4 hover:border-brand-primary/20 transition-all group"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-display font-bold text-sm text-foreground mb-1 line-clamp-1">{review.titulo}</h3>
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {review.etiquetas.map((tag: string, idx: number) => (
                                                                <span key={idx} className="text-[9px] font-mono bg-panel border border-panel-border/50 px-1.5 py-0.5 rounded text-text-muted">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-text-muted leading-relaxed font-light line-clamp-3 whitespace-pre-line">{review.descripcion}</p>
                                                    </div>

                                                    <div className="flex gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEditReview(review)}
                                                            className="p-1.5 rounded bg-panel hover:bg-brand-secondary/15 hover:text-brand-secondary border border-panel-border/40 transition-all cursor-pointer"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            className="p-1.5 rounded bg-panel hover:bg-red-500/10 hover:text-red-400 border border-panel-border/40 transition-all cursor-pointer"
                                                            title="Eliminar"
                                                        >
                                                            <Trash className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB LINKS */}
                    {activeTab === 'links' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="glass-panel p-6 md:p-8 flex flex-col gap-6 border-t-2 border-t-brand-primary/50">
                                <h2 className="text-xl font-display font-bold text-foreground">Gestionar Enlaces del Sitio</h2>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-display font-bold uppercase tracking-wider text-brand-secondary-light">URL de Freelancer en Upwork</label>
                                    <input 
                                        type="url" 
                                        value={bdData.links?.upwork || ''}
                                        onChange={(e) => handleLinkChange(e.target.value)}
                                        placeholder="https://www.upwork.com/freelancers/..."
                                        className="w-full px-5 py-3.5 rounded-xl bg-background-secondary border border-panel-border text-sm text-foreground focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
                                    />
                                    <span className="text-[10px] text-text-muted font-light leading-relaxed mt-1">
                                        Este enlace se aplica automáticamente en los accesos de Upwork del encabezado (Hero) y del bloque de enlaces profesionales.
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
