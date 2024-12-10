import { Sidebar } from "@/components/SideBar/SideBar";

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  links: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[]; // Pass Sidebar links dynamically
}

export function Layout({ children, activePath, links }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar links={links} activePath={activePath} />
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
