import { Link } from '@tanstack/react-router'
import type { Category, Project } from '@/types/site'

export default function Portfolio({
  categories,
  projects,
  activeCategory,
  onCategoryChange,
}: {
  categories: Category[]
  projects: Project[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}) {
  const items = projects.filter((project) => project.category_id === activeCategory)

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={category.id === activeCategory ? 'font-semibold underline' : ''}
          >
            {category.title}
          </button>
        ))}
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((project) => (
          <li key={project.id}>
            <Link to="/projects" className="underline">
              {project.title}
            </Link>
            {project.description && (
              <span className="text-gray-600"> — {project.description}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
