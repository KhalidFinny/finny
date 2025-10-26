export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  youtubeEmbed?: string;
  instagramLink?: string;
  googleDriveLink?: string;
}

export interface PortfolioCategory {
  title: string;
  items: PortfolioItem[];
  seeMoreLink: string;
}

export const portfolioCategories: PortfolioCategory[] = [
  {
    title: "Programming",
    items: [
      { 
        id: "prog1", 
        title: "Laskaraya", 
        image: "/pics/laskaraya1.webp", 
        category: "programming",
        description: "Web platform for students to track achievements, register for competitions, and connect with faculty advisors."
      },
      { 
        id: "prog2", 
        title: "SIREPANG", 
        image: "/pics/Sirepang.webp", 
        category: "programming",
        description: "Web platform for Malang Regency Food Security Agency to monitor and manage local food conditions and security data."
      },
      { 
        id: "prog3", 
        title: "Machine Learning and Computer Vision Based Self photo", 
        image: "/portofolio/self.webp", 
        category: "programming",
        description: "Machine Learning and Computer Vision Based Self photo using fist recognition as the shutter trigger, made with python, opencv, and YoloV8."
      }
    ],
    seeMoreLink: "https://drive.google.com/drive/folders/1GKB7l--fYM1Pk6oBs9qdE7w8sXbMIDRM?usp=sharing"
  },
  {
    title: "Videography",
    items: [
      { 
        id: "vid1", 
        title: "WRI in a nutshell", 
        image: "/portofolio/wriinanutshell.webp", 
        category: "videography",
        description: "Overview video showcasing WRI organization activities and achievements.",
        youtubeEmbed: "https://www.youtube.com/embed/fH4F6tah8PY?si=Uv_ckR8tj0VvITXb",
        instagramLink: "https://instagram.com/yourvideography",
        googleDriveLink: "https://drive.google.com/drive/folders/videography1"
      },
      { 
        id: "vid2", 
        title: "Maba Arc part 1", 
        image: "/portofolio/touraday.webp", 
        category: "videography",
        description: "Freshman orientation video capturing new student journey and experiences.",
        youtubeEmbed: "https://www.youtube.com/embed/a-H6iiEsaqg?si=Bx9O8S9rgmccsWjL",
        instagramLink: "https://instagram.com/yourvideography",
        googleDriveLink: "https://drive.google.com/drive/folders/videography2"
      },
      { 
        id: "vid3",
        title: "Makrab WRI 2025",
        image: "/portofolio/makrab.webp",
        category: "videography",
        description: "Event documentation video capturing student organization activities and celebrations.",
        youtubeEmbed: "https://www.youtube.com/embed/wF6YHu1eA-Y?si=qYJ4dflpsxy6o7Q4",
        instagramLink: "https://instagram.com/yourvideography",
        googleDriveLink: "https://drive.google.com/drive/folders/videography3"
      }
    ],
    seeMoreLink: "https://drive.google.com/drive/folders/1nJ36224aH9--g42N2PEbcAlc2ipyWLwo?usp=sharing"
  },
  {
    title: "Photography",
    items: [
      { 
        id: "photo1", 
        title: "Sports and Photography", 
        image: "/portofolio/bball.webp", 
        category: "photography",
        description: "captures using the sony A6300, this picture captured the sense of speed on playing basketball."
      },
      { 
        id: "photo2", 
        title: "Pink Flowers", 
        image: "/portofolio/flower.webp", 
        category: "photography",
        description: "captured using the Xiaomi 14T, this picture captured the beauty of a girl holding pink flowers."
      },
      { 
        id: "photo3", 
        title: "Horse", 
        image: "/portofolio/horse.webp", 
        category: "photography",
        description: "captured using the sony a6300, this picture captured a horse head person on top of a trunk of a 1994 Toyota Great Corolla."
      }
    ],
    seeMoreLink: "https://instagram.com/finny.picss"
  },
  {
    title: "UI/UX Design",
    items: [
      { 
        id: "ui1", 
        title: "Novella", 
        image: "/portofolio/novella.webp", 
        category: "ui-ux",
        description: "A novel library design with a focus on timeless, old money, and clean aesthetics."
      },
      { 
        id: "ui2", 
        title: "ISFOR", 
        image: "/portofolio/Isfor.webp", 
        category: "ui-ux",
        description: "A design for a researchers website, with the institution color palette and a clean modern design."
      },
      { 
        id: "ui3", 
        title: "Whether", 
        image: "/portofolio/Wheter.webp", 
        category: "ui-ux",
        description: "A weather app UI with a modern and unique design and clear data visualization."
      }
    ],
    seeMoreLink: "https://drive.google.com/file/d/1chC-iyWf599BFjHn7WU3EnQocImydr4s/view?usp=sharing"
  }
];
