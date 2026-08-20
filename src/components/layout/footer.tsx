import { Film } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  {
    label: 'Discover',
    href: '/discover',
  },
  {
    label: 'My Shelf',
    href: '/shelf',
  },
  {
    label: 'Favorites',
    href: '/favorites',
  },
  {
    label: 'About',
    href: '/about',
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container-content">
        <div className="flex flex-col gap-8 py-10 sm:py-12">
          {/* Top */}
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Film className="size-4" />
                </span>

                <span className="text-lg font-bold tracking-tight">
                  Movie<span className="text-primary">Shelf</span>
                </span>
              </Link>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Your personal movie shelf. Discover films, build your
                collection, rate what you watch and develop your own taste.
              </p>
            </div>

            <nav
              aria-label="Footer navigation"
              className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} MovieShelf. All rights reserved.</p>

            <p>Built with curiosity, good taste & too many movies.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
