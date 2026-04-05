'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getAssets, deleteAsset, createAsset, Asset, AssetCreate } from "@/lib/api"

export default function Page() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAsset, setNewAsset] = useState<AssetCreate>({ name: "", category: "Hardware", serial_number: "" })

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await getAssets()
        setAssets(data)
      } catch (err) {
        setError("Could not connect to the backend. Please ensure the FastAPI server is running at http://localhost:8000.")
      } finally {
        setLoading(false)
      }
    }
    loadAssets()
  }, [])

  const handleRevoke = async (id: number) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await deleteAsset(id)
        setAssets(assets.filter(a => a.id !== id))
      } catch (err) {
        alert("Failed to delete asset. Check your permissions or backend logs.")
      }
    }
  }

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAsset.name || !newAsset.serial_number) {
      alert("Please fill in Name and Serial Number.")
      return
    }

    try {
      setLoading(true)
      const created = await createAsset(newAsset)
      setAssets([...assets, created])
      setShowAddForm(false)
      setNewAsset({ name: "", category: "Hardware", serial_number: "" })
    } catch (err) {
      alert("Failed to create asset. Make sure the backend is running and you have permissions.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2 text-sm">Welcome back to OptiVault Hub. Secure enterprise tracking.</p>
        </div>
        <div className="hidden sm:block">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="font-semibold shadow-md"
          >
            {showAddForm ? "Cancel Request" : "Add Asset Request"}
          </Button>
        </div>
      </div>

      {/* Add Asset Form */}
      {showAddForm && (
        <div className="bg-card p-6 rounded-2xl border shadow-sm animate-in zoom-in-95 duration-200">
          <h2 className="text-xl font-bold mb-4">Register New Asset</h2>
          <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase">Asset Name</label>
              <input 
                type="text" 
                placeholder="e.g. MacBook Pro M3"
                value={newAsset.name}
                onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                className="w-full p-2 rounded-md border bg-background"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase">Category</label>
              <select 
                value={newAsset.category}
                onChange={e => setNewAsset({...newAsset, category: e.target.value})}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Equipment">Equipment</option>
                <option value="Office">Office</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase">Serial Number</label>
              <input 
                type="text" 
                placeholder="SN-12345-XYZ"
                value={newAsset.serial_number}
                onChange={e => setNewAsset({...newAsset, serial_number: e.target.value})}
                className="w-full p-2 rounded-md border bg-background"
                required
              />
            </div>
            <div className="md:col-span-3">
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? "Adding..." : "Confirm Deployment"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-primary/10 rounded-full text-primary mr-4 ring-1 ring-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Inventory</p>
            <h3 className="text-2xl font-bold mt-1">{loading ? "..." : assets.length}</h3>
          </div>
        </div>

        <div className="flex items-center p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-destructive/10 rounded-full text-destructive mr-4 ring-1 ring-destructive/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Issues</p>
            <h3 className="text-2xl font-bold mt-1">4</h3>
          </div>
        </div>

        <div className="flex items-center p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-500/10 rounded-full text-green-500 mr-4 ring-1 ring-green-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Health</p>
            <h3 className="text-2xl font-bold mt-1">99.9%</h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      
      {/* Recent Activity Table */}
      <div className="border rounded-2xl overflow-hidden shadow-sm bg-card flex-1">
        <div className="border-b bg-muted/30 px-6 py-4">
          <h3 className="font-semibold text-lg">Integrated Assets (Total: {assets.length})</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Asset Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Serial Number</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    Loading assets from system...
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    No assets found in the database.
                  </td>
                </tr>
              ) : (
                assets.map(asset => (
                  <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${asset.status === 'Available' ? 'bg-green-500' : 'bg-yellow-500'}`}></div> {asset.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{asset.category}</td>
                    <td className="px-6 py-4 font-mono text-xs">{asset.serial_number}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                        asset.status === 'Available' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRevoke(asset.id)}
                        className="h-8 shadow-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
