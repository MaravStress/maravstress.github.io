import React, { useState } from 'react';
import { 
  Lock, 
  Download, 
  Upload, 
  CloudUpload, 
  CheckCircle, 
  AlertCircle, 
  FileCode, 
  LogIn 
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { db } from '../../firebase';

interface ArchivoTabProps {
  user: FirebaseUser | null;
  bdData: any;
  onUpdateData: (newData: any) => void;
  onGoToLogin: () => void;
}

export default function ArchivoTab({ user, bdData, onUpdateData, onGoToLogin }: ArchivoTabProps) {
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);

  // Export bdData as bd.json download
  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bdData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "bd.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setStatusMessage({ type: 'success', text: 'Archivo bd.json exportado correctamente.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Error al exportar el archivo JSON.' });
    }
  };

  // Import local .json file
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        onUpdateData(parsedData);
        setStatusMessage({ type: 'success', text: `Archivo "${file.name}" importado con éxito.` });
      } catch (err) {
        console.error("Error al parsear archivo JSON:", err);
        setStatusMessage({ type: 'error', text: 'El archivo seleccionado no es un JSON válido.' });
      }
    };
    reader.readAsText(file);
  };

  // Publish bdData exclusively to Realtime Database
  const handlePublishToFirebase = async () => {
    setPublishing(true);
    setStatusMessage(null);

    if (!db) {
      setPublishing(false);
      setStatusMessage({
        type: 'error',
        text: 'Realtime Database no está inicializado. Verifica que `databaseURL` esté configurado en src/firebase/config.ts.'
      });
      return;
    }

    let cleanData: any;
    try {
      cleanData = JSON.parse(JSON.stringify(bdData));
    } catch (e: any) {
      setPublishing(false);
      setStatusMessage({
        type: 'error',
        text: `Los datos no son un JSON válido para publicar: ${e.message}`
      });
      return;
    }

    try {
      await set(ref(db, 'portfolio/bdData'), cleanData);
      setStatusMessage({ 
        type: 'success', 
        text: '¡Datos publicados exitosamente en Realtime Database!' 
      });
    } catch (err: any) {
      console.error("Error al guardar en Realtime Database:", err);
      let errorMsg = err.message || 'Error al conectar con Realtime Database.';
      if (err.code === 'PERMISSION_DENIED' || err.message?.includes('PERMISSION_DENIED')) {
        errorMsg = "Permisos insuficientes. Configura las reglas en Firebase Console (Realtime Database -> Reglas).";
      }
      setStatusMessage({ 
        type: 'error', 
        text: `Error al publicar en Realtime Database: ${errorMsg}` 
      });
    } finally {
      setPublishing(false);
    }
  };

  // If NOT logged in -> Locked State
  if (!user) {
    return (
      <div className="bg-panel border border-panel-border rounded-2xl p-8 md:p-12 text-center flex flex-col items-center gap-6 max-w-xl mx-auto shadow-xl">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
          <Lock className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold mb-2">Apartado Bloqueado</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Para acceder a las opciones de gestión de archivos (Exportar, Importar y Publicar a Firebase), debes iniciar sesión previamente.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToLogin}
          className="px-6 py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-light hover:to-brand-secondary-light text-white font-display font-semibold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          <span>Ir a Iniciar Sesión</span>
        </button>
      </div>
    );
  }

  // LOGGED IN -> Unlocked Archivo Tab
  return (
    <div className="bg-panel border border-panel-border rounded-2xl p-6 md:p-8 flex flex-col gap-8 max-w-4xl mx-auto shadow-xl">
      <div className="flex items-center gap-3 border-b border-panel-border/60 pb-4">
        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
          <FileCode className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold">Gestión de Archivo & Firebase</h2>
          <p className="text-sm text-text-muted">Exporta, importa datos locales o publica la información actualizada en Firebase.</p>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl border text-sm flex items-start gap-3 transition-all ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span className="whitespace-pre-line">{statusMessage.text}</span>
        </div>
      )}

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Exportar */}
        <div className="bg-panel-border/30 border border-panel-border rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-brand-primary/40 transition-colors">
          <div>
            <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-lg w-fit mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">Exportar</h3>
            <p className="text-xs text-text-muted">Descarga el estado actual de los datos en formato .json.</p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="w-full py-3 px-4 bg-panel border border-panel-border hover:bg-brand-primary/10 hover:border-brand-primary hover:text-brand-primary-light text-foreground font-display font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar .json</span>
          </button>
        </div>

        {/* Card 2: Importar */}
        <div className="bg-panel-border/30 border border-panel-border rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-brand-primary/40 transition-colors">
          <div>
            <div className="p-2.5 bg-brand-secondary/10 text-brand-secondary rounded-lg w-fit mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">Importar</h3>
            <p className="text-xs text-text-muted">Carga un archivo .json desde tu equipo para actualizar los datos.</p>
            {importedFileName && (
              <span className="text-[11px] text-brand-secondary font-mono truncate block mt-1">
                Último: {importedFileName}
              </span>
            )}
          </div>

          <label className="w-full py-3 px-4 bg-panel border border-panel-border hover:bg-brand-secondary/10 hover:border-brand-secondary hover:text-brand-secondary-light text-foreground font-display font-semibold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Importar .json</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportFile} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Card 3: Publicar */}
        <div className="bg-panel-border/30 border border-panel-border rounded-xl p-5 flex flex-col justify-between gap-4 hover:border-emerald-500/40 transition-colors">
          <div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit mb-3">
              <CloudUpload className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1">Publicar</h3>
            <p className="text-xs text-text-muted">Sube y sincroniza la estructura de datos directamente en Firebase.</p>
          </div>

          <button
            type="button"
            onClick={handlePublishToFirebase}
            disabled={publishing}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-display font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{publishing ? 'Publicando...' : 'Publicar a Firebase'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
