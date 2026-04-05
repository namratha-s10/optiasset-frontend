import { LayoutDashboard, Package, Users, Settings } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const items = [
  { title: "Dashboard", url: "#", icon: LayoutDashboard, roles: ["Admin", "Employee"] },
  { title: "My Assets", url: "#", icon: Package, roles: ["Admin", "Employee"] },
  { title: "User Management", url: "#", icon: Users, roles: ["Admin"] }, 
  { title: "System Settings", url: "#", icon: Settings, roles: ["Admin"] }, 
]

export function AppSidebar({ userRole }: { userRole: string }) {
  // This filters the menu so Employees can't see "User Management"
  const filteredItems = items.filter(item => item.roles.includes(userRole))

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold p-4">OptiAsset</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}