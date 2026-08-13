# Essence Perfumaria 🌸

Sistema completo e responsivo para loja de alta perfumaria com catálogo interativo e painel administrativo rodando na Cloudflare Workers com banco de dados SQLite via Durable Objects.

## 🚀 Funcionalidades

### 🏬 Vitrine e Catálogo da Loja
- **Design Luxuoso & Responsivo:** Tipografia refinada (*Cormorant Garamond* e *Plus Jakarta Sans*), hero banner personalizável e barra de anúncios.
- **Filtros e Busca em Tempo Real:** Pesquisa por nome, família olfativa, notas de topo/coração/fundo, gênero (Feminino, Masculino, Unissex) e ordenação por preço e destaques.
- **Integração WhatsApp Direta:** Botões de consulta pré-formatados com nome e valor do produto, gerando registro de interesse no sistema.
- **Lista de Desejos (Favoritos):** Adicione perfumes aos favoritos e envie a lista completa diretamente via WhatsApp.
- **Provador Virtual (Quiz de Fragrâncias):** Quiz em etapas que sugere o perfume ideal de acordo com a ocasião e preferência olfativa do cliente.

### 🔐 Painel Administrativo
- **Proteção por PIN:** Acesso restrito protegido por PIN de segurança (padrão: `1234`).
- **Gestão de Produtos (CRUD):** Cadastre, edite e remova perfumes. Suporte para upload de imagem (computador) ou URL, detalhes de pirâmide olfativa e controle de estoque.
- **Famílias Olfativas:** Crie e gerencie categorias de fragrâncias em tempo real.
- **Configurações da Loja:** Modifique nome da loja, número de WhatsApp, textos do Hero banner, imagens e PIN de acesso.
- **Histórico de Consultas (Leads):** Acompanhe o interesse dos clientes gerados nas interações com o catálogo.
