
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, UserPlus, Search, Mail, Phone } from "lucide-react";
import { ListaClientes } from "./ListaClientes";
import { NovoClienteDialog } from "./NovoClienteDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CRMDashboard() {
  const [isNovoClienteOpen, setIsNovoClienteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  const { data: estatisticas } = useQuery({
    queryKey: ['crm-estatisticas'],
    queryFn: async () => {
      const { data: clientes } = await supabase
        .from('clientes')
        .select('tipo, status');
      
      if (!clientes) return { totalClientes: 0, totalFornecedores: 0, clientesAtivos: 0 };

      const totalClientes = clientes.filter(c => c.tipo === 'cliente').length;
      const totalFornecedores = clientes.filter(c => c.tipo === 'fornecedor').length;
      const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;

      return {
        totalClientes,
        totalFornecedores,
        clientesAtivos
      };
    }
  });

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas?.totalClientes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Pessoas físicas e jurídicas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas?.totalFornecedores || 0}</div>
            <p className="text-xs text-muted-foreground">
              Empresas parceiras
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Badge variant="secondary" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas?.clientesAtivos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Cadastros ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center flex-1 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button onClick={() => setIsNovoClienteOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Cliente/Fornecedor
        </Button>
      </div>

      {/* Tabs para filtrar por tipo */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="cliente">Clientes</TabsTrigger>
          <TabsTrigger value="fornecedor">Fornecedores</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <ListaClientes searchTerm={searchTerm} filtroTipo="todos" />
        </TabsContent>
        
        <TabsContent value="cliente" className="space-y-4">
          <ListaClientes searchTerm={searchTerm} filtroTipo="cliente" />
        </TabsContent>
        
        <TabsContent value="fornecedor" className="space-y-4">
          <ListaClientes searchTerm={searchTerm} filtroTipo="fornecedor" />
        </TabsContent>
      </Tabs>

      <NovoClienteDialog 
        open={isNovoClienteOpen} 
        onOpenChange={setIsNovoClienteOpen} 
      />
    </div>
  );
}
