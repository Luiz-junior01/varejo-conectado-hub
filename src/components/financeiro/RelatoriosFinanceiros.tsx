
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const RelatoriosFinanceiros = () => {
  const { data: dadosGrafico } = useQuery({
    queryKey: ['dados-grafico-financeiro'],
    queryFn: async () => {
      const hoje = new Date();
      const meses = [];
      
      for (let i = 5; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);
        
        const inicioMes = data.toISOString().split('T')[0];
        const fimMes = proximoMes.toISOString().split('T')[0];

        // Receitas do mês
        const { data: receitas } = await supabase
          .from('movimentacoes_financeiras')
          .select('valor')
          .eq('tipo', 'receita')
          .eq('status', 'pago')
          .gte('data_pagamento', inicioMes)
          .lt('data_pagamento', fimMes);

        // Despesas do mês
        const { data: despesas } = await supabase
          .from('movimentacoes_financeiras')
          .select('valor')
          .eq('tipo', 'despesa')
          .eq('status', 'pago')
          .gte('data_pagamento', inicioMes)
          .lt('data_pagamento', fimMes);

        const totalReceitas = receitas?.reduce((acc, r) => acc + Number(r.valor), 0) || 0;
        const totalDespesas = despesas?.reduce((acc, d) => acc + Number(d.valor), 0) || 0;

        meses.push({
          mes: data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          receitas: totalReceitas,
          despesas: totalDespesas,
          lucro: totalReceitas - totalDespesas
        });
      }

      return meses;
    }
  });

  const { data: dadosCategorias } = useQuery({
    queryKey: ['dados-categorias-despesas'],
    queryFn: async () => {
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString().split('T')[0];

      const { data: despesas } = await supabase
        .from('movimentacoes_financeiras')
        .select(`
          valor,
          categoria:categoria_id(nome)
        `)
        .eq('tipo', 'despesa')
        .eq('status', 'pago')
        .gte('data_pagamento', inicioMes);

      const categoriesMap = new Map();
      
      despesas?.forEach(despesa => {
        const nomeCategoria = despesa.categoria?.nome || 'Sem categoria';
        const valorAtual = categoriesMap.get(nomeCategoria) || 0;
        categoriesMap.set(nomeCategoria, valorAtual + Number(despesa.valor));
      });

      return Array.from(categoriesMap.entries()).map(([nome, valor]) => ({
        nome,
        valor
      }));
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa (6 meses)</CardTitle>
          <CardDescription>
            Receitas vs Despesas dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
              />
              <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
              <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>
            Distribuição das despesas do mês atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosCategorias}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {dadosCategorias?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
