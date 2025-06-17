
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NovaMovimentacaoDialogProps {
  aberto: boolean;
  onClose: () => void;
}

export const NovaMovimentacaoDialog = ({ aberto, onClose }: NovaMovimentacaoDialogProps) => {
  const [formData, setFormData] = useState({
    tipo: "",
    descricao: "",
    valor: "",
    data_vencimento: "",
    categoria_id: "",
    conta_id: "",
    cliente_id: "",
    observacoes: "",
    forma_pagamento: "",
    total_parcelas: "1"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar categorias
  const { data: categorias } = useQuery({
    queryKey: ['categorias-financeiras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias_financeiras')
        .select('*')
        .eq('status', 'ativo')
        .order('nome');

      if (error) throw error;
      return data || [];
    }
  });

  // Buscar contas
  const { data: contas } = useQuery({
    queryKey: ['contas-financeiras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contas_financeiras')
        .select('*')
        .eq('status', 'ativo')
        .order('nome');

      if (error) throw error;
      return data || [];
    }
  });

  // Buscar clientes
  const { data: clientes } = useQuery({
    queryKey: ['clientes-ativos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome')
        .eq('status', 'ativo')
        .order('nome');

      if (error) throw error;
      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const valorNumerico = parseFloat(formData.valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        toast({
          title: "Erro",
          description: "Valor deve ser um número positivo.",
          variant: "destructive",
        });
        return;
      }

      const totalParcelas = parseInt(formData.total_parcelas) || 1;
      const valorParcela = valorNumerico / totalParcelas;

      for (let i = 0; i < totalParcelas; i++) {
        const dataVencimento = new Date(formData.data_vencimento);
        dataVencimento.setMonth(dataVencimento.getMonth() + i);

        const movimentacao = {
          tipo: formData.tipo,
          descricao: totalParcelas > 1 
            ? `${formData.descricao} (${i + 1}/${totalParcelas})`
            : formData.descricao,
          valor: valorParcela,
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          categoria_id: formData.categoria_id || null,
          conta_id: formData.conta_id,
          cliente_id: formData.cliente_id || null,
          observacoes: formData.observacoes || null,
          forma_pagamento: formData.forma_pagamento || null,
          parcela_atual: totalParcelas > 1 ? i + 1 : null,
          total_parcelas: totalParcelas > 1 ? totalParcelas : null,
          status: 'pendente'
        };

        const { error } = await supabase
          .from('movimentacoes_financeiras')
          .insert([movimentacao]);

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: `Movimentação ${totalParcelas > 1 ? `parcelada em ${totalParcelas}x` : ''} criada com sucesso!`,
      });

      // Limpar formulário
      setFormData({
        tipo: "",
        descricao: "",
        valor: "",
        data_vencimento: "",
        categoria_id: "",
        conta_id: "",
        cliente_id: "",
        observacoes: "",
        forma_pagamento: "",
        total_parcelas: "1"
      });

      queryClient.invalidateQueries({ queryKey: ['movimentacoes-financeiras'] });
      queryClient.invalidateQueries({ queryKey: ['estatisticas-financeiras'] });
      onClose();
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar movimentação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const categoriasFilteredByType = categorias?.filter(categoria => 
    formData.tipo === "" || categoria.tipo === formData.tipo
  ) || [];

  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Movimentação Financeira</DialogTitle>
          <DialogDescription>
            Adicione uma nova receita, despesa ou transferência
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value, categoria_id: "" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valor">Valor *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              placeholder="Descrição da movimentação"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
              <Input
                id="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={(e) => setFormData(prev => ({ ...prev, data_vencimento: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="total_parcelas">Parcelas</Label>
              <Input
                id="total_parcelas"
                type="number"
                min="1"
                value={formData.total_parcelas}
                onChange={(e) => setFormData(prev => ({ ...prev, total_parcelas: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria_id">Categoria</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasFilteredByType.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="conta_id">Conta *</Label>
              <Select
                value={formData.conta_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, conta_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {contas?.map((conta) => (
                    <SelectItem key={conta.id} value={conta.id}>
                      {conta.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente_id">Cliente/Fornecedor</Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes?.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
              <Select
                value={formData.forma_pagamento}
                onValueChange={(value) => setFormData(prev => ({ ...prev, forma_pagamento: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
