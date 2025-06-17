
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ListaMovimentacoes = () => {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movimentacoes, isLoading } = useQuery({
    queryKey: ['movimentacoes-financeiras', busca, filtroTipo, filtroStatus],
    queryFn: async () => {
      let query = supabase
        .from('movimentacoes_financeiras')
        .select(`
          *,
          categoria:categoria_id(nome),
          conta:conta_id(nome),
          cliente:cliente_id(nome)
        `)
        .order('data_vencimento', { ascending: false });

      if (busca) {
        query = query.ilike('descricao', `%${busca}%`);
      }

      if (filtroTipo !== "todos") {
        query = query.eq('tipo', filtroTipo);
      }

      if (filtroStatus !== "todos") {
        query = query.eq('status', filtroStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar movimentações:', error);
        throw error;
      }

      return data || [];
    }
  });

  const marcarComoPago = async (id: string) => {
    try {
      const { error } = await supabase
        .from('movimentacoes_financeiras')
        .update({ 
          status: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Movimentação marcada como paga!",
      });

      queryClient.invalidateQueries({ queryKey: ['movimentacoes-financeiras'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas-financeiras'] });
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
      toast({
        title: "Erro",
        description: "Erro ao marcar movimentação como paga.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>,
      pago: <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Pago</Badge>,
      cancelado: <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>,
      vencido: <Badge variant="outline" className="text-red-600"><AlertTriangle className="w-3 h-3 mr-1" />Vencido</Badge>
    };
    return badges[status as keyof typeof badges] || <Badge variant="outline">{status}</Badge>;
  };

  const getTipoBadge = (tipo: string) => {
    const badges = {
      receita: <Badge className="bg-green-100 text-green-800">Receita</Badge>,
      despesa: <Badge className="bg-red-100 text-red-800">Despesa</Badge>,
      transferencia: <Badge className="bg-blue-100 text-blue-800">Transferência</Badge>
    };
    return badges[tipo as keyof typeof badges] || <Badge>{tipo}</Badge>;
  };

  if (isLoading) {
    return <div>Carregando movimentações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimentações Financeiras</CardTitle>
        <CardDescription>
          Gerencie todas as suas receitas, despesas e transferências
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
              <SelectItem value="transferencia">Transferências</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimentacoes?.map((movimentacao) => (
              <TableRow key={movimentacao.id}>
                <TableCell>{getTipoBadge(movimentacao.tipo)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{movimentacao.descricao}</div>
                    {movimentacao.categoria && (
                      <div className="text-sm text-muted-foreground">
                        {movimentacao.categoria.nome}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className={`font-medium ${
                  movimentacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  R$ {Number(movimentacao.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  {new Date(movimentacao.data_vencimento).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{getStatusBadge(movimentacao.status)}</TableCell>
                <TableCell>{movimentacao.conta?.nome}</TableCell>
                <TableCell>
                  {movimentacao.status === 'pendente' && (
                    <Button
                      size="sm"
                      onClick={() => marcarComoPago(movimentacao.id)}
                    >
                      Marcar como Pago
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {movimentacoes?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma movimentação encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
