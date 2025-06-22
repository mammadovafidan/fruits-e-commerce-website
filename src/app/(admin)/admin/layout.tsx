import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createSupabaseServerClient();
  
  // Get the current user session
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // Authentication Check: If no user is logged in, redirect to login
  if (!user) {
    redirect('/login');
  }
  
  // Authorization Check: If user is not an admin, redirect to homepage
  if (user.user_metadata?.role !== 'admin') {
    redirect('/');
  }
  
  // Success Case: User is logged in AND is an admin
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 