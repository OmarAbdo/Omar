import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";

export const navigation = {
  projects: [
    { name: "Luqman", href: "https://github.com/OmarAbdo/Luqman" },
    { name: "Rita", href: "#" },
    { name: "Omar", href: "#" },
    { name: "More Projects", href: "#" }, // Translation handled in `en.json`
  ],
  ds_articles: [
    { name: "AI", href: "https://medium.com/@omareabdo/lists" },
    { name: "Machine Learning", href: "https://medium.com/@omareabdo/lists" },
    { name: "Data Science", href: "https://medium.com/@omareabdo/lists" }, // Translation handled in `en.json`
  ],
  web_articles: [
    { name: "Frontend", href: "https://medium.com/@omareabdo/lists" },
    { name: "Backend", href: "https://medium.com/@omareabdo/lists" },
    { name: "DevOps", href: "https://medium.com/@omareabdo/lists" },
    { name: "Computer Science", href: "https://medium.com/@omareabdo/lists" }, // Translation handled in `en.json`
    { name: "Other topics", href: "https://medium.com/@omareabdo/lists" }, // Translation handled in `en.json`
  ],
  more_pages: [
    {
      name: "About", // Translation handled in `en.json`
      href: "https://drive.google.com/file/d/1vOzUCXSASKsKUDm_pvwlJuCbl91iKl3h/view",
    },
    {
      name: "Get in touch", // Translation handled in `en.json`
      href: "https://www.linkedin.com/in/omar-abdo/",
    },
  ],
  social: [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/omar-abdo/",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/OmarAbdo",
      icon: (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};
