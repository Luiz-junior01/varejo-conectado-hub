
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Vendas Hoje",
      value: "R$ 12.450",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Pedidos Pendentes",
      value: "23",
      change: "-5%",
      icon: Package,
      color: "text-orange-600"
    },
    {
      title: "Clientes Ativos",
      value: "1.234",
      change: "+8%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Faturamento Mensal",
      value: "R$ 145.230",
      change: "+15%",
      icon: DollarSign,
      color: "text-green-600"
    }
  ];

  const modules = [
    {
      title: "Vendas",
      description: "Gerencie vendas, relatórios e performance",
      icon: ShoppingCart,
      status: "Ativo",
      alerts: 3
    },
    {
      title: "Estoque",
      description: "Controle de produtos e inventário",
      icon: Package,
      status: "Ativo",
      alerts: 12
    },
    {
      title: "Financeiro",
      description: "Contas a pagar, receber e fluxo de caixa",
      icon: DollarSign,
      status: "Ativo",
      alerts: 0
    },
    {
      title: "CRM",
      description: "Gestão de clientes e fornecedores",
      icon: Users,
      status: "Ativo",
      alerts: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu negócio em tempo real
        </p>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
                {stat.change} em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status dos Módulos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <Card key={module.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <module.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-medium">
                  {module.title}
                </CardTitle>
              </div>
              {module.alerts > 0 ? (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-orange-500">{module.alerts}</span>
                </div>
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </CardHeader>
            <CardContent>
              <CardDescription>{module.description}</CardDescription>
              <div className="mt-2 flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">{module.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico de Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendas dos Últimos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de vendas (será implementado com Recharts)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Estoque baixo</p>
                  <p className="text-xs text-muted-foreground">12 produtos com estoque crítico</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Relatório mensal disponível</p>
                  <p className="text-xs text-muted-foreground">Análise de performance de novembro</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Backup realizado</p>
                  <p className="text-xs text-muted-foreground">Sistema atualizado com sucesso</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
