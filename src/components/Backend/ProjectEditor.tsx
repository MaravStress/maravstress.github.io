import React, { useState } from 'react';
import { Plus, Trash, Edit, Check } from 'lucide-react';

interface ProjectEditorProps {
    bdData: any;
    onUpdateProjects: (type: 'Programming' | '3DAnimations', newList: any[]) => void;
}

export default function ProjectEditor({ bdData, onUpdateProjects }: ProjectEditorProps) {
    const [projectType, setProjectType] = useState<'Programming' | '3DAnimations'>('Programming');
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [projectForm, setProjectForm] = useState({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });

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

        onUpdateProjects(projectType, updatedList);
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
        const updatedList = (bdData[projectType] || []).filter((p: any) => p.id !== id);
        onUpdateProjects(projectType, updatedList);
        if (editingProjectId === id) {
            setEditingProjectId(null);
            setProjectForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Form */}
            <div className="lg:col-span-5">
                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-primary/50 bg-panel">
                    <h2 className="text-xl font-display font-bold text-foreground">
                        {editingProjectId ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}
                    </h2>
                    
                    {/* Selector de tipo */}
                    <div className="flex rounded-lg bg-background-secondary p-1 border border-panel-border/40">
                        <button 
                            type="button"
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
                            type="button"
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
                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-secondary/50 bg-panel">
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
                                            type="button"
                                            onClick={() => handleEditProject(project)}
                                            className="p-1.5 rounded bg-panel hover:bg-brand-secondary/15 hover:text-brand-secondary border border-panel-border/40 transition-all cursor-pointer"
                                            title="Editar"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            type="button"
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
    );
}
