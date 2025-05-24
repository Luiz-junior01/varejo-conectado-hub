
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados mockados - posteriormente virão do Supabase
const vendasMock = [
  {
    id: 1,
    numero: "VD-001",
    cliente: "João Silva",
    data: "2024-05-24",
    valor: 250.00,
    status: "finalizada",
    vendedor: "Maria Santos"
  },
  {
    id: 2,
    numero: "VD-002",
    cliente: "Ana Costa",
    data: "2024-05-24",
    valor: 180.50,
    status: "pendente",
    vendedor: "Pedro Oliveira"
  },
  {
    id: 3,
    numero: "VD-003",
    cliente: "Carlos Pereira",
    data: "2024-05-23",
    valor: 89.90,
    status: "cancelada",
    vendedor: "Maria Santos"
  },
  {
    id: 4,
    numero: "VD-004",
    cliente: "Lucia Ferreira",
    data: "2024-05-23",
    valor: 320.00,
    status: "finalizada",
    vendedor: "João Alves"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "finalizada":
      return "bg-green-100 text-green-800";
    case "pendente":
      return "bg-yellow-100 text-yellow-800";
    case "cancelada":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ListaVendas() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
        <CardDescription>
          Lista de todas as vendas realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendasMock.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell className="font-medium">{venda.numero}</TableCell>
                <TableCell>{venda.cliente}</TableCell>
                <TableCell>{new Date(venda.data).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="font-semibold">
                  {venda.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(venda.status)}>
                    {venda.status}
                  </Badge>
                </TableCell>
                <TableCell>{venda.vendedor}</TableCell>
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
      </CardContent>
    </Card>
  );
}
