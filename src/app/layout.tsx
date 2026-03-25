import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedInBoost - Optimisez votre présence LinkedIn",
  description: "Maximisez votre impact sur LinkedIn avec l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
