import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {

      if (true) {
        toast.error(true);
      } else {
        toast.success("Verifique seu email para confirmar o cadastro!");
      }
    } else {

    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-foreground">
              CASH<span className="text-neon">BACK</span>
            </span>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 glow-neon">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">
            {isSignup ? "Criar Conta" : "Entrar"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-muted border-border focus:border-primary" placeholder="admin@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="bg-muted border-border focus:border-primary" placeholder="••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full font-heading text-lg tracking-wider uppercase h-12">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : isSignup ? "Cadastrar" : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignup ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline font-medium">
              {isSignup ? "Entrar" : "Cadastrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
