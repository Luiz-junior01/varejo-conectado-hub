
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const GestaoContas = () => {
  const { data: contas, isLoading } = useQuery({
    queryKey: ['contas-financeiras-detalhes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contas_financeiras')
        .select('*')
        .order('nome');

      if (error) throw error;
      return data || [];
    }
  });

  const getTipoBadge = (tipo: string) => {
    const badges = {
      banco: <Badge className="bg-blue-100 text-blue-800">Banco</Badge>,
      caixa: <Badge className="bg-green-100 text-green-800">Caixa</Badge>,
      cartao: <Badge className="bg-purple-100 text-purple-800">Cartão</Badge>,
      poupanca: <Badge className="bg-yellow-100 text-yellow-800">Poupança</Badge>
    };
    return badges[tipo as keyof typeof badges] || <Badge>{tipo}</Badge>;
  };

  if (isLoading) {
    return <div>Carregando contas...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Contas</CardTitle>
        <CardDescription>
          Visualize e gerencie suas contas bancárias e de caixa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>Agência</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead>Saldo Atual</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contas?.map((conta) => (
              <TableRow key={conta.id}>
                <TableCell className="font-medium">{conta.nome}</TableCell>
                <TableCell>{getTipoBadge(conta.tipo)}</TableCell>
                <TableCell>{conta.banco || '-'}</TableCell>
                <TableCell>{conta.agencia || '-'}</TableCell>
                <TableCell>{conta.conta || '-'}</TableCell>
                <TableCell className="font-medium">
                  R$ {Number(conta.saldo_atual).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Badge variant={conta.status === 'ativo' ? 'default' : 'secondary'}>
                    {conta.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {contas?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma conta encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
