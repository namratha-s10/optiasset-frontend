"use client"

import { useState, useEffect } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { useTheme } from "next-themes"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState("Admin")
  const [email, setEmail] = useState("admin@optivault.com")
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedRole = localStorage.getItem("opti_role") || "Admin"
    const savedEmail = localStorage.getItem("opti_email") || "admin@optivault.com"
    setRole(savedRole)
    setEmail(savedEmail)
  }, [])

  const toggleRole = () => {
    const nextRole = role === "Admin" ? "Employee" : "Admin"
    const nextEmail = nextRole === "Admin" ? "admin@optivault.com" : "employee@optivault.com"
    setRole(nextRole)
    setEmail(nextEmail)
    localStorage.setItem("opti_role", nextRole)
    localStorage.setItem("opti_email", nextEmail)
    // Reload to refresh data with new role
    window.location.reload()
  }

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")

  if (!mounted) {
    return <div className="min-h-screen bg-background text-foreground" />
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar userRole={role} /> 
        <main className="w-full flex-1 flex flex-col min-h-screen bg-background text-foreground">
          <header className="flex items-center justify-between p-4 border-b bg-card text-card-foreground">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="font-bold text-lg hidden sm:block">OptiVault Hub</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-xs">
                  <span className="text-muted-foreground hidden sm:inline">Role:</span>
                  <strong className="text-secondary-foreground">{role}</strong>
                </div>
                <span className="text-[10px] text-muted-foreground">{email}</span>
              </div>
              <button 
                onClick={toggleRole} 
                className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
              >
                Switch to {role === "Admin" ? "Employee" : "Admin"}
              </button>
              <button 
                onClick={toggleTheme} 
                className="text-xs bg-background text-foreground border border-border px-4 py-2 rounded-md font-medium hover:bg-muted transition-colors whitespace-nowrap shadow-sm"
              >
                {resolvedTheme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </header>
          <div className="flex-1 p-6 md:p-8 overflow-auto">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
