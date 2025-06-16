
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { MoreHorizontal, Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Cliente = Tables<"clientes">;

interface ListaClientesProps {
  searchTerm: string;
  filtroTipo: "todos" | "cliente" | "fornecedor";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo':
      return 'bg-green-500';
    case 'inativo':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getTipoColor = (tipo: string) => {
  switch (tipo) {
    case 'cliente':
      return 'bg-blue-500';
    case 'fornecedor':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export function ListaClientes({ searchTerm, filtroTipo }: ListaClientesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clientes, isLoading } = useQuery({
    queryKey: ['clientes', searchTerm, filtroTipo],
    queryFn: async () => {
      let query = supabase.from('clientes').select('*');

      if (filtroTipo !== 'todos') {
        query = query.eq('tipo', filtroTipo);
      }

      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['crm-estatisticas'] });
      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, novoStatus }: { id: string; novoStatus: string }) => {
      const { error } = await supabase
        .from('clientes')
        .update({ status: novoStatus })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['crm-estatisticas'] });
      toast({
        title: "Status atualizado",
        description: "Status do cliente foi atualizado com sucesso.",
      });
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Carregando clientes...</div>;
  }

  if (!clientes?.length) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes ({clientes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{cliente.nome}</div>
                    {cliente.cpf_cnpj && (
                      <div className="text-sm text-muted-foreground">
                        {cliente.cpf_cnpj}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getTipoColor(cliente.tipo)}>
                    {cliente.tipo === 'cliente' ? 'Cliente' : 'Fornecedor'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {cliente.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {cliente.email}
                      </div>
                    )}
                    {cliente.telefone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {cliente.telefone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {(cliente.cidade || cliente.estado) && (
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {[cliente.cidade, cliente.estado].filter(Boolean).join(', ')}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(cliente.status)}>
                    {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toggleStatusMutation.mutate({
                          id: cliente.id,
                          novoStatus: cliente.status === 'ativo' ? 'inativo' : 'ativo'
                        })}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {cliente.status === 'ativo' ? 'Desativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(cliente.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
