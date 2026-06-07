-- ============================================================
-- ESQUEMA TFG - DAW  |  Barbería VIP Granada
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- CLIENTES
create table clientes (
  id         uuid default gen_random_uuid() primary key,
  nombre     text not null,
  apellido   text not null,
  telefono   text not null unique,
  created_at timestamptz default now()
);

-- CITAS
create table citas (
  id         uuid default gen_random_uuid() primary key,
  cliente_id uuid references clientes(id) on delete set null,
  telefono   text not null,
  nombre     text not null,
  apellido   text not null,
  servicio   text not null,
  precio     text not null,
  duracion   integer not null,
  fecha      date not null,
  hora       time not null,
  notas      text,
  estado     text not null default 'confirmada'
             check (estado in ('confirmada', 'cancelada', 'completada')),
  created_at timestamptz default now()
);

create index citas_fecha_idx    on citas(fecha);
create index citas_telefono_idx on citas(telefono);

-- CONTACTOS (formulario del portfolio)
create table contactos (
  id         uuid default gen_random_uuid() primary key,
  nombre     text not null,
  email      text not null,
  asunto     text not null,
  mensaje    text not null,
  created_at timestamptz default now()
);

-- ---- Row Level Security ----
alter table clientes  enable row level security;
alter table citas     enable row level security;
alter table contactos enable row level security;

-- Clientes: insertar y consultar (necesario para upsert desde el formulario)
create policy "anon_insert_clientes" on clientes for insert to anon with check (true);
create policy "anon_select_clientes" on clientes for select to anon using (true);
create policy "anon_update_clientes" on clientes for update to anon using (true);

-- Citas: insertar, consultar disponibilidad y cancelar
create policy "anon_insert_citas"  on citas for insert to anon with check (true);
create policy "anon_select_citas"  on citas for select to anon using (true);
create policy "anon_update_citas"  on citas for update to anon using (true);

-- Contactos: solo insertar
create policy "anon_insert_contactos" on contactos for insert to anon with check (true);