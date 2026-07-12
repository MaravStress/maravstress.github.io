import React, { useState } from 'react';
import { Plus, Trash, Edit, Check } from 'lucide-react';

interface ReviewEditorProps {
    bdData: any;
    onUpdateReviews: (type: 'reviews_Programming' | 'reviews_3D', newList: any[]) => void;
}

export default function ReviewEditor({ bdData, onUpdateReviews }: ReviewEditorProps) {
    const [reviewType, setReviewType] = useState<'reviews_Programming' | 'reviews_3D'>('reviews_Programming');
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [reviewForm, setReviewForm] = useState({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });

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

        onUpdateReviews(reviewType, updatedList);
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
        const updatedList = (bdData[reviewType] || []).filter((r: any) => r.id !== id);
        onUpdateReviews(reviewType, updatedList);
        if (editingReviewId === id) {
            setEditingReviewId(null);
            setReviewForm({ titulo: '', etiquetas: '', imagen: '', descripcion: '' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Form */}
            <div className="lg:col-span-5">
                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-primary/50 bg-panel">
                    <h2 className="text-xl font-display font-bold text-foreground">
                        {editingReviewId ? 'Editar Testimonio' : 'Agregar Nuevo Testimonio'}
                    </h2>
                    
                    {/* Selector de tipo */}
                    <div className="flex rounded-lg bg-background-secondary p-1 border border-panel-border/40">
                        <button 
                            type="button"
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
                            type="button"
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
                <div className="glass-panel p-6 md:p-8 flex flex-col gap-5 border-t-2 border-t-brand-secondary/50 bg-panel">
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
                                            type="button"
                                            onClick={() => handleEditReview(review)}
                                            className="p-1.5 rounded bg-panel hover:bg-brand-secondary/15 hover:text-brand-secondary border border-panel-border/40 transition-all cursor-pointer"
                                            title="Editar"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            type="button"
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
    );
}
