// Static seed data — dev fallback when cloudflare:workers is unavailable.
import type { SiteData } from '@/types/site'

export function getStaticSiteData(): SiteData {
  return {
    profile: {"id": 1, "name": "Khalid Atthoriq", "title": "Fullstack Creative Developer", "about_headline": "I design interfaces and build them to work", "about_profile": "I\u2019m a Fullstack Developer and UI/UX Designer focused on building responsive, user-centered digital products.", "about_study": "I combine frontend development, backend systems, and UX design to create interfaces that are clear, performant, and practical\u2014from industrial dashboards and internal systems to client-facing web applications.", "approach": "Build it clean. Make it workable. Give it character, soul, and life.", "approach_detail": "I keep layouts editorial and structured, but still easy for people to use.", "approach_detail_2": "I care about clear hierarchy, strong visuals, and smooth interactions."},
    categories: [
      {
        "id": "programming",
        "title": "Programming",
        "see_more_link": "https://drive.google.com/drive/folders/1GKB7l--fYM1Pk6oBs9qdE7w8sXbMIDRM?usp=sharing",
        "sort_order": 0
      },
      {
        "id": "ui-ux",
        "title": "UI/UX Design",
        "see_more_link": "https://drive.google.com/file/d/1chC-iyWf599BFjHn7WU3EnQocImydr4s/view?usp=sharing",
        "sort_order": 0
      },
      {
        "id": "videography",
        "title": "Videography",
        "see_more_link": "https://drive.google.com/drive/folders/1nJ36224aH9--g42N2PEbcAlc2ipyWLwo?usp=sharing",
        "sort_order": 0
      },
      {
        "id": "photography",
        "title": "Photography",
        "see_more_link": "https://instagram.com/finny.picss",
        "sort_order": 0
      }
    ],
    projects: [
      {
        "id": "prog1",
        "category_id": "programming",
        "title": "Novaris Risk Assessment",
        "role": "Frontend Developer | UI/UX Designer",
        "stack": "Typescript | React Vite | Tailwind",
        "year": "2025",
        "status": "done",
        "image": "/media/projects%2F1787116435379-829411c0-fe84-404c-bcc6-748f7a29d11d-screenshot-20260819-095633.png",
        "description": "Novaris is a Decision Support System for SMEs that helps businesses make smarter, more informed decisions by analyzing project options, risks, vendors, and potential ROI. It simplifies complex data into clear recommendations, helping businesses understand **what to choose, why it makes sense, and what results they can expect**.",
        "youtube_embed": null,
        "instagram_link": null,
        "google_drive_link": null,
        "link": "https://novaris-six.vercel.app/",
        "source_link": null,
        "gallery": "[]",
        "sort_order": 0
      }
    ],
    experiences: [
      {
        "id": "exp0",
        "role": "Front-end Developer Intern",
        "company": "PT Intelix Global Crossing",
        "location": "Malang, Indonesia",
        "period": "July 2026 \u2014 Present",
        "description": "[\"Optimized front-end performance using TanStack libraries.\", \"Modernized product UI designs with modern UX principles.\", \"Optimized query handling with TanStack Query for faster API queries.\"]",
        "type": "work",
        "sort_order": 0
      },
      {
        "id": "exp1",
        "role": "Fullstack Web Developer Internship",
        "company": "PT Surabaya Autocomp Indonesia",
        "location": "Ngoro, Indonesia",
        "period": "January 2026 \u2014 June 2026",
        "description": "[\"Developed a simulator to efficiency in production preparation.\", \"Optimized website performance to ensure users work smoothly in preparing mass production documents.\", \"Optimized workers workflow in automating documents generation.\"]",
        "type": "work",
        "sort_order": 1
      },
      {
        "id": "exp2",
        "role": "Freelance Web Developer & UI/UX Designer",
        "company": "Self-Employed",
        "location": "Malang, Indonesia",
        "period": "February 2024 \u2014 February 2026",
        "description": "[\"Developed and launched responsive client websites praised for clarity, speed, and strong brand alignment.\", \"Optimized front-end performance and accessibility, improving user satisfaction and SEO visibility.\", \"Delivered a food security system recognized for its reliability and ease of data handling by field users.\"]",
        "type": "work",
        "sort_order": 2
      },
      {
        "id": "exp3",
        "role": "UI/UX Designer Internship",
        "company": "PT Molca Teknologi Nusantara",
        "location": "Surabaya, Indonesia",
        "period": "August 2025 \u2014 October 2025",
        "description": "[\"Created Digital Twin dashboards that enhanced monitoring flow and simplified industrial decision-making.\", \"Collaborated closely with developers to refine design consistency, building a unified system.\"]",
        "type": "work",
        "sort_order": 3
      },
      {
        "id": "exp4",
        "role": "Creative Team Lead",
        "company": "Workshop Riset Informatika",
        "location": "Malang, Indonesia",
        "period": "February 2024 \u2014 February 2026",
        "description": "[\"Led the creative division to build a unified and professional brand identity across WRI\\u2019s platforms.\", \"Developed an adaptable content framework that encouraged consistent output and team collaboration.\", \"Produced and directed video campaigns well-received for storytelling and visual quality.\"]",
        "type": "organization",
        "sort_order": 4
      },
      {
        "id": "exp5",
        "role": "Informatics Engineering (BAS)",
        "company": "Politeknik Negeri Malang",
        "location": "Malang, Indonesia",
        "period": "August 2023 \u2014 2027",
        "description": "[\"Focusing on Applied Informatics with a cumulative GPA of 3.7/4.0.\", \"Engaging in various software development projects and research workshops.\"]",
        "type": "education",
        "sort_order": 5
      }
    ],
    socials: [
      {
        "id": 1,
        "url": "https://github.com/khalidfinny",
        "sort_order": 0
      },
      {
        "id": 2,
        "url": "https://linkedin.com/in/khalidatthoriq",
        "sort_order": 1
      },
      {
        "id": 3,
        "url": "https://instagram.com/finnn.designs",
        "sort_order": 2
      },
      {
        "id": 4,
        "url": "https://instagram.com/ffiinn.yy",
        "sort_order": 3
      },
      {
        "id": 5,
        "url": "https://instagram.com/finny.picss",
        "sort_order": 4
      }
    ],
    techs: [
      {
        "id": 1,
        "name": "React",
        "category": "programming",
        "sort_order": 0
      },
      {
        "id": 2,
        "name": "JavaScript",
        "category": "programming",
        "sort_order": 1
      },
      {
        "id": 3,
        "name": "TypeScript",
        "category": "programming",
        "sort_order": 2
      },
      {
        "id": 4,
        "name": "Next.js",
        "category": "programming",
        "sort_order": 3
      },
      {
        "id": 5,
        "name": "Tailwind CSS",
        "category": "programming",
        "sort_order": 4
      },
      {
        "id": 6,
        "name": "Angular",
        "category": "programming",
        "sort_order": 5
      },
      {
        "id": 7,
        "name": "Python",
        "category": "programming",
        "sort_order": 6
      },
      {
        "id": 8,
        "name": "Astro",
        "category": "programming",
        "sort_order": 7
      },
      {
        "id": 9,
        "name": "Laravel",
        "category": "programming",
        "sort_order": 8
      },
      {
        "id": 10,
        "name": "PostgreSQL",
        "category": "programming",
        "sort_order": 9
      },
      {
        "id": 11,
        "name": "Figma",
        "category": "design",
        "sort_order": 0
      },
      {
        "id": 12,
        "name": "Photoshop",
        "category": "design",
        "sort_order": 1
      },
      {
        "id": 13,
        "name": "After Effects",
        "category": "video",
        "sort_order": 0
      },
      {
        "id": 14,
        "name": "Premiere Pro",
        "category": "video",
        "sort_order": 1
      },
      {
        "id": 15,
        "name": "Capcut",
        "category": "video",
        "sort_order": 2
      },
      {
        "id": 16,
        "name": "Vite",
        "category": "programming",
        "sort_order": 10
      },
      {
        "id": 17,
        "name": "TanStack",
        "category": "programming",
        "sort_order": 11
      },
      {
        "id": 18,
        "name": "Django",
        "category": "programming",
        "sort_order": 12
      },
      {
        "id": 19,
        "name": "MySQL",
        "category": "programming",
        "sort_order": 13
      },
      {
        "id": 20,
        "name": "YOLOv8",
        "category": "programming",
        "sort_order": 14
      },
      {
        "id": 21,
        "name": "OpenCV",
        "category": "programming",
        "sort_order": 15
      }
    ],
  }
}
