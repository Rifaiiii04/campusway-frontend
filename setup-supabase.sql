-- Setup script untuk Supabase todos table
-- Jalankan di Supabase SQL Editor

-- 1. Buat table todos
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  user_id UUID,
  created_by UUID
);

-- 2. Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 3. Buat policy untuk allow all operations (development)
-- ⚠️ Untuk production, gunakan policy yang lebih ketat
CREATE POLICY "Allow all operations for todos" 
ON public.todos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Buat index untuk performa
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON public.todos(created_at DESC);
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS todos_completed_idx ON public.todos(completed);

-- 5. Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Trigger untuk auto-update updated_at
DROP TRIGGER IF EXISTS update_todos_updated_at ON public.todos;
CREATE TRIGGER update_todos_updated_at 
BEFORE UPDATE ON public.todos 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 7. Aktifkan Realtime untuk WebSocket
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;

-- 8. Insert sample data (optional)
INSERT INTO public.todos (task, completed) VALUES 
  ('Sample todo 1', false),
  ('Sample todo 2', true)
ON CONFLICT DO NOTHING;

-- Verifikasi
SELECT 'Table created successfully!' as status;
SELECT COUNT(*) as total_todos FROM public.todos;









