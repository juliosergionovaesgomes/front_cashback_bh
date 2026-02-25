import { Suspense, lazy } from "react";
import heroBg from "@/assets/hero-bg.png";
import { Shield, Zap, Trophy, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// Lazy load CashbackForm
const CashbackForm = lazy(() => import("@/components/CashbackForm"));

const Index = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold tracking-wider text-foreground">
              CASH<span className="text-neon">BACK</span> BH
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Olá, {user?.name}
                </span>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 font-heading tracking-wider">
                    <Settings className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground font-heading tracking-wider"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 font-heading tracking-wider">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="CS2 Esports Background" className="w-full h-full object-cover opacity-40" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative container py-24 md:py-36 text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-wider mb-6">
            <span className="text-foreground">RESGATE SEU</span>
            <br />
            <span className="text-neon">CASHBACK</span>
          </h1>
          <p className="font-heading text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Preencha o formulário abaixo e receba seu cashback diretamente via PIX. 
            Rápido, seguro e sem complicações.
          </p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-heading">Pagamento Rápido</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-secondary" />
              <span className="font-heading">100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-heading">Via PIX</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative pb-24" id="form">
        <div className="container max-w-2xl">
          <div className="bg-card border border-border rounded-lg p-6 md:p-10 glow-neon">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              }
            >
              <CashbackForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground font-heading">
          © {new Date().getFullYear()} Cashback CS Esports. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Index;
