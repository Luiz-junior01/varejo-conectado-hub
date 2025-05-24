
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Truck,
  Headphones,
  Settings,
  Globe,
  Wrench
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Vendas",
    url: "/vendas",
    icon: ShoppingCart,
  },
  {
    title: "Suprimentos",
    url: "/suprimentos",
    icon: Package,
  },
  {
    title: "CRM",
    url: "/crm",
    icon: Users,
  },
  {
    title: "Financeiro",
    url: "/financeiro",
    icon: DollarSign,
  },
  {
    title: "E-commerce",
    url: "/ecommerce",
    icon: Globe,
  },
  {
    title: "Logística",
    url: "/logistica",
    icon: Truck,
  },
  {
    title: "Atendimento",
    url: "/atendimento",
    icon: Headphones,
  },
  {
    title: "Serviços",
    url: "/servicos",
    icon: Wrench,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">VCH ERP</h2>
            <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos Principais</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/configuracoes" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
