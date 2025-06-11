
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ProdutosDashboard } from "@/components/produtos/ProdutosDashboard";

const Produtos = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Gestão de Produtos</h1>
            </div>
          </header>
          <main className="flex-1 p-6">
            <ProdutosDashboard />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Produtos;
