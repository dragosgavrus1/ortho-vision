import { cn } from "@/lib/utils";
import { StethoscopeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface SidebarProps {
  links: SidebarLink[];
  activePath: string;
}

interface SidebarLinkProps extends SidebarLink {
  isActive: boolean;
  navigate: (path: string) => void;
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  isActive,
  navigate,
}: SidebarLinkProps) {
  return (
    <button
      onClick={() => navigate(href)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
        isActive && "bg-gray-100 text-gray-900"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export function Sidebar({ links, activePath }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-[240px] flex-col border-r bg-white">
      <div className="p-6">
        <div className="flex items-center gap-2 font-semibold">
          <a className="navbar-brand" href="/">
            <StethoscopeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              Ortho Vision
            </span>
          </a>
        </div>
      </div>
      <div className="flex-1 px-3">
        <div className="space-y-1">
          {links.map((link) => (
            <SidebarLink
              key={link.href}
              {...link}
              isActive={activePath === link.href}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
