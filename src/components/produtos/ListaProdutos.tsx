
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, Search, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Produto {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: string;
  created_at: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ativo":
      return "bg-green-100 text-green-800";
    case "inativo":
      return "bg-gray-100 text-gray-800";
    case "descontinuado":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEstoqueColor = (estoque: number) => {
  if (estoque === 0) return "text-red-600";
  if (estoque <= 10) return "text-orange-600";
  return "text-green-600";
};

export function ListaProdutos() {
  const [busca, setBusca] = useState("");

  const { data: produtos = [], isLoading, refetch } = useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Produto[];
    }
  });

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Catálogo de Produtos</CardTitle>
            <CardDescription>
              {produtos.length} produtos cadastrados no sistema
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {busca ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando seu primeiro produto.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtosFiltrados.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-mono text-sm">{produto.codigo}</TableCell>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell className="font-semibold">
                    {produto.preco.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </TableCell>
                  <TableCell className={`font-semibold ${getEstoqueColor(produto.estoque)}`}>
                    {produto.estoque} un
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(produto.status)}>
                      {produto.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
