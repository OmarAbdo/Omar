import React from "react";
import { useTranslation } from "react-i18next";
import { socialLinks } from "./Footer.data";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-light-surface dark:bg-dark-surface border-t border-gray-200/10 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="text-xl font-black text-gold">OA</span>
            <span className="text-sm text-gray-400 dark:text-text-muted">
              {t("footer.tagline")}
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-text-muted hover:text-gold dark:hover:text-gold transition-colors duration-200"
                aria-label={item.name}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-text-muted border-t border-gray-200/10 dark:border-white/5 pt-8">
          &copy; {new Date().getFullYear()} {t("footer.credits")}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
