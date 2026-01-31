from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd
import io
from datetime import datetime
from pydantic import BaseModel

# Load environment variables
load_dotenv()

print("=" * 50)
print("ChainSleuth Backend Starting...")
print("=" * 50)

app = FastAPI(
    title="ChainSleuth API",
    description="Interactive Money Laundering Detection in Crypto Transaction Networks",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print(f"CORS configured for: http://localhost:5173")

# Supabase client
supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_KEY", "")

print(f"Connecting to Supabase...")
print(f"URL: {supabase_url}")
print(f"Key: {'*' * 20}...{supabase_key[-10:] if len(supabase_key) > 10 else 'MISSING'}")

try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("✓ Supabase connected successfully!")
except Exception as e:
    print(f"✗ Supabase connection failed: {e}")
    raise

print("=" * 50)

# Pydantic models
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    dataset: Optional[str]
    createdAt: str
    walletCount: int
    analyses: int

class WalletResponse(BaseModel):
    id: str
    hash: str
    x: float
    y: float
    riskScore: int
    inflow: float
    outflow: float
    transactionCount: int

class TransactionResponse(BaseModel):
    id: str
    from_wallet: str
    to_wallet: str
    amount: float
    timestamp: Optional[str]
    token_type: str

class AnalysisResponse(BaseModel):
    wallets: List[WalletResponse]
    transactions: List[TransactionResponse]
    statistics: dict

# Dependency to get current user from JWT
async def get_current_user(authorization: str = Header(...)):
    if not authorization:
        print("❌ Auth failed: No authorization header")
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        if user and user.user:
            print(f"✓ User authenticated: {user.user.email}")
        else:
            print(f"✓ User authenticated: Unknown")
        return user
    except Exception as e:
        print(f"❌ Auth failed: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint"""
    print("📍 Root endpoint hit")
    return {
        "message": "ChainSleuth API",
        "status": "operational",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    print("📍 Health check endpoint hit")
    return {"status": "healthy"}


@app.get("/api/user/profile")
async def get_user_profile(user = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "user": user.user.email if user.user else None,
        "id": user.user.id if user.user else None
    }


@app.post("/api/analysis/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    user = Depends(get_current_user)
):
    """
    Upload CSV dataset for analysis
    Expected columns: source_wallet, destination_wallet, timestamp, amount, token_type
    """
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Validate required columns
        required_columns = ['source_wallet', 'destination_wallet', 'timestamp', 'amount', 'token_type']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )
        
        # Basic statistics
        stats = {
            "total_transactions": len(df),
            "unique_wallets": len(set(df['source_wallet'].tolist() + df['destination_wallet'].tolist())),
            "date_range": {
                "start": df['timestamp'].min(),
                "end": df['timestamp'].max()
            },
            "total_amount": float(df['amount'].sum()),
            "token_types": df['token_type'].unique().tolist()
        }
        
        return {
            "message": "Dataset uploaded successfully",
            "filename": file.filename,
            "statistics": stats
        }
        
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/projects")
async def get_projects(user = Depends(get_current_user)):
    """Get all projects for the current user"""
    try:
        user_id = user.user.id
        print(f"📂 Fetching projects for user: {user_id}")
        response = supabase.table('projects').select("*").eq('user_id', user_id).execute()
        
        projects = []
        for proj in response.data:
            # Get wallet count for this project
            wallets = supabase.table('wallets').select("id").eq('project_id', proj['id']).execute()
            wallet_count = len(wallets.data) if wallets.data else 0
            
            projects.append({
                "id": proj['id'],
                "name": proj['name'],
                "description": proj.get('description'),
                "dataset": proj.get('dataset_name'),
                "createdAt": proj['created_at'],
                "userId": proj['user_id'],
                "walletCount": wallet_count
            })
        
        print(f"✓ Found {len(projects)} projects")
        return projects
    except Exception as e:
        print(f"❌ Error fetching projects: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/projects")
async def create_project(
    name: str,
    description: Optional[str] = None,
    file: Optional[UploadFile] = File(None),
    user = Depends(get_current_user)
):
    """Create a new project"""
    try:
        user_id = user.user.id
        print(f"📝 Creating project '{name}' for user: {user_id}")
        
        # Create project first
        project_data = {
            "user_id": user_id,
            "name": name,
            "description": description,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # If CSV file is uploaded, store filename
        if file:
            project_data["dataset_name"] = file.filename
            print(f"📄 CSV file attached: {file.filename}")
        
        response = supabase.table('projects').insert(project_data).execute()
        created_project = response.data[0]
        project_id = created_project['id']
        print(f"✓ Project created with ID: {project_id}")
        
        # Process CSV if uploaded
        wallet_count = 0
        if file:
            try:
                print(f"📊 Processing CSV file...")
                contents = await file.read()
                df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
                
                # Accept flexible column names
                column_mapping = {}
                for col in df.columns:
                    col_lower = col.lower().strip()
                    if 'from' in col_lower or 'source' in col_lower:
                        column_mapping['from_wallet'] = col
                    elif 'to' in col_lower or 'dest' in col_lower or 'target' in col_lower:
                        column_mapping['to_wallet'] = col
                    elif 'amount' in col_lower or 'value' in col_lower:
                        column_mapping['amount'] = col
                    elif 'time' in col_lower or 'date' in col_lower:
                        column_mapping['timestamp'] = col
                    elif 'token' in col_lower or 'currency' in col_lower or 'type' in col_lower:
                        column_mapping['token_type'] = col
                
                # Check if we have required columns
                if 'from_wallet' not in column_mapping or 'to_wallet' not in column_mapping or 'amount' not in column_mapping:
                    raise HTTPException(
                        status_code=400,
                        detail="CSV must contain columns for: from/source address, to/destination address, and amount"
                    )
                
                # Process transactions
                transactions_to_insert = []
                wallets_dict = {}
                
                for _, row in df.iterrows():
                    from_wallet = str(row[column_mapping['from_wallet']])
                    to_wallet = str(row[column_mapping['to_wallet']])
                    amount = float(row[column_mapping['amount']])
                    
                    # Get timestamp if available
                    timestamp = None
                    if 'timestamp' in column_mapping:
                        timestamp = str(row[column_mapping['timestamp']])
                    
                    # Get token type if available
                    token_type = 'ETH'
                    if 'token_type' in column_mapping:
                        token_type = str(row[column_mapping['token_type']])
                    
                    # Track wallets
                    if from_wallet not in wallets_dict:
                        wallets_dict[from_wallet] = {'inflow': 0, 'outflow': 0, 'tx_count': 0}
                    if to_wallet not in wallets_dict:
                        wallets_dict[to_wallet] = {'inflow': 0, 'outflow': 0, 'tx_count': 0}
                    
                    wallets_dict[from_wallet]['outflow'] += amount
                    wallets_dict[from_wallet]['tx_count'] += 1
                    wallets_dict[to_wallet]['inflow'] += amount
                    wallets_dict[to_wallet]['tx_count'] += 1
                    
                    transactions_to_insert.append({
                        "project_id": project_id,
                        "from_wallet": from_wallet,
                        "to_wallet": to_wallet,
                        "amount": amount,
                        "timestamp": timestamp,
                        "token_type": token_type
                    })
                
                # Insert transactions in batches
                if transactions_to_insert:
                    batch_size = 100
                    for i in range(0, len(transactions_to_insert), batch_size):
                        batch = transactions_to_insert[i:i + batch_size]
                        supabase.table('transactions').insert(batch).execute()
                
                # Insert wallets
                wallets_to_insert = []
                for wallet_hash, stats in wallets_dict.items():
                    # Simple risk score calculation
                    risk_score = 0
                    if stats['tx_count'] > 100:
                        risk_score += 30
                    if stats['outflow'] > stats['inflow'] * 2:
                        risk_score += 40
                    
                    wallets_to_insert.append({
                        "project_id": project_id,
                        "wallet_hash": wallet_hash,
                        "risk_score": min(risk_score, 100),
                        "inflow": stats['inflow'],
                        "outflow": stats['outflow'],
                        "transaction_count": stats['tx_count'],
                        "position_x": 0.0,
                        "position_y": 0.0
                    })
                
                # Insert wallets
                if wallets_to_insert:
                    supabase.table('wallets').insert(wallets_to_insert).execute()
                    wallet_count = len(wallets_to_insert)
                
                print(f"✓ CSV processed: {len(transactions_to_insert)} transactions, {wallet_count} wallets")
                    
            except pd.errors.ParserError:
                print(f"⚠️ CSV parsing failed, project created without data")
            except Exception as csv_err:
                print(f"⚠️ CSV processing error: {csv_err}")
        
        print(f"✓ Project creation complete")
        return {
            "id": created_project['id'],
            "name": created_project['name'],
            "description": created_project.get('description'),
            "dataset": created_project.get('dataset_name'),
            "createdAt": created_project['created_at'],
            "walletCount": wallet_count
        }
        
    except Exception as e:
        print(f"❌ Error creating project: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, user = Depends(get_current_user)):
    """Delete a project"""
    try:
        user_id = user.user.id
        print(f"🗑️ Deleting project {project_id} for user: {user_id}")
        
        # Verify ownership
        project = supabase.table('projects').select("*").eq('id', project_id).eq('user_id', user_id).execute()
        if not project.data:
            print(f"❌ Project not found or access denied")
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Delete cascading
        print(f"Deleting related data...")
        supabase.table('wallets').delete().eq('project_id', project_id).execute()
        supabase.table('transactions').delete().eq('project_id', project_id).execute()
        supabase.table('analyses').delete().eq('project_id', project_id).execute()
        supabase.table('projects').delete().eq('id', project_id).execute()
        
        print(f"✓ Project deleted successfully")
        return {"message": "Project deleted"}
        
    except Exception as e:
        print(f"❌ Error deleting project: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/api/projects/{project_id}/analysis")
async def get_project_analysis(project_id: str, user = Depends(get_current_user)):
    """Get analysis data (wallets and transactions) for a project"""
    try:
        user_id = user.user.id
        print(f"📈 Fetching analysis for project {project_id}")
        
        # Verify ownership
        project = supabase.table('projects').select("*").eq('id', project_id).eq('user_id', user_id).execute()
        if not project.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project.data[0]
        
        # Get wallets
        wallets_response = supabase.table('wallets').select("*").eq('project_id', project_id).execute()
        wallets = []
        for w in wallets_response.data:
            wallets.append({
                "id": w['id'],
                "hash": w['wallet_hash'],
                "x": float(w.get('position_x', 0)),
                "y": float(w.get('position_y', 0)),
                "riskScore": int(w.get('risk_score', 0)),
                "inflow": float(w.get('inflow', 0.0)),
                "outflow": float(w.get('outflow', 0.0)),
                "transactionCount": int(w.get('transaction_count', 0))
            })
        
        # Get transactions
        tx_response = supabase.table('transactions').select("*").eq('project_id', project_id).execute()
        transactions = []
        for tx in tx_response.data:
            transactions.append({
                "id": tx['id'],
                "from_wallet": tx['from_wallet'],
                "to_wallet": tx['to_wallet'],
                "amount": float(tx['amount']),
                "timestamp": tx.get('timestamp'),
                "token_type": tx.get('token_type', 'ETH')
            })
        
        # Calculate statistics
        stats = {
            "totalTransactions": len(transactions),
            "uniqueWallets": len(wallets),
            "suspiciousWallets": len([w for w in wallets if w['riskScore'] > 50]),
            "totalVolume": sum(t['amount'] for t in transactions)
        }
        
        print(f"✓ Analysis data ready: {len(wallets)} wallets, {len(transactions)} transactions")
        return {
            "name": project_data['name'],
            "wallets": wallets,
            "transactions": transactions,
            "statistics": stats
        }
    except Exception as e:
        print(f"❌ Error fetching analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting server on http://0.0.0.0:8000")
    print("📖 API docs available at http://localhost:8000/docs")
    print("=" * 50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
