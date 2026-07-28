import { useState, useEffect } from 'react';
import { User, LogOut, ShieldCheck, AlertCircle, Copy, Check, Lock, ShieldAlert } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, ADMIN_EMAIL } from '../../firebase';

interface LoginTabProps {
  user: FirebaseUser | null;
}

export default function LoginTab({ user }: LoginTabProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  // Verify and auto-logout on load or state change if user is not eliamjesusparedes@gmail.com
  useEffect(() => {
    if (user && user.email) {
      if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        signOut(auth).then(() => {
          setError(`⛔ Acceso Denegado: Solo la cuenta "${ADMIN_EMAIL}" está autorizada. La sesión fue cerrada automáticamente.`);
        });
      }
    }
  }, [user]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      if (!currentUser.email || currentUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        // AUTO-LOGOUT: Account is not eliamjesusparedes@gmail.com
        await signOut(auth);
        setError(`⛔ Acceso Denegado: La cuenta "${currentUser.email || 'desconocida'}" no está autorizada. Solo la cuenta "${ADMIN_EMAIL}" tiene acceso al panel de administración.`);
      }
    } catch (err: any) {
      console.error("Error al iniciar sesión con Google:", err);
      if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError('El proveedor de Google no está habilitado en la consola de Firebase. Habilítalo en Firebase Console -> Authentication -> Sign-in method -> Google.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('El inicio de sesión fue cancelado.');
      } else {
        setError(err.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Error al cerrar sesión:", err);
      setError('Error al cerrar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'uid' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'uid') {
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="bg-panel border border-panel-border rounded-2xl p-6 md:p-8 flex flex-col gap-6 max-w-2xl mx-auto shadow-xl">
      <div className="flex items-center gap-3 border-b border-panel-border/60 pb-4">
        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold">Autenticación (Firebase Login)</h2>
          <p className="text-sm text-text-muted">Inicia sesión con tu cuenta de administrador para gestionar tu sitio.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {user ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-panel-border/30 border border-panel-border">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Usuario'} 
                className="w-14 h-14 rounded-full border-2 border-brand-primary object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xl">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg">{user.displayName || 'Usuario Autenticado'}</span>
              <span className="text-sm text-text-muted">{user.email}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Sesión Activa de Administrador
              </span>
            </div>
          </div>

          {/* User Identifiers Box */}
          <div className="bg-panel-border/20 border border-panel-border rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs uppercase font-bold tracking-wider text-brand-secondary">
              [ Tus Credenciales de Firebase para las Reglas ]
            </span>
            
            {/* User ID (UID) */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-panel border border-panel-border">
              <div className="flex flex-col truncate">
                <span className="text-[10px] text-text-muted uppercase font-bold">User ID (UID)</span>
                <span className="text-xs font-mono font-bold text-brand-primary-light truncate">{user.uid}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(user.uid, 'uid')}
                className="px-3 py-1.5 text-xs font-display font-semibold rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary-light transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copiedUid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUid ? '¡Copiado!' : 'Copiar UID'}</span>
              </button>
            </div>

            {/* Email */}
            {user.email && (
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-panel border border-panel-border">
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Email de Administrador</span>
                  <span className="text-xs font-mono font-bold text-foreground truncate">{user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(user.email!, 'email')}
                  className="px-3 py-1.5 text-xs font-display font-semibold rounded-lg bg-panel-border/50 hover:bg-panel-border text-foreground transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? '¡Copiado!' : 'Copiar Email'}</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-display font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span>{loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 text-center items-center py-4">
          <div className="w-16 h-16 rounded-full bg-panel-border/50 flex items-center justify-center text-text-muted">
            <User className="w-8 h-8" />
          </div>
          <p className="text-sm text-text-muted max-w-md">
            Inicia sesión con tu cuenta de Google. Si te logeas con una cuenta no autorizada, la sesión se cerrará automáticamente.
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-light hover:to-brand-secondary-light text-white font-display font-semibold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.96 15.7 18 12.24 18c-3.315 0-6-2.685-6-6s2.685-6 6-6c1.55 0 2.95.58 4.02 1.53l2.365-2.365C17.16 3.735 14.85 3 12.24 3 7.27 3 3 7.27 3 12.27s4.27 9.27 9.24 9.27c5.62 0 9.33-3.95 9.33-9.5 0-.64-.06-1.26-.17-1.755H12.24z"/>
            </svg>
            <span>{loading ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

