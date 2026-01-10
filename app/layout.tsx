import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SafeAuthProvider } from "@/lib/contexts/safe-auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "APOLO - Gestión de Campañas",
  description: "Plataforma profesional de gestión de campañas políticas y electorales",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <SafeAuthProvider>
          {children}
          <Analytics />
        </SafeAuthProvider>
      </body>
    </html>
  )
}
