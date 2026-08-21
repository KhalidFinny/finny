import type { Social } from '@/types/site'

export default function Footer({ socials }: { socials: Social[] }) {
  return (
    <footer className="bg-white px-6 py-16 md:px-12 lg:px-24">
      <p>© {new Date().getFullYear()} Khalid Atthoriq</p>
      <ul className="mt-2 flex flex-wrap gap-4">
        <li>
          <a
            href="/CV%20-%20Muhammad%20Khalid%20Atthoriq.pdf"
            className="underline"
          >
            CV
          </a>
        </li>
        {socials.map((social) => (
          <li key={social.id}>
            <a href={social.url} className="underline">
              {social.url}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
