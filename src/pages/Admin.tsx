import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Download, Search, Users, FileSpreadsheet, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "@/contexts/AuthContext";
import { cashbackService, CashbackEntry } from "@/lib/mockData";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState<CashbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchSubmissions();
  }, [navigate, user]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await cashbackService.getAllEntries();
      setSubmissions(data);
      toast.success(`${data.length} solicitações carregadas`);
    } catch (error) {
      toast.error("Erro ao carregar dados.");
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await cashbackService.updateStatus(id, status as CashbackEntry['status']);
      await fetchSubmissions(); // Reload data
      toast.success(`Status atualizado para ${status}`);
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const exportToExcel = () => {
    const exportData = filtered.map(s => ({
      "Nome": s.customerName,
      "Email": s.email,
      "CPF": s.cpf,
      "Telefone": s.phone,
      "Loja": s.store,
      "Categoria": s.category,
      "Valor Compra (R$)": s.purchaseValue,
      "Cashback %": s.cashbackPercent,
      "Valor Cashback (R$)": s.cashbackValue,
      "Status": s.status,
      "Data": s.createdAt.toLocaleDateString("pt-BR"),
      "Aprovado em": s.approvedAt ? s.approvedAt.toLocaleDateString("pt-BR") : "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cashback");
    XLSX.writeFile(wb, `cashback_relatorio_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Relatório exportado!");
  };

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const filtered = submissions.filter(s => {
    const matchSearch = search === "" ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.cpf.toLowerCase().includes(search.toLowerCase()) ||
      s.store.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAmount = filtered.reduce((acc, s) => acc + Number(s.cashbackValue), 0);

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved": return "bg-primary/20 text-primary border-primary/30";
      case "rejected": return "bg-destructive/20 text-destructive border-destructive/30";
      case "paid": return "bg-secondary/20 text-secondary border-secondary/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-muted-foreground">Acesso Negado</h2>
          <p className="text-muted-foreground mb-4">Você precisa ser administrador para acessar esta página.</p>
          <Button onClick={() => navigate('/login')}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">
                ADMIN <span className="text-neon">PANEL</span>
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin" 
                className="text-sm font-medium text-primary border-b border-primary/50"
              >
                Admin
              </Link>
            </nav>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-5 glow-neon">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground font-heading">Total Solicitações</p>
                <p className="text-3xl font-display font-bold text-foreground">{submissions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground font-heading">Total Cashback (filtrado)</p>
                <p className="text-3xl font-display font-bold text-foreground">
                  R$ {totalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3">
              <Download className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground font-heading mb-1">Exportar Relatório</p>
                <Button onClick={exportToExcel} size="sm" className="font-heading tracking-wider">
                  <Download className="h-4 w-4 mr-1" /> Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, CPF ou loja..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-card border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchSubmissions} className="border-border">
            <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="font-heading text-muted-foreground">Nome</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Email</TableHead>
                  <TableHead className="font-heading text-muted-foreground">CPF</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Loja</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Categoria</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Valor Compra</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Cashback</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Status</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Data</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground">Nenhuma solicitação encontrada.</TableCell></TableRow>
                ) : (
                  filtered.map(s => (
                    <TableRow key={s.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium">{s.customerName}</TableCell>
                      <TableCell className="text-sm">{s.email}</TableCell>
                      <TableCell className="text-xs font-mono">{s.cpf}</TableCell>
                      <TableCell className="text-sm">{s.store}</TableCell>
                      <TableCell className="text-sm">{s.category}</TableCell>
                      <TableCell className="font-mono">R$ {Number(s.purchaseValue).toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-primary">R$ {Number(s.cashbackValue).toFixed(2)} ({s.cashbackPercent}%)</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor(s.status)}>
                          {s.status === "pending" ? "Pendente" : s.status === "approved" ? "Aprovado" : s.status === "rejected" ? "Rejeitado" : "Pago"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.createdAt.toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Select value={s.status} onValueChange={(val) => updateStatus(s.id, val)}>
                          <SelectTrigger className="w-28 h-8 text-xs bg-muted border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="approved">Aprovado</SelectItem>
                            <SelectItem value="rejected">Rejeitado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
