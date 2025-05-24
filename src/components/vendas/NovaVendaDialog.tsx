
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
import { Plus, Minus } from "lucide-react";

interface NovaVendaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ItemVenda {
  id: number;
  produto: string;
  quantidade: number;
  preco: number;
}

export function NovaVendaDialog({ open, onOpenChange }: NovaVendaDialogProps) {
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<ItemVenda[]>([
    { id: 1, produto: "", quantidade: 1, preco: 0 }
  ]);

  const adicionarItem = () => {
    const novoId = Math.max(...itens.map(i => i.id)) + 1;
    setItens([...itens, { id: novoId, produto: "", quantidade: 1, preco: 0 }]);
  };

  const removerItem = (id: number) => {
    if (itens.length > 1) {
      setItens(itens.filter(item => item.id !== id));
    }
  };

  const atualizarItem = (id: number, campo: keyof ItemVenda, valor: any) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.quantidade * item.preco), 0);
  };

  const handleSubmit = () => {
    // Aqui será implementada a integração com Supabase
    console.log("Nova venda:", {
      cliente,
      vendedor,
      itens,
      total: calcularTotal(),
      observacoes
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar uma nova venda no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Dados Básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={cliente} onValueChange={setCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao-silva">João Silva</SelectItem>
                  <SelectItem value="ana-costa">Ana Costa</SelectItem>
                  <SelectItem value="carlos-pereira">Carlos Pereira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendedor">Vendedor</Label>
              <Select value={vendedor} onValueChange={setVendedor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria-santos">Maria Santos</SelectItem>
                  <SelectItem value="pedro-oliveira">Pedro Oliveira</SelectItem>
                  <SelectItem value="joao-alves">João Alves</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Itens da Venda */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Itens da Venda</Label>
              <Button type="button" variant="outline" size="sm" onClick={adicionarItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
            
            {itens.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                <div className="col-span-5">
                  <Label htmlFor={`produto-${item.id}`}>Produto</Label>
                  <Select 
                    value={item.produto} 
                    onValueChange={(valor) => atualizarItem(item.id, 'produto', valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produto-1">Camiseta Básica</SelectItem>
                      <SelectItem value="produto-2">Calça Jeans</SelectItem>
                      <SelectItem value="produto-3">Tênis Esportivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor={`quantidade-${item.id}`}>Qtd</Label>
                  <Input
                    id={`quantidade-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(item.id, 'quantidade', parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="col-span-3">
                  <Label htmlFor={`preco-${item.id}`}>Preço Unit.</Label>
                  <Input
                    id={`preco-${item.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.preco}
                    onChange={(e) => atualizarItem(item.id, 'preco', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="col-span-1">
                  <Label>Subtotal</Label>
                  <div className="text-sm font-semibold pt-2">
                    {(item.quantidade * item.preco).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </div>
                </div>
                
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removerItem(item.id)}
                    disabled={itens.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="text-right">
                <Label className="text-base font-semibold">Total da Venda</Label>
                <div className="text-2xl font-bold text-green-600">
                  {calcularTotal().toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais sobre a venda..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Finalizar Venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
