
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, DollarSign, TrendingUp, Users } from "lucide-react";
import { ListaVendas } from "./ListaVendas";
import { NovaVendaDialog } from "./NovaVendaDialog";

export function VendasDashboard() {
  const [showNovaVenda, setShowNovaVenda] = useState(false);

  const statsVendas = [
    {
      title: "Vendas Hoje",
      value: "R$ 12.450",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Ticket Médio",
      value: "R$ 89,50",
      change: "+5%",
      icon: DollarSign,
      color: "text-blue-600"
    },
    {
      title: "Conversão",
      value: "24%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Clientes Atendidos",
      value: "139",
      change: "+15%",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
          <p className="text-muted-foreground">
            Gerencie suas vendas e acompanhe o desempenho
          </p>
        </div>
        <Button onClick={() => setShowNovaVenda(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsVendas.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color}`}>
                {stat.change} em relação a ontem
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de Vendas */}
      <ListaVendas />

      {/* Dialog Nova Venda */}
      <NovaVendaDialog 
        open={showNovaVenda} 
        onOpenChange={setShowNovaVenda}
      />
    </div>
  );
}
