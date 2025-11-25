"use client"

import { Button } from "@/components/ui/button"
import { Bell, User, LogOut } from "lucide-react"

export function TopNav() {
  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Panel de Control</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
          <Bell className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
          <User className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  )
}
