"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Navbar = () => {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="w-full border-b flex items-center justify-between px-6 py-3 ">
      <Link href="/">
        <h1 className="text-xl font-bold">FitPage</h1>
      </Link>

      <div className="flex-1 px-4 max-w-md">
        <Input type="text" placeholder="Search products..." />
      </div>

      {!loading && (
        <div>
          {user ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button asChild>
              <Link
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`}
              >
                Login with Google
              </Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
