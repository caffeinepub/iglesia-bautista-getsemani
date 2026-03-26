import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChurchIcon, Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ADMIN_USER = "admin";
const ADMIN_PASS = "getsemani2024";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      toast.success("Bienvenido, Administrador");
      onLogin();
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Church branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ChurchIcon className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-navy leading-tight">
            Iglesia Cristiana Bautista
            <br />
            Getsemani
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de Control de Ofrendas
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium">
                Usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="login.username.input"
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  className="pl-9 h-10"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="login.password.input"
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="pl-9 pr-10 h-10"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                data-ocid="login.error_state"
                className="text-sm text-destructive font-medium text-center"
              >
                {error}
              </p>
            )}

            <Button
              data-ocid="login.submit_button"
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark text-foreground font-semibold h-10 text-sm"
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Hecho con ❤️ usando{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
