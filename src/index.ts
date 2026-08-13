import { DurableObject } from "cloudflare:workers";
import { Hono } from "hono";

interface Product {
  id: string;
  name: string;
  price: string;
  numeric_price: number;
  img: string;
  category: string;
  description: string;
  volume: string;
  concentration: string;
  gender: string;
  top_notes: string;
  heart_notes: string;
  base_notes: string;
  stock: number;
  is_featured: number;
  is_active: number;
  created_at: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Lead {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  notes: string;
  created_at: number;
}

const defaultSettings: Record<string, string> = {
  store_name: "Essence Perfumaria",
  store_whatsapp: "5531996831731",
  hero_title: "A essência da sua personalidade",
  hero_subtitle: "Descubra fragrâncias exclusivas e coleções de alta perfumaria que capturam momentos inesquecíveis.",
  store_hero: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600",
  announcement_bar: "✨ Frete Grátis para todo o Brasil em compras acima de R$ 350,00 | Até 6x sem juros",
  store_email: "contato@essenceperfumaria.com.br",
  instagram_url: "https://instagram.com/essenceperfumaria",
  admin_pin: "1234"
};

const defaultCategories: Category[] = [
  { id: "cat-1", name: "Amadeirados", description: "Notas quentes de cedro, sândalo e vetiver." },
  { id: "cat-2", name: "Florais", description: "Buquês refinados de rosas, jasmins e orquídeas." },
  { id: "cat-3", name: "Orientais", description: "Especiarias marcantes, âmbar radiante e mirra." },
  { id: "cat-4", name: "Cítricos", description: "Refrescância de tangerinas, bergamotas e néroli." },
  { id: "cat-5", name: "Aquáticos", description: "Brisas marinhas leves e notas refrescantes." }
];

const now = Date.now();
const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Blue Velvet",
    price: "R$ 380,00",
    numeric_price: 380,
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
    category: "Amadeirados",
    description: "Uma fragrância sedutora e misteriosa com notas profundas de cedro azul, noz-moscada aromática e bergamota italiana refinada.",
    volume: "100 ml",
    concentration: "Eau de Parfum",
    gender: "Unissex",
    top_notes: "Bergamota Italiana, Pimenta Preta, Cardamomo",
    heart_notes: "Noz-moscada, Lavanda Francesa, Flor de Íris",
    base_notes: "Cedro Azul, Âmbar Cinzento, Vetiver de Madagascar",
    stock: 12,
    is_featured: 1,
    is_active: 1,
    created_at: now - 50000
  },
  {
    id: "2",
    name: "Rose d'Or",
    price: "R$ 420,00",
    numeric_price: 420,
    img: "https://images.unsplash.com/photo-1585120040315-2241b774ad0f?w=800",
    category: "Florais",
    description: "Elegância pura em forma líquida. Rosa Damascena colhida à alvorada harmonizada com toques sutis de baunilha de Madagascar.",
    volume: "100 ml",
    concentration: "Parfum Extrait",
    gender: "Feminino",
    top_notes: "Lichia Suculenta, Peônia, Pimenta Rosa",
    heart_notes: "Rosa Damascena Absoluta, Jasmim Sambac",
    base_notes: "Baunilha de Madagascar, Fava Tonka, Almíscar Branco",
    stock: 8,
    is_featured: 1,
    is_active: 1,
    created_at: now - 40000
  },
  {
    id: "3",
    name: "Amber Royale",
    price: "R$ 490,00",
    numeric_price: 490,
    img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800",
    category: "Orientais",
    description: "Riqueza e calor envolventes. Âmbar dourado enriquecido com resina de mirra, especiarias orientais e sândalo cremoso.",
    volume: "100 ml",
    concentration: "Eau de Parfum",
    gender: "Unissex",
    top_notes: "Cardamomo Verde, Açafrão Persa, Canela",
    heart_notes: "Mirra, Incenso de Omã, Bálsamo do Peru",
    base_notes: "Âmbar Dourado, Sândalo Cauteloso, Couro Macio",
    stock: 5,
    is_featured: 1,
    is_active: 1,
    created_at: now - 30000
  },
  {
    id: "4",
    name: "Citrus Supreme",
    price: "R$ 290,00",
    numeric_price: 290,
    img: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800",
    category: "Cítricos",
    description: "Explosão vibrante e revigorante de tangerina siciliana, néroli fresco e notas herbais de vetiver radiante.",
    volume: "100 ml",
    concentration: "Eau de Toilette",
    gender: "Unissex",
    top_notes: "Tangerina Siciliana, Limão Taiti, Toranja",
    heart_notes: "Néroli, Flor de Laranjeira, Petitgrain",
    base_notes: "Vetiver do Haiti, Almíscar Cristalino",
    stock: 15,
    is_featured: 0,
    is_active: 1,
    created_at: now - 20000
  },
  {
    id: "5",
    name: "Nuit Noire",
    price: "R$ 510,00",
    numeric_price: 510,
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
    category: "Amadeirados",
    description: "Uma assinatura marcante para noites inesquecíveis. Agarwood (Oud) nobre, couro aveludado e toques de cacau amargo.",
    volume: "100 ml",
    concentration: "Parfum Extrait",
    gender: "Masculino",
    top_notes: "Pimenta Rosa, Framboesa Negra, Rum",
    heart_notes: "Agarwood (Oud), Íris de Florença, Cacau",
    base_notes: "Couro Nobre, Patchouli, Madeira de Guaiaco",
    stock: 6,
    is_featured: 1,
    is_active: 1,
    created_at: now - 10000
  },
  {
    id: "6",
    name: "Sol de Verão",
    price: "R$ 310,00",
    numeric_price: 310,
    img: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800",
    category: "Aquáticos",
    description: "A brisa ensolarada do litoral mediterrâneo combinada com água de coco fresca e jasmim estival.",
    volume: "100 ml",
    concentration: "Eau de Parfum",
    gender: "Feminino",
    top_notes: "Água de Coco, Sal Marinho, Bergamota",
    heart_notes: "Jasmim Sol, Ylang-Ylang, Flor de Tiaré",
    base_notes: "Madeira de Deriva, Baunilha Solar, Almíscar",
    stock: 20,
    is_featured: 0,
    is_active: 1,
    created_at: now
  }
];

export class App extends DurableObject {
  private app = new Hono();

  constructor(ctx: DurableObjectState, env: Record<string, unknown>) {
    super(ctx, env);
    this.initDb();
    this.setupRoutes();
  }

  private initDb() {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        numeric_price REAL NOT NULL,
        img TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        volume TEXT,
        concentration TEXT,
        gender TEXT,
        top_notes TEXT,
        heart_notes TEXT,
        base_notes TEXT,
        stock INTEGER DEFAULT 10,
        is_featured INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        product_id TEXT,
        product_name TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        notes TEXT,
        created_at INTEGER NOT NULL
      );
    `);

    const settingsCount = this.ctx.storage.sql
      .exec(`SELECT COUNT(*) as count FROM settings`)
      .one().count as number;

    if (settingsCount === 0) {
      for (const [key, value] of Object.entries(defaultSettings)) {
        this.ctx.storage.sql.exec(
          `INSERT INTO settings (key, value) VALUES (?, ?)`,
          key,
          value
        );
      }
    }

    const categoryCount = this.ctx.storage.sql
      .exec(`SELECT COUNT(*) as count FROM categories`)
      .one().count as number;

    if (categoryCount === 0) {
      for (const cat of defaultCategories) {
        this.ctx.storage.sql.exec(
          `INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`,
          cat.id,
          cat.name,
          cat.description
        );
      }
    }

    const productCount = this.ctx.storage.sql
      .exec(`SELECT COUNT(*) as count FROM products`)
      .one().count as number;

    if (productCount === 0) {
      for (const p of defaultProducts) {
        this.ctx.storage.sql.exec(
          `INSERT INTO products (
            id, name, price, numeric_price, img, category, description,
            volume, concentration, gender, top_notes, heart_notes, base_notes,
            stock, is_featured, is_active, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          p.id, p.name, p.price, p.numeric_price, p.img, p.category, p.description,
          p.volume, p.concentration, p.gender, p.top_notes, p.heart_notes, p.base_notes,
          p.stock, p.is_featured, p.is_active, p.created_at
        );
      }
    }
  }

  private setupRoutes() {
    this.app.get("/api/settings", (c) => {
      const rows = this.ctx.storage.sql.exec(`SELECT key, value FROM settings`).toArray();
      const settingsObj: Record<string, string> = {};
      for (const row of rows) settingsObj[row.key as string] = row.value as string;
      return c.json(settingsObj);
    });

    this.app.post("/api/settings", async (c) => {
      const body = await c.req.json<Record<string, string>>();
      for (const [key, value] of Object.entries(body)) {
        this.ctx.storage.sql.exec(
          `INSERT INTO settings (key, value) VALUES (?, ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
          key, String(value)
        );
      }
      return c.json({ ok: true, message: "Configurações salvas!" });
    });

    this.app.get("/api/products", (c) => {
      const category = c.req.query("category");
      const search = c.req.query("search");
      const featured = c.req.query("featured");

      let query = `SELECT * FROM products WHERE is_active = 1`;
      const params: (string | number)[] = [];

      if (category && category !== "Todos") {
        query += ` AND category = ?`;
        params.push(category);
      }

      if (search) {
        query += ` AND (name LIKE ? OR description LIKE ? OR category LIKE ? OR top_notes LIKE ? OR heart_notes LIKE ? OR base_notes LIKE ?)`;
        const term = `%${search}%`;
        params.push(term, term, term, term, term, term);
      }

      if (featured === "true") {
        query += ` AND is_featured = 1`;
      }

      query += ` ORDER BY is_featured DESC, created_at DESC`;

      const rows = this.ctx.storage.sql.exec(query, ...params).toArray();
      return c.json(rows);
    });

    this.app.get("/api/products/:id", (c) => {
      const id = c.req.param("id");
      const rows = this.ctx.storage.sql.exec(`SELECT * FROM products WHERE id = ?`, id).toArray();
      if (rows.length === 0) return c.json({ error: "Produto não encontrado" }, 404);
      return c.json(rows[0]);
    });

    this.app.post("/api/products", async (c) => {
      const p = await c.req.json<Partial<Product>>();
      const id = p.id || `prod-${Date.now()}`;
      const now = Date.now();

      const numericPrice = typeof p.numeric_price === 'number' ? p.numeric_price : parseFloat(String(p.price).replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
      const formattedPrice = p.price && String(p.price).includes('R$') ? String(p.price) : `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;

      this.ctx.storage.sql.exec(
        `INSERT INTO products (
          id, name, price, numeric_price, img, category, description,
          volume, concentration, gender, top_notes, heart_notes, base_notes,
          stock, is_featured, is_active, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id, p.name || "Novo Perfume", formattedPrice, numericPrice,
        p.img || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        p.category || "Geral", p.description || "", p.volume || "100 ml",
        p.concentration || "Eau de Parfum", p.gender || "Unissex",
        p.top_notes || "", p.heart_notes || "", p.base_notes || "",
        p.stock !== undefined ? p.stock : 10, p.is_featured ? 1 : 0, 1, now
      );

      return c.json({ ok: true, id, message: "Produto cadastrado com sucesso!" });
    });

    this.app.put("/api/products/:id", async (c) => {
      const id = c.req.param("id");
      const p = await c.req.json<Partial<Product>>();

      const numericPrice = typeof p.numeric_price === 'number' ? p.numeric_price : parseFloat(String(p.price).replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
      const formattedPrice = p.price && String(p.price).includes('R$') ? String(p.price) : `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;

      this.ctx.storage.sql.exec(
        `UPDATE products SET
          name = ?, price = ?, numeric_price = ?, img = ?, category = ?, description = ?,
          volume = ?, concentration = ?, gender = ?, top_notes = ?, heart_notes = ?, base_notes = ?,
          stock = ?, is_featured = ?
        WHERE id = ?`,
        p.name, formattedPrice, numericPrice, p.img, p.category, p.description,
        p.volume, p.concentration, p.gender, p.top_notes, p.heart_notes, p.base_notes,
        p.stock, p.is_featured ? 1 : 0, id
      );

      return c.json({ ok: true, message: "Produto atualizado com sucesso!" });
    });

    this.app.delete("/api/products/:id", (c) => {
      const id = c.req.param("id");
      this.ctx.storage.sql.exec(`UPDATE products SET is_active = 0 WHERE id = ?`, id);
      return c.json({ ok: true, message: "Produto removido!" });
    });

    this.app.get("/api/categories", (c) => {
      const rows = this.ctx.storage.sql.exec(`SELECT * FROM categories ORDER BY name ASC`).toArray();
      return c.json(rows);
    });

    this.app.post("/api/categories", async (c) => {
      const body = await c.req.json<{ name: string; description?: string }>();
      const id = `cat-${Date.now()}`;
      try {
        this.ctx.storage.sql.exec(
          `INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`,
          id, body.name, body.description || ""
        );
        return c.json({ ok: true, id, message: "Categoria criada!" });
      } catch {
        return c.json({ error: "Categoria já existe" }, 400);
      }
    });

    this.app.delete("/api/categories/:id", (c) => {
      const id = c.req.param("id");
      this.ctx.storage.sql.exec(`DELETE FROM categories WHERE id = ?`, id);
      return c.json({ ok: true, message: "Categoria removida!" });
    });

    this.app.post("/api/leads", async (c) => {
      const body = await c.req.json<Partial<Lead>>();
      const id = `lead-${Date.now()}`;
      this.ctx.storage.sql.exec(
        `INSERT INTO leads (id, product_id, product_name, customer_name, customer_phone, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        id, body.product_id || "", body.product_name || "",
        body.customer_name || "Visitante da Loja", body.customer_phone || "",
        body.notes || "", Date.now()
      );
      return c.json({ ok: true });
    });

    this.app.get("/api/leads", (c) => {
      const rows = this.ctx.storage.sql.exec(`SELECT * FROM leads ORDER BY created_at DESC LIMIT 50`).toArray();
      return c.json(rows);
    });

    this.app.get("/api/stats", (c) => {
      const totalProducts = this.ctx.storage.sql.exec(`SELECT COUNT(*) as c FROM products WHERE is_active = 1`).one().c as number;
      const totalCategories = this.ctx.storage.sql.exec(`SELECT COUNT(*) as c FROM categories`).one().c as number;
      const totalLeads = this.ctx.storage.sql.exec(`SELECT COUNT(*) as c FROM leads`).one().c as number;
      const featuredCount = this.ctx.storage.sql.exec(`SELECT COUNT(*) as c FROM products WHERE is_featured = 1 AND is_active = 1`).one().c as number;

      return c.json({ totalProducts, totalCategories, totalLeads, featuredCount });
    });

    this.app.post("/api/reset-demo", (c) => {
      this.ctx.storage.sql.exec(`DROP TABLE IF EXISTS settings`);
      this.ctx.storage.sql.exec(`DROP TABLE IF EXISTS categories`);
      this.ctx.storage.sql.exec(`DROP TABLE IF EXISTS products`);
      this.ctx.storage.sql.exec(`DROP TABLE IF EXISTS leads`);
      this.initDb();
      return c.json({ ok: true, message: "Banco de dados restaurado ao padrão de demonstração!" });
    });
  }

  async fetch(request: Request) {
    return this.app.fetch(request);
  }
}

// Fallback Standalone Hono Worker routing (para instâncias em memória)
const workerApp = new Hono();

let storeSettings = { ...defaultSettings };
let storeCategories = [...defaultCategories];
let storeProducts = [...defaultProducts];
let storeLeads: Lead[] = [];

workerApp.get("/api/settings", (c) => c.json(storeSettings));
workerApp.post("/api/settings", async (c) => {
  const body = await c.req.json();
  storeSettings = { ...storeSettings, ...body };
  return c.json({ ok: true, message: "Configurações salvas!" });
});

workerApp.get("/api/products", (c) => {
  const category = c.req.query("category");
  const search = c.req.query("search");
  const featured = c.req.query("featured");

  let list = storeProducts.filter(p => p.is_active === 1);

  if (category && category !== "Todos") {
    list = list.filter(p => p.category === category);
  }

  if (search) {
    const term = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.top_notes?.toLowerCase().includes(term)
    );
  }

  if (featured === "true") {
    list = list.filter(p => p.is_featured === 1);
  }

  return c.json(list);
});

workerApp.get("/api/products/:id", (c) => {
  const id = c.req.param("id");
  const prod = storeProducts.find(p => p.id === id);
  if (!prod) return c.json({ error: "Produto não encontrado" }, 404);
  return c.json(prod);
});

workerApp.post("/api/products", async (c) => {
  const p = await c.req.json<Partial<Product>>();
  const id = p.id || `prod-${Date.now()}`;
  const numericPrice = typeof p.numeric_price === 'number' ? p.numeric_price : parseFloat(String(p.price).replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
  const formattedPrice = p.price && String(p.price).includes('R$') ? String(p.price) : `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;

  const newProd: Product = {
    id,
    name: p.name || "Novo Perfume",
    price: formattedPrice,
    numeric_price: numericPrice,
    img: p.img || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
    category: p.category || "Amadeirados",
    description: p.description || "",
    volume: p.volume || "100 ml",
    concentration: p.concentration || "Eau de Parfum",
    gender: p.gender || "Unissex",
    top_notes: p.top_notes || "",
    heart_notes: p.heart_notes || "",
    base_notes: p.base_notes || "",
    stock: p.stock !== undefined ? p.stock : 10,
    is_featured: p.is_featured ? 1 : 0,
    is_active: 1,
    created_at: Date.now()
  };

  storeProducts.unshift(newProd);
  return c.json({ ok: true, id, message: "Produto cadastrado com sucesso!" });
});

workerApp.put("/api/products/:id", async (c) => {
  const id = c.req.param("id");
  const p = await c.req.json<Partial<Product>>();
  const index = storeProducts.findIndex(item => item.id === id);

  if (index !== -1) {
    const numericPrice = typeof p.numeric_price === 'number' ? p.numeric_price : parseFloat(String(p.price).replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
    const formattedPrice = p.price && String(p.price).includes('R$') ? String(p.price) : `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;

    storeProducts[index] = {
      ...storeProducts[index],
      ...p,
      price: formattedPrice,
      numeric_price: numericPrice,
      is_featured: p.is_featured ? 1 : 0
    };
  }

  return c.json({ ok: true, message: "Produto atualizado com sucesso!" });
});

workerApp.delete("/api/products/:id", (c) => {
  const id = c.req.param("id");
  storeProducts = storeProducts.filter(p => p.id !== id);
  return c.json({ ok: true, message: "Produto removido!" });
});

workerApp.get("/api/categories", (c) => c.json(storeCategories));

workerApp.post("/api/categories", async (c) => {
  const body = await c.req.json<{ name: string; description?: string }>();
  const id = `cat-${Date.now()}`;
  const newCat = { id, name: body.name, description: body.description || "" };
  storeCategories.push(newCat);
  return c.json({ ok: true, id, message: "Categoria criada!" });
});

workerApp.delete("/api/categories/:id", (c) => {
  const id = c.req.param("id");
  storeCategories = storeCategories.filter(cat => cat.id !== id);
  return c.json({ ok: true, message: "Categoria removida!" });
});

workerApp.get("/api/leads", (c) => c.json(storeLeads));

workerApp.post("/api/leads", async (c) => {
  const body = await c.req.json<Partial<Lead>>();
  const id = `lead-${Date.now()}`;
  storeLeads.unshift({
    id,
    product_id: body.product_id || "",
    product_name: body.product_name || "Consulta Geral",
    customer_name: body.customer_name || "Visitante da Loja",
    customer_phone: body.customer_phone || "",
    notes: body.notes || "",
    created_at: Date.now()
  });
  return c.json({ ok: true });
});

workerApp.get("/api/stats", (c) => {
  return c.json({
    totalProducts: storeProducts.filter(p => p.is_active === 1).length,
    totalCategories: storeCategories.length,
    totalLeads: storeLeads.length,
    featuredCount: storeProducts.filter(p => p.is_featured === 1 && p.is_active === 1).length
  });
});

workerApp.post("/api/reset-demo", (c) => {
  storeSettings = { ...defaultSettings };
  storeCategories = [...defaultCategories];
  storeProducts = [...defaultProducts];
  storeLeads = [];
  return c.json({ ok: true, message: "Banco de dados restaurado ao padrão de demonstração!" });
});

export default {
  async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (env.APP_DO && typeof env.APP_DO === "object") {
        const doEnv = env.APP_DO as { idFromName: (name: string) => { get: (id: unknown) => { fetch: typeof fetch } } };
        const id = doEnv.idFromName("global");
        const stub = doEnv.get(id);
        return stub.fetch(request);
      }
      return workerApp.fetch(request, env, ctx);
    }
    return new Response("Not found", { status: 404 });
  }
};
