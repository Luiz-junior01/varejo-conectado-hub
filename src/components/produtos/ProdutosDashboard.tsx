
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { ListaProdutos } from "./ListaProdutos";
import { NovoProdutoDialog } from "./NovoProdutoDialog";

export function ProdutosDashboard() {
  const [showNovoProduto, setShowNovoProduto] = useState(false);

  const statsProdutos = [
    {
      title: "Total de Produtos",
      value: "1.248",
      change: "+23 novos",
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Estoque Baixo",
      value: "12",
      change: "Requer atenção",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Produtos Ativos",
      value: "1.156",
      change: "92% do total",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Sem Estoque",
      value: "8",
      change: "0,6% do total",
      icon: TrendingDown,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos e controle de estoque
          </p>
        </div>
        <Button onClick={() => setShowNovoProduto(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsProdutos.map((stat) => (
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
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de Produtos */}
      <ListaProdutos />

      {/* Dialog Novo Produto */}
      <NovoProdutoDialog 
        open={showNovoProduto} 
        onOpenChange={setShowNovoProduto}
      />
    </div>
  );
}
