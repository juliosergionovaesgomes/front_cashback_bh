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

interface Submission {
  id: string;
  full_name: string;
  email: string;
  steam_id: string;
  game_nickname: string;
  phone: string | null;
  pix_key: string;
  amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {

      await fetchSubmissions();
    };
    init();
  }, [navigate]);

  const fetchSubmissions = async () => {
    setLoading(true);


    if (true) {
      toast.error("Erro ao carregar dados.");
    } else {
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {

    if (true) {
      toast.error("Erro ao atualizar status.");
    } else {
    }
  };

  const exportToExcel = () => {
    const exportData = filtered.map(s => ({
      "Nome": s.full_name,
      "Email": s.email,
      "Steam ID": s.steam_id,
      "Nickname": s.game_nickname,
      "Telefone": s.phone || "",
      "Chave PIX": s.pix_key,
      "Valor (R$)": s.amount,
      "Status": s.status,
      "Observações": s.notes || "",
      "Data": new Date(s.created_at).toLocaleDateString("pt-BR"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cashback");
    XLSX.writeFile(wb, `cashback_relatorio_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Relatório exportado!");
  };

  const handleLogout = async () => {
  };

  const filtered = submissions.filter(s => {
    const matchSearch = search === "" ||
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.game_nickname.toLowerCase().includes(search.toLowerCase()) ||
      s.steam_id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalAmount = filtered.reduce((acc, s) => acc + Number(s.amount), 0);

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved": return "bg-primary/20 text-primary border-primary/30";
      case "rejected": return "bg-destructive/20 text-destructive border-destructive/30";
      case "paid": return "bg-secondary/20 text-secondary border-secondary/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (userRole !== "admin") return null;

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">
              ADMIN <span className="text-neon">PANEL</span>
            </span>
          </Link>
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
                <p className="text-sm text-muted-foreground font-heading">Total Valor (filtrado)</p>
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
              placeholder="Buscar por nome, email, nickname ou steam ID..."
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
                  <TableHead className="font-heading text-muted-foreground">Nickname</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Steam ID</TableHead>
                  <TableHead className="font-heading text-muted-foreground">PIX</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Valor</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Status</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Data</TableHead>
                  <TableHead className="font-heading text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12 text-muted-foreground">Carregando...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12 text-muted-foreground">Nenhuma solicitação encontrada.</TableCell></TableRow>
                ) : (
                  filtered.map(s => (
                    <TableRow key={s.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium">{s.full_name}</TableCell>
                      <TableCell className="text-sm">{s.email}</TableCell>
                      <TableCell className="text-primary font-medium">{s.game_nickname}</TableCell>
                      <TableCell className="text-xs font-mono">{s.steam_id}</TableCell>
                      <TableCell className="text-xs">{s.pix_key}</TableCell>
                      <TableCell className="font-mono">R$ {Number(s.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor(s.status)}>
                          {s.status === "pending" ? "Pendente" : s.status === "approved" ? "Aprovado" : s.status === "rejected" ? "Rejeitado" : "Pago"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Select value={s.status} onValueChange={(val) => updateStatus(s.id, val)}>
                          <SelectTrigger className="w-28 h-8 text-xs bg-muted border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="approved">Aprovado</SelectItem>
                            <SelectItem value="rejected">Rejeitado</SelectItem>
                            <SelectItem value="paid">Pago</SelectItem>
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
