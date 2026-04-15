export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-16 relative z-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <div className="w-16 h-0.5 bg-gradient-to-r from-[var(--mclaren-red)] to-[var(--premium-burgundy)] mx-auto mb-8"></div>
          <p className="text-[var(--text-muted)] font-medium mb-4 tracking-wide">
            © 2025 Muhammad Khalid Atthoriq. All rights reserved.
          </p>
          <p className="text-[var(--foreground)] text-sm font-medium tracking-wide">
            Build with passion
          </p>
        </div>
      </div>
    </footer>
  );
}
