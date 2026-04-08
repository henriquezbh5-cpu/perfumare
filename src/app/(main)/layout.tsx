import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
