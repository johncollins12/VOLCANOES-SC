import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * Shared chrome for every public-facing page (Navbar + Footer). Feature
 * pages (homepage, fixtures, news, etc.) will be added under this route
 * group in later phases — this layout does not change when they are.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
