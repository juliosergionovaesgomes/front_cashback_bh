import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, LogOut, Download, Search, Users, FileSpreadsheet, RefreshCw, DollarSign, TrendingUp } from "lucide-react";
import * as XLSX from "xlsx";
import { cashbackService, CashbackEntry } from "@/lib/mockData";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<CashbackEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<CashbackEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, statusFilter]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await cashbackService.getAllEntries();
      setEntries(data);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.cpf.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    setFilteredEntries(filtered);
  };

  const handleStatusChange = async (id: string, newStatus: CashbackEntry['status']) => {
    try {
      await cashbackService.updateStatus(id, newStatus);
      setEntries(prev => prev.map(entry => 
        entry.id === id 
          ? { ...entry, status: newStatus, ...(newStatus === 'approved' ? { approvedAt: new Date() } : {}) }
          : entry
      ));
      toast.success(`Status atualizado para ${newStatus}`);
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredEntries.map(entry => ({
      'Nome do Cliente': entry.customerName,
      'Email': entry.email,
      'Telefone': entry.phone,
      'CPF': entry.cpf,
      'Valor da Compra': `R$ ${entry.purchaseValue.toFixed(2)}`,
      'Percentual Cashback': `${entry.cashbackPercent}%`,
      'Valor Cashback': `R$ ${entry.cashbackValue.toFixed(2)}`,
      'Status': entry.status === 'pending' ? 'Pendente' : 
                entry.status === 'approved' ? 'Aprovado' : 'Rejeitado',
      'Loja': entry.store,
      'Categoria': entry.category,
      'Data de Criação': entry.createdAt.toLocaleDateString('pt-BR'),
      'Data de Aprovação': entry.approvedAt ? entry.approvedAt.toLocaleDateString('pt-BR') : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cashback Data");
    
    // Auto-adjust column widths
    const cols = [
      { width: 20 }, // Nome do Cliente
      { width: 25 }, // Email  
      { width: 15 }, // Telefone
      { width: 15 }, // CPF
      { width: 15 }, // Valor da Compra
      { width: 18 }, // Percentual Cashback
      { width: 15 }, // Valor Cashback
      { width: 12 }, // Status
      { width: 20 }, // Loja
      { width: 15 }, // Categoria
      { width: 15 }, // Data de Criação
      { width: 15 }, // Data de Aprovação
    ];
    ws['!cols'] = cols;
    
    const fileName = `cashback_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Arquivo ${fileName} exportado com sucesso!`);
  };

  const getStatusBadgeVariant = (status: CashbackEntry['status']) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: CashbackEntry['status']) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  // Calculate statistics
  const totalCashback = filteredEntries.reduce((sum, entry) => sum + entry.cashbackValue, 0);
  const approvedCashback = filteredEntries
    .filter(entry => entry.status === 'approved')
    .reduce((sum, entry) => sum + entry.cashbackValue, 0);
  const pendingEntries = filteredEntries.filter(entry => entry.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Cashback</h1>
                  <p className="text-sm text-gray-500">Bem-vindo(a), {user?.name}</p>
                </div>
              </Link>
              <nav className="flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium text-primary border-b border-primary/50"
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </nav>
            </div>
            <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredEntries.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingEntries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cashback Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalCashback.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cashback Aprovado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {approvedCashback.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gerenciar Cashback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="rejected">Rejeitados</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button onClick={loadEntries} variant="outline" disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                
                <Button onClick={exportToExcel} className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Exportar Excel</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Valor Compra</TableHead>
                    <TableHead>Cashback</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Loja</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Carregando dados...
                      </TableCell>
                    </TableRow>
                  ) : filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.customerName}</div>
                            <div className="text-sm text-muted-foreground">{entry.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{entry.phone}</TableCell>
                        <TableCell>{entry.cpf}</TableCell>
                        <TableCell>R$ {entry.purchaseValue.toFixed(2)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">R$ {entry.cashbackValue.toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">{entry.cashbackPercent}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(entry.status)}>
                            {getStatusLabel(entry.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.store}</div>
                            <div className="text-sm text-muted-foreground">{entry.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {entry.createdAt.toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {entry.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(entry.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusChange(entry.id, 'rejected')}
                              >
                                Rejeitar
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
