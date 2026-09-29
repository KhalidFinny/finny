import type { Profile, Social, Tech } from '@/types/site'

export default function About({
  profile,
  techs,
  socials,
}: {
  profile: Profile
  techs: Tech[]
  socials: Social[]
}) {
  return (
    <section id="about" className="bg-white px-6 py-16 md:px-12 lg:px-24">
      <h2 className="text-xl font-semibold">{profile.about_headline}</h2>
      <p className="mt-4 max-w-2xl">{profile.about_profile}</p>
      <p className="mt-3 max-w-2xl">{profile.about_study.replace(/—/g, ',')}</p>
      <p className="mt-6 text-sm text-gray-600">{techs.map((tech) => tech.name).join(', ')}</p>
      <ul className="mt-4">
        {socials.map((social) => (
          <li key={social.id}>
            <a href={social.url} className="underline">
              {social.url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
