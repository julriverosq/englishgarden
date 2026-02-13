-- Database Schema for English Learning Platform (Reading Sessions Refactor)

-- 1. Books Table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  pdf_url TEXT,
  total_sessions INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Reading Sessions Table
-- Replaces 'chapters' for smaller, manageable reading chunks.
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL, -- 1, 2, 3...
  
  -- Content
  content_text TEXT NOT NULL,
  content_phonetic JSONB, -- [{line: "text", phonetic: "/IPA/"}] (Nullable for lazy loading)
  
  -- Metadata
  word_count INTEGER,
  estimated_reading_time INTEGER, -- seconds
  difficulty_score DECIMAL(3,2), -- 0.00 - 1.00
  
  -- Original Source Info
  source_pages TEXT, -- "p. 5"
  original_chapter_title TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  UNIQUE(book_id, session_number)
);

-- 3. Session Vocabulary Table
-- Linked to specific sessions for better context
CREATE TABLE IF NOT EXISTS session_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
  
  word TEXT NOT NULL,
  phonetic_transcription TEXT,
  definition TEXT NOT NULL,
  translation TEXT,
  part_of_speech TEXT,
  example_sentence TEXT,
  difficulty_level TEXT,
  
  first_appearance_session INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  UNIQUE(book_id, word)
);

-- 4. Indices for Performance
CREATE INDEX IF NOT EXISTS idx_reading_sessions_book ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_number ON reading_sessions(book_id, session_number);
CREATE INDEX IF NOT EXISTS idx_session_vocabulary_session ON session_vocabulary(session_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_vocabulary ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies
-- Public access enabled for development/personal use
CREATE POLICY "Public read access for books" ON books FOR SELECT USING (true);
CREATE POLICY "Public insert access for books" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for books" ON books FOR UPDATE USING (true);

CREATE POLICY "Public read access for reading_sessions" ON reading_sessions FOR SELECT USING (true);
CREATE POLICY "Public insert access for reading_sessions" ON reading_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for reading_sessions" ON reading_sessions FOR UPDATE USING (true);

CREATE POLICY "Public read access for session_vocabulary" ON session_vocabulary FOR SELECT USING (true);
CREATE POLICY "Public insert access for session_vocabulary" ON session_vocabulary FOR INSERT WITH CHECK (true);
