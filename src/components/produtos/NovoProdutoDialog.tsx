
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NovoProdutoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovoProdutoDialog({ open, onOpenChange }: NovoProdutoDialogProps) {
  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("ativo");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProdutoMutation = useMutation({
    mutationFn: async (produto: any) => {
      const { data, error } = await supabase
        .from('produtos')
        .insert([produto])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Produto criado!",
        description: "O produto foi adicionado com sucesso ao catálogo.",
      });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setNome("");
    setCodigo("");
    setCategoria("");
    setPreco("");
    setEstoque("");
    setDescricao("");
    setStatus("ativo");
  };

  const handleSubmit = () => {
    if (!nome || !codigo || !categoria || !preco || !estoque) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const produto = {
      nome,
      codigo,
      categoria,
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
      descricao,
      status
    };

    createProdutoMutation.mutate(produto);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Adicione um novo produto ao seu catálogo. Preencha os dados básicos abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                placeholder="Ex: Camiseta Básica Algodão"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="codigo">Código do Produto *</Label>
              <Input
                id="codigo"
                placeholder="Ex: CAM001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roupas">Roupas</SelectItem>
                  <SelectItem value="calcados">Calçados</SelectItem>
                  <SelectItem value="acessorios">Acessórios</SelectItem>
                  <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                  <SelectItem value="casa">Casa e Decoração</SelectItem>
                  <SelectItem value="esporte">Esporte e Lazer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="descontinuado">Descontinuado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço de Venda *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estoque">Quantidade em Estoque *</Label>
              <Input
                id="estoque"
                type="number"
                min="0"
                placeholder="0"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição detalhada do produto..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createProdutoMutation.isPending}
          >
            {createProdutoMutation.isPending ? "Salvando..." : "Salvar Produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
