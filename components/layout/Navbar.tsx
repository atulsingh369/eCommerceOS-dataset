"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Home,
  ShoppingBag,
  LayoutGrid,
  Info,
  Package,
  LogOut,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => pathname === path;

  const closeMenu = () => setIsMenuOpen(false);

  // Mobile nav items with icons
  const mobileNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Products", icon: ShoppingBag },
    { href: "/categories", label: "Categories", icon: LayoutGrid },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/contact", label: "Contact Us", icon: MessagesSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                CommerceOS
              </span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/categories", label: "Categories" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-foreground/80 hover:underline underline-offset-4 ${
                    isActive(link.href)
                      ? "text-primary font-bold underline"
                      : "text-foreground/60"
                  } ${link.label === "Home" ? "sm:hidden lg:block" : ""}
                   ${link.label === "Contact Us" ? "sm:hidden lg:block" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Search + Cart + Profile/Auth + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <div className="hidden md:flex md:justify-center relative w-full max-w-sm items-center">
              <Search className="absolute left-2.5 top-[13px] h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-[100px] xs:w-[100px] sm:w-[160px] lg:w-[300px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(
                        target.value
                      )}`;
                    }
                  }
                }}
              />
            </div>

            {/* Cart Icon */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Desktop Profile Dropdown or Auth Buttons */}
            <div className="hidden md:flex gap-2">
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2"
                    aria-expanded={isProfileOpen}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden lg:inline-block">
                      {user.displayName?.split(" ")[0] ||
                        user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border z-50">
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Package className="h-4 w-4" />
                            My Orders
                          </Link>
                          <div className="border-t border-border my-1" />
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              signOut();
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-destructive"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu - Slide in from left */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed h-screen inset-0 bg-black/50 z-[100] md:hidden transition-opacity duration-300 ease-out"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <div
            className={`fixed h-screen inset-y-0 left-0 w-[280px] bg-background border-r border-border z-[101] md:hidden transform transition-transform duration-300 ease-out ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b border-border">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center space-x-2"
                >
                  <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    CommerceOS
                  </span>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-9 w-full"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          window.location.href = `/products?search=${encodeURIComponent(
                            target.value
                          )}`;
                          closeMenu();
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="p-4 flex-1 overflow-y-auto space-y-1">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Conditional: Orders (if logged in) */}
                {user && (
                  <Link
                    href="/orders"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/orders")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                )}

                {/* Conditional: Profile (if logged in) */}
                {user && (
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/profile")
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                )}
              </nav>

              {/* Bottom Section: Auth Actions */}
              <div className="sticky bg-background bottom-0 w-full p-4 border-t border-border">
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      closeMenu();
                      signOut();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <div className="space-y-4 flex flex-col">
                    <Link href="/login" onClick={closeMenu}>
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={closeMenu}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
