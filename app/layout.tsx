// /home/ubuntu/corretor_site/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image"; // Import Image component
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button"; // Import Button for mobile menu
import { client } from "@/lib/sanity.client";
import { settingsQuery } from "@/lib/sanity.queries";
import { urlForImage } from "@/lib/sanity.image";
import { SanityDocument } from "next-sanity";

const inter = Inter({ subsets: ["latin"] });

// Define an interface for the settings data
interface SettingsData extends SanityDocument {
  title?: string;
  logo?: any; // Adjust type based on your image schema
  logoUrl?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  institutionalText?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactEmail?: string;
  contactAddress?: string;
}

// Function to fetch settings
async function getSettings(): Promise<SettingsData | null> {
  try {
    const settings = await client.fetch<SettingsData>(settingsQuery);
    return settings;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}

// Generate dynamic metadata if needed, or keep static
export const metadata: Metadata = {
  title: "Carlos Imóveis | Especialista em Imóveis de Alto Padrão", // Can be made dynamic later
  description:
    "Encontre o imóvel dos seus sonhos com Carlos Rodrigues, especialista em imóveis de alto padrão em São Paulo.", // Can be made dynamic later
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const logoUrl = settings?.logo ? urlForImage(settings.logo)?.width(200).url() : "/placeholder-logo.svg";
  const whatsappLink = settings?.contactWhatsApp
    ? `https://wa.me/${settings.contactWhatsApp.replace(/\D/g, "")}`
    : "#";

  // Inject CSS variables for colors
  const colorStyles = `
    :root {
      --background: ${settings?.backgroundColor || "#ffffff"};
      --foreground: ${settings?.textColor || "#111827"};
      --primary: ${settings?.primaryColor || "#3b82f6"};
      /* Add other color variables if needed based on shadcn/ui theme */
    }
  `;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorStyles }} />
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* Header - Moved from page.tsx to layout.tsx for global presence */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                {logoUrl && (
                  <Image
                    src={logoUrl}
                    alt={settings?.title || "Carlos Imóveis Logo"}
                    width={150} // Adjust width as needed
                    height={40} // Adjust height as needed
                    priority
                    style={{ height: "auto" }} // Maintain aspect ratio
                  />
                )}
                {/* Fallback text if no logo */}
                {!logoUrl && (
                  <span className="text-xl font-bold text-primary">Carlos Imóveis</span>
                )}
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">
                  Início
                </Link>
                <Link href="/imoveis" className="text-sm font-medium text-foreground/70 hover:text-primary">
                  Imóveis
                </Link>
                {/* Links to sections might need adjustment if IDs change or become dynamic */}
                <Link href="/#sobre" className="text-sm font-medium text-foreground/70 hover:text-primary">
                  Sobre
                </Link>
                <Link href="/#depoimentos" className="text-sm font-medium text-foreground/70 hover:text-primary">
                  Depoimentos
                </Link>
                <Link href="/#contato" className="text-sm font-medium text-foreground/70 hover:text-primary">
                  Contato
                </Link>
              </nav>
              <div className="md:hidden">
                {/* Basic Mobile Menu Toggle - Functionality needs implementation (e.g., using state, Sheet component) */}
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Abrir menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          {/* Footer - Moved from page.tsx to layout.tsx */}
          <footer className="border-t bg-slate-100 dark:bg-slate-800">
            <div className="container py-12">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {settings?.title || "Carlos Imóveis"}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {settings?.institutionalText ||
                      "Especialistas em imóveis de alto padrão, oferecendo um serviço personalizado e exclusivo para cada cliente."}
                  </p>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Links Rápidos</h3>
                  <nav className="flex flex-col space-y-2">
                    <Link href="/" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                      Início
                    </Link>
                    <Link href="/imoveis" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                      Imóveis
                    </Link>
                    <Link href="/#sobre" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                      Sobre
                    </Link>
                    <Link href="/#depoimentos" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                      Depoimentos
                    </Link>
                    <Link href="/#contato" className="text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary">
                      Contato
                    </Link>
                  </nav>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">Fale Conosco</h3>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {settings?.contactPhone && (
                      <p>📞 {settings.contactPhone}</p>
                    )}
                    {settings?.contactEmail && (
                      <p>📧 {settings.contactEmail}</p>
                    )}
                    {settings?.contactAddress && (
                      <p>📍 {settings.contactAddress}</p>
                    )}
                  </div>
                  {settings?.contactWhatsApp && (
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp mr-2" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.1-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338- .943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                        </svg>
                        Fale pelo WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-8 border-t pt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} {settings?.title || "Carlos Imóveis"}. Todos os direitos reservados.
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

