'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FolderOpen, 
  LogOut 
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderOpen,
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Exit</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 