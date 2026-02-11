-- Create tables for English Learning Platform

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  pdf_url TEXT,
  total_chapters INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT,
  content_text TEXT,
  content_phonetic JSONB,  -- Array of {line: "text", phonetic: "/phonetic/"}
  summary TEXT,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Book Vocabulary table
CREATE TABLE IF NOT EXISTS book_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  phonetic_transcription TEXT,
  definition TEXT,
  translation TEXT,
  part_of_speech TEXT,
  example_sentence TEXT,
  first_appearance_chapter INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_vocabulary ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow public read for personal app, or restrict if auth added later)
-- For now, enabling public access since auth is disabled as per requirements
CREATE POLICY "Public read access for books" ON books FOR SELECT USING (true);
CREATE POLICY "Public insert access for books" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for books" ON books FOR UPDATE USING (true);

CREATE POLICY "Public read access for chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Public insert access for chapters" ON chapters FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access for vocabulary" ON book_vocabulary FOR SELECT USING (true);
CREATE POLICY "Public insert access for vocabulary" ON book_vocabulary FOR INSERT WITH CHECK (true);
