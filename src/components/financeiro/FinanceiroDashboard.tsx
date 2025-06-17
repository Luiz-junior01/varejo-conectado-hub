
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ListaMovimentacoes } from "./ListaMovimentacoes";
import { NovaMovimentacaoDialog } from "./NovaMovimentacaoDialog";
import { GestaoContas } from "./GestaoContas";
import { RelatoriosFinanceiros } from "./RelatoriosFinanceiros";

export const FinanceiroDashboard = () => {
  const [dialogAberto, setDialogAberto] = useState(false);

  // Buscar estatísticas financeiras
  const { data: estatisticas } = useQuery({
    queryKey: ['estatisticas-financeiras'],
    queryFn: async () => {
      const hoje = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      // Receitas do mês
      const { data: receitas } = await supabase
        .from('movimentacoes_financeiras')
        .select('valor')
        .eq('tipo', 'receita')
        .eq('status', 'pago')
        .gte('data_pagamento', inicioMes);

      // Despesas do mês
      const { data: despesas } = await supabase
        .from('movimentacoes_financeiras')
        .select('valor')
        .eq('tipo', 'despesa')
        .eq('status', 'pago')
        .gte('data_pagamento', inicioMes);

      // Contas a receber (pendentes)
      const { data: contasReceber } = await supabase
        .from('movimentacoes_financeiras')
        .select('valor')
        .eq('tipo', 'receita')
        .eq('status', 'pendente');

      // Contas a pagar (pendentes)
      const { data: contasPagar } = await supabase
        .from('movimentacoes_financeiras')
        .select('valor')
        .eq('tipo', 'despesa')
        .eq('status', 'pendente');

      // Saldo total das contas
      const { data: contas } = await supabase
        .from('contas_financeiras')
        .select('saldo_atual')
        .eq('status', 'ativo');

      const totalReceitas = receitas?.reduce((acc, r) => acc + Number(r.valor), 0) || 0;
      const totalDespesas = despesas?.reduce((acc, d) => acc + Number(d.valor), 0) || 0;
      const totalContasReceber = contasReceber?.reduce((acc, r) => acc + Number(r.valor), 0) || 0;
      const totalContasPagar = contasPagar?.reduce((acc, p) => acc + Number(p.valor), 0) || 0;
      const saldoTotal = contas?.reduce((acc, c) => acc + Number(c.saldo_atual), 0) || 0;

      return {
        totalReceitas,
        totalDespesas,
        totalContasReceber,
        totalContasPagar,
        saldoTotal,
        lucroMes: totalReceitas - totalDespesas
      };
    }
  });

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {estatisticas?.saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {estatisticas?.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {estatisticas?.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro do Mês</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(estatisticas?.lucroMes || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {estatisticas?.lucroMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Navegação */}
      <Tabs defaultValue="movimentacoes" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
            <TabsTrigger value="contas">Contas</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>
          
          <Button onClick={() => setDialogAberto(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Movimentação
          </Button>
        </div>

        <TabsContent value="movimentacoes" className="space-y-4">
          <ListaMovimentacoes />
        </TabsContent>

        <TabsContent value="contas" className="space-y-4">
          <GestaoContas />
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <RelatoriosFinanceiros />
        </TabsContent>
      </Tabs>

      <NovaMovimentacaoDialog 
        aberto={dialogAberto} 
        onClose={() => setDialogAberto(false)} 
      />
    </div>
  );
};
