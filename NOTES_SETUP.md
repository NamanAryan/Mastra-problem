# Notes Feature Setup Instructions

## Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to create the notes table:

```sql
-- Notes table (investigation documentation)
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'wallet', 'pattern')),
    entity_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes(project_id, entity_type, entity_id);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY notes_select ON notes FOR SELECT
    USING (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

CREATE POLICY notes_insert ON notes FOR INSERT
    WITH CHECK (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
        AND created_by = auth.uid()
    );

CREATE POLICY notes_delete ON notes FOR DELETE
    USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
        AND created_by = auth.uid()
    );
```

## Features Implemented

### Backend (FastAPI)

- ✅ `POST /api/notes` - Create a new note
- ✅ `GET /api/notes?project_id=&entity_type=&entity_id=` - Fetch notes
- ✅ `DELETE /api/notes/{note_id}` - Delete a note (owner only)

### Frontend (React + TypeScript)

- ✅ **NotesPanel Component** - Professional investigation notes UI
- ✅ **Context-Aware Display**:
  - Shows project-level notes by default
  - Shows wallet-specific notes when wallet is selected
  - Shows pattern-specific notes when pattern is selected (overrides wallet)
- ✅ **Features**:
  - Add new notes with textarea input
  - Display notes in chronological order
  - Show timestamp in readable format
  - Delete own notes
  - Auto-refresh after note creation/deletion

### Integration

- ✅ Notes panel integrated into Dashboard
- ✅ Uses 3-column grid layout: Patterns | Details | Notes
- ✅ Automatically switches context based on selection
- ✅ Styled for compliance/audit use (no emojis, professional appearance)

## Usage

1. Run the SQL script in Supabase SQL Editor
2. Restart your backend server if it's running
3. The notes panel will appear on the right side of the investigation dashboard
4. Notes automatically switch context when you:
   - Select a wallet
   - Select a pattern
   - Deselect both (shows project notes)

## Security

- Row Level Security (RLS) enforced
- Users can only see notes in their own projects
- Users can only delete their own notes
- All operations require authentication
