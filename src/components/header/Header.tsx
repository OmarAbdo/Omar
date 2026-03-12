import React, { Fragment, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { articleCategories } from "./Header.data";
import Toggle from "../common/toggle/toggle";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../i18n.ts";
import { Link, useNavigate, useLocation } from "react-router-dom";

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const languages = [
  { code: "en", flag: "https://flagicons.lipis.dev/flags/4x3/us.svg", key: "english" },
  { code: "de", flag: "https://flagicons.lipis.dev/flags/4x3/de.svg", key: "german" },
  { code: "ar", flag: "https://flagicons.lipis.dev/flags/4x3/eg.svg", key: "arabic" },
  { code: "it", flag: "https://flagicons.lipis.dev/flags/4x3/it.svg", key: "italian" },
  { code: "pl", flag: "https://flagicons.lipis.dev/flags/4x3/pl.svg", key: "polish" },
  { code: "pt", flag: "https://flagicons.lipis.dev/flags/4x3/pt.svg", key: "portuguese" },
  { code: "es", flag: "https://flagicons.lipis.dev/flags/4x3/es.svg", key: "spanish" },
];

const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/10 dark:border-white/5 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md print:hidden">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label={t("header.globalNavigation")}
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <span className="text-xl font-black text-gold tracking-tight">OA</span>
            <span className="hidden sm:block text-sm font-medium text-text-muted">Omar Abdo</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-text-muted hover:text-gold transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">{t("header.openMenu")}</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop nav */}
        <Popover.Group className="hidden lg:flex lg:gap-x-8 items-center">
          <button onClick={() => scrollToSection("projects")} className="text-sm font-medium text-text-muted hover:text-gold dark:hover:text-gold transition-colors">
            {t("header.nav.projects")}
          </button>
          <button onClick={() => scrollToSection("services")} className="text-sm font-medium text-text-muted hover:text-gold dark:hover:text-gold transition-colors">
            {t("header.nav.services")}
          </button>
          <button onClick={() => scrollToSection("about")} className="text-sm font-medium text-text-muted hover:text-gold dark:hover:text-gold transition-colors">
            {t("header.nav.about")}
          </button>
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-medium text-text-muted hover:text-gold dark:hover:text-gold transition-colors outline-none">
              {t("header.nav.articles")}
              <ChevronDownIcon className="h-4 w-4 flex-none" aria-hidden="true" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl bg-white dark:bg-[#22252F] shadow-2xl ring-1 ring-gray-200 dark:ring-white/10">
                <div className="p-3">
                  <Link
                    to="/articles"
                    className="group flex items-center gap-x-3 rounded-xl px-3 py-2 text-sm font-semibold text-gold hover:bg-gray-100 dark:hover:bg-white/8 transition-colors border-b border-gray-200 dark:border-white/10 mb-1"
                  >
                    {t("header.nav.allArticles")}
                  </Link>
                  {articleCategories.map((item) => (
                    <Link
                      key={item.key}
                      to={`/articles?category=${item.key}`}
                      className="group flex items-center gap-x-4 rounded-xl p-3 text-sm hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
                    >
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10">
                        <item.icon className="h-5 w-5 text-text-muted group-hover:text-gold transition-colors" aria-hidden="true" />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-text-primary group-hover:text-gold dark:group-hover:text-gold transition-colors">
                        {t(`header.articleCategories.${item.key}.name`)}
                      </span>
                    </Link>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <Link
            to="/cv"
            className="text-sm font-medium px-4 py-1.5 rounded-full border border-gray-300 dark:border-white/10 text-text-muted hover:border-gold hover:text-gold transition-colors"
          >
            {t("header.nav.cv")}
          </Link>
        </Popover.Group>

        {/* Right controls */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-3">
          <Toggle />
          <div className="flex items-center gap-1 pl-3 border-l border-gray-200 dark:border-white/10">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                aria-label={t(`header.language.${lang.key}.ariaLabel`)}
                className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
              >
                <img
                  src={lang.flag}
                  alt={t(`header.language.${lang.key}.alt`)}
                  className="h-4 w-5 object-cover rounded-sm flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-[#22252F] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xl font-black text-gold">OA</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-text-muted hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">{t("header.closeMenu")}</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="-my-6 divide-y divide-gray-200/10 dark:divide-white/10">
              <div className="space-y-1 py-6">
                {[
                  { label: t("header.nav.projects"), section: "projects" },
                  { label: t("header.nav.services"), section: "services" },
                  { label: t("header.nav.about"), section: "about" },
                ].map((link) => (
                  <button
                    key={link.section}
                    onClick={() => { scrollToSection(link.section); setMobileMenuOpen(false); }}
                    className="block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold text-gray-800 dark:text-text-primary hover:text-gold dark:hover:text-gold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-semibold text-gray-800 dark:text-text-primary hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        {t("header.nav.articles")}
                        <ChevronDownIcon className={classNames(open ? "rotate-180" : "", "h-5 w-5 flex-none text-text-muted transition-transform")} aria-hidden="true" />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-1 space-y-1 pl-4">
                        <Disclosure.Button
                          as={Link}
                          to="/articles"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm font-semibold text-gold"
                        >
                          {t("header.nav.allArticles")}
                        </Disclosure.Button>
                        {articleCategories.map((item) => (
                          <Disclosure.Button
                            key={item.key}
                            as={Link}
                            to={`/articles?category=${item.key}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:text-gold transition-colors"
                          >
                            {t(`header.articleCategories.${item.key}.name`)}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Link
                  to="/cv"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-800 dark:text-text-primary hover:text-gold dark:hover:text-gold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  {t("header.nav.cv")}
                </Link>
              </div>
              <div className="py-6 flex items-center justify-between">
                <Toggle />
                <div className="flex items-center gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      aria-label={t(`header.language.${lang.key}.ariaLabel`)}
                      className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <img
                        src={lang.flag}
                        alt={t(`header.language.${lang.key}.alt`)}
                        className="h-4 w-5 object-cover rounded-sm flex-shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
