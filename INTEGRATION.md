# Frontend-Backend Integration Summary

## ✅ What's Been Done

### Backend Endpoints Created

All endpoints now properly integrated with Supabase and require JWT authentication:

1. **GET /api/projects** - List all projects for authenticated user
2. **POST /api/projects** - Create new project
3. **DELETE /api/projects/{project_id}** - Delete project (cascades to wallets, transactions, analyses)
4. **GET /api/projects/{project_id}/analysis** - Fetch wallets, transactions, and statistics for a project

### Database Schema (SQL)

Created `backend/schema.sql` with:

- `projects` - User projects
- `wallets` - Transaction graph nodes (addresses)
- `transactions` - Transaction graph edges (transfers)
- `analyses` - Stored analysis results
- Row-Level Security (RLS) policies for data isolation per user

### Frontend API Integration

#### ProjectsPage.tsx

- ✅ Fetches projects from `GET /api/projects`
- ✅ Creates projects via `POST /api/projects`
- ✅ Deletes projects via `DELETE /api/projects/{id}`
- ✅ Falls back to mock data if backend unavailable
- ✅ Real-time project list updates

#### Dashboard.tsx

- ✅ Fetches analysis data from `GET /api/projects/{projectId}/analysis`
- ✅ Displays statistics cards (wallets, transactions, suspicious, volume)
- ✅ Renders GraphVisualization with real wallet/transaction data
- ✅ Shows transaction table (paginated, first 10)
- ✅ Loading state with spinner
- ✅ Error handling with fallback mock data

#### Types

Updated `frontend/src/types/index.ts`:

- Added `dataset`, `walletCount`, `analyses` to Project interface
- All types match backend response format

## 🔄 Data Flow

```
User Login
  ↓
ProjectsPage: GET /api/projects → Renders project list
  ↓
Click Project → Navigate to /dashboard?projectId={id}
  ↓
Dashboard: GET /api/projects/{projectId}/analysis
  ↓
Display: Statistics + Graph + Transactions
```

## 🚀 Next Steps

### To Run the Application

1. **Start Backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

2. **Initialize Database** (in Supabase)
   - Copy SQL from `backend/schema.sql`
   - Paste into Supabase SQL Editor
   - Execute to create tables and RLS policies

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

### To Add Real Data

The backend is ready to accept CSV uploads. Next implementation:

1. **Upload endpoint** - `POST /api/projects/{projectId}/upload`
   - Accept CSV with transaction data
   - Parse and insert into `wallets`, `transactions` tables
   - Calculate positions, risk scores, statistics

2. **Graph analysis engine**
   - Run network analysis on uploaded data
   - Detect patterns (fan-in, fan-out, circular flows)
   - Calculate risk scores based on patterns

3. **Analysis storage**
   - Save results to `analyses` table
   - Return AnalysisResult structure to frontend

## 📋 API Reference

### GET /api/projects

```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "dataset": "string|null",
      "createdAt": "ISO8601",
      "walletCount": 0,
      "analyses": 0
    }
  ]
}
```

### GET /api/projects/{projectId}/analysis

```json
{
  "wallets": [
    {
      "id": "uuid",
      "hash": "0x...",
      "x": 0,
      "y": 0,
      "riskScore": 0-100,
      "inflow": 0.0,
      "outflow": 0.0,
      "transactionCount": 0
    }
  ],
  "transactions": [
    {
      "id": "uuid",
      "from": "0x...",
      "to": "0x...",
      "amount": 0.0,
      "timestamp": "ISO8601",
      "tokenType": "ETH"
    }
  ],
  "statistics": {
    "totalTransactions": 0,
    "uniqueWallets": 0,
    "suspiciousWallets": 0,
    "totalVolume": 0.0
  }
}
```

## 🔐 Authentication

- All endpoints require `Authorization: Bearer {jwt_token}` header
- Token provided by Supabase JWT from Google OAuth
- AuthContext extracts and passes token to API calls

## ⚙️ Configuration

**Backend** (`backend/main.py`):

- API_URL: `http://localhost:8000`
- CORS: Allows `localhost:5173` (Vite dev server)
- Supabase credentials from `.env`

**Frontend** (`frontend/src/pages/*.tsx`):

- API_URL: `http://localhost:8000`
- Falls back to mock data if backend unreachable

## 🔧 Troubleshooting

**"Failed to fetch projects"?**

- Ensure FastAPI backend is running (`python main.py`)
- Check CORS configuration allows frontend origin
- Verify Supabase credentials in `.env`

**"401 Not authenticated"?**

- Sign in again to refresh JWT token
- Token may have expired (JWT tokens are time-limited)

**"Project not found"?**

- Verify project was created in current user's account
- RLS policies enforce user_id matching
- Check browser dev console for actual error
