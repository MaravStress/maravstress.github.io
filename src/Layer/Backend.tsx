import { useState } from 'react';
import { 
    ArrowLeft, 
    Download, 
    Settings, 
    Layers, 
    Star, 
    Link, 
    User
} from 'lucide-react';
import bd from '../data/bd.json';
import CvEditor from '../components/Backend/CvEditor';
import ProjectEditor from '../components/Backend/ProjectEditor';
import ReviewEditor from '../components/Backend/ReviewEditor';
import LinkEditor from '../components/Backend/LinkEditor';

interface BackendProps {
    onBack: () => void;
}

export default function Backend({ onBack }: BackendProps) {
    const [bdData, setBdData] = useState<any>(bd);
    const [activeTab, setActiveTab] = useState<'cv' | 'projects' | 'reviews' | 'links'>('cv');

    const handleUpdateCv = (json: any) => {
        setBdData((prev: any) => ({
            ...prev,
            personalInfo: json.personalInfo,
            summary: json.summary,
            experience: json.experience,
            education: json.education,
            skills: json.skills,
            settings: json.settings || prev.settings
        }));
    };

    const handleUpdateProjects = (type: 'Programming' | '3DAnimations', newList: any[]) => {
        setBdData((prev: any) => ({
            ...prev,
            [type]: newList
        }));
    };

    const handleUpdateReviews = (type: 'reviews_Programming' | 'reviews_3D', newList: any[]) => {
        setBdData((prev: any) => ({
            ...prev,
            [type]: newList
        }));
    };

    const handleUpdateLink = (key: string, value: string) => {
        setBdData((prev: any) => ({
            ...prev,
            links: {
                ...prev.links,
                [key]: value
            }
        }));
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
                            type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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
                        type="button"
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
                    {activeTab === 'cv' && (
                        <CvEditor bdData={bdData} onUpdateCv={handleUpdateCv} />
                    )}

                    {activeTab === 'projects' && (
                        <ProjectEditor bdData={bdData} onUpdateProjects={handleUpdateProjects} />
                    )}

                    {activeTab === 'reviews' && (
                        <ReviewEditor bdData={bdData} onUpdateReviews={handleUpdateReviews} />
                    )}

                    {activeTab === 'links' && (
                        <LinkEditor links={bdData.links} onUpdateLink={handleUpdateLink} />
                    )}
                </div>
            </div>
        </section>
    );
}
