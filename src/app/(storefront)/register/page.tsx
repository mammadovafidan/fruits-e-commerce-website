import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function signUp(formData: FormData) {
  "use server";
  
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Validate required fields
  if (!fullName || !email || !password) {
    throw new Error("All fields are required");
  }
  
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // If successful, redirect to homepage
    revalidatePath('/');
    redirect('/');
    
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Join us to start shopping for fresh fruits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Create a secure password"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 