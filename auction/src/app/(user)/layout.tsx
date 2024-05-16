import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "../components/navbar-menu";
import Footer from "../components/footer";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "../components/toggle-mode";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Nav />
      {children}
      <Footer />
      <Toaster />
      <ModeToggle />
    </ThemeProvider>
  );
}
