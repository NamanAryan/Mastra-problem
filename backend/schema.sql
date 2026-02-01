-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    dataset_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallets table (nodes in the transaction graph)
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    wallet_hash TEXT NOT NULL,
    risk_score INT DEFAULT 0,
    inflow DECIMAL(20, 8) DEFAULT 0,
    outflow DECIMAL(20, 8) DEFAULT 0,
    transaction_count INT DEFAULT 0,
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, wallet_hash)
);

-- Transactions table (edges in the transaction graph)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    from_wallet TEXT NOT NULL,
    to_wallet TEXT NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    token_type TEXT DEFAULT 'ETH',
    timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis results table
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    dataset_name TEXT,
    results_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_project_id ON wallets(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_analyses_project_id ON analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_entity ON notes(project_id, entity_type, entity_id);

-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY projects_select ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY projects_insert ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY projects_update ON projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY projects_delete ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for wallets (access through project)
CREATE POLICY wallets_select ON wallets FOR SELECT
    USING (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

CREATE POLICY wallets_insert ON wallets FOR INSERT
    WITH CHECK (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

-- RLS Policies for transactions (access through project)
CREATE POLICY transactions_select ON transactions FOR SELECT
    USING (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

CREATE POLICY transactions_insert ON transactions FOR INSERT
    WITH CHECK (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

-- RLS Policies for analyses (access through project)
CREATE POLICY analyses_select ON analyses FOR SELECT
    USING (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

CREATE POLICY analyses_insert ON analyses FOR INSERT
    WITH CHECK (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

-- RLS Policies for notes (access through project)
DROP POLICY IF EXISTS notes_select ON notes;
CREATE POLICY notes_select ON notes FOR SELECT
    USING (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

DROP POLICY IF EXISTS notes_insert ON notes;
CREATE POLICY notes_insert ON notes FOR INSERT
    WITH CHECK (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
        AND created_by = auth.uid()
    );

DROP POLICY IF EXISTS notes_delete ON notes;
CREATE POLICY notes_delete ON notes FOR DELETE
    USING (
        project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
        AND created_by = auth.uid()
    );
