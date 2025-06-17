
-- Criar tabela de categorias financeiras
CREATE TABLE public.categorias_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de contas financeiras (bancos, caixas, etc)
CREATE TABLE public.contas_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('banco', 'caixa', 'cartao', 'poupanca')),
  banco TEXT,
  agencia TEXT,
  conta TEXT,
  saldo_inicial DECIMAL(15,2) NOT NULL DEFAULT 0,
  saldo_atual DECIMAL(15,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Criar tabela de movimentações financeiras
CREATE TABLE public.movimentacoes_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa', 'transferencia')),
  descricao TEXT NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado', 'vencido')),
  categoria_id UUID REFERENCES public.categorias_financeiras(id),
  conta_id UUID REFERENCES public.contas_financeiras(id) NOT NULL,
  conta_destino_id UUID REFERENCES public.contas_financeiras(id), -- Para transferências
  cliente_id UUID REFERENCES public.clientes(id),
  observacoes TEXT,
  documento TEXT,
  forma_pagamento TEXT,
  parcela_atual INTEGER,
  total_parcelas INTEGER,
  movimentacao_pai_id UUID REFERENCES public.movimentacoes_financeiras(id), -- Para parcelas
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Criar triggers para atualizar updated_at
CREATE TRIGGER trigger_update_categorias_financeiras_updated_at
  BEFORE UPDATE ON public.categorias_financeiras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_update_contas_financeiras_updated_at
  BEFORE UPDATE ON public.contas_financeiras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_update_movimentacoes_financeiras_updated_at
  BEFORE UPDATE ON public.movimentacoes_financeiras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para melhor performance
CREATE INDEX idx_categorias_financeiras_tipo ON public.categorias_financeiras(tipo);
CREATE INDEX idx_categorias_financeiras_status ON public.categorias_financeiras(status);
CREATE INDEX idx_contas_financeiras_tipo ON public.contas_financeiras(tipo);
CREATE INDEX idx_contas_financeiras_status ON public.contas_financeiras(status);
CREATE INDEX idx_movimentacoes_financeiras_tipo ON public.movimentacoes_financeiras(tipo);
CREATE INDEX idx_movimentacoes_financeiras_status ON public.movimentacoes_financeiras(status);
CREATE INDEX idx_movimentacoes_financeiras_data_vencimento ON public.movimentacoes_financeiras(data_vencimento);
CREATE INDEX idx_movimentacoes_financeiras_categoria_id ON public.movimentacoes_financeiras(categoria_id);
CREATE INDEX idx_movimentacoes_financeiras_conta_id ON public.movimentacoes_financeiras(conta_id);
CREATE INDEX idx_movimentacoes_financeiras_cliente_id ON public.movimentacoes_financeiras(cliente_id);

-- Inserir categorias padrão
INSERT INTO public.categorias_financeiras (nome, tipo, descricao) VALUES
('Vendas', 'receita', 'Receitas de vendas de produtos'),
('Serviços', 'receita', 'Receitas de prestação de serviços'),
('Outras Receitas', 'receita', 'Outras receitas diversas'),
('Fornecedores', 'despesa', 'Pagamentos a fornecedores'),
('Salários', 'despesa', 'Folha de pagamento'),
('Aluguel', 'despesa', 'Aluguel do estabelecimento'),
('Energia Elétrica', 'despesa', 'Conta de luz'),
('Telefone/Internet', 'despesa', 'Telecomunicações'),
('Marketing', 'despesa', 'Gastos com marketing e publicidade'),
('Outras Despesas', 'despesa', 'Outras despesas diversas');

-- Inserir contas padrão
INSERT INTO public.contas_financeiras (nome, tipo, saldo_inicial, saldo_atual) VALUES
('Caixa Geral', 'caixa', 1000.00, 1000.00),
('Banco Principal', 'banco', 5000.00, 5000.00),
('Cartão de Crédito', 'cartao', 0.00, 0.00);
