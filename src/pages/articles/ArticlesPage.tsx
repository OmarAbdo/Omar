import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getAllArticles } from "../../utils/markdown";
import { staggerContainer, fadeUpVariant } from "../../utils/animations";
import SectionLabel from "../../components/common/SectionLabel";

const categoryColors: Record<string, string> = {
  frontend: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  backend: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  computerScience: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  devOps: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  otherTopics: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const ArticlesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  const allArticles = useMemo(() => getAllArticles(), []);

  const articles = useMemo(() => {
    if (activeCategory === "all") return allArticles;
    return allArticles.filter((a) => a.category === activeCategory);
  }, [allArticles, activeCategory]);

  const categories = [
    { key: "all", label: t("header.nav.allArticles") },
    { key: "frontend", label: t("header.articleCategories.frontend.name") },
    { key: "backend", label: t("header.articleCategories.backend.name") },
    { key: "computerScience", label: t("header.articleCategories.computerScience.name") },
    { key: "devOps", label: t("header.articleCategories.devOps.name") },
    { key: "otherTopics", label: t("header.articleCategories.otherTopics.name") },
  ];

  return (
    <section className="min-h-screen py-24 sm:py-32 bg-light-bg dark:bg-dark-bg">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariant} className="mb-12">
            <SectionLabel>Writing</SectionLabel>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-text-primary">
              Articles & Notes.
            </h1>
            <p className="mt-4 text-base text-gray-500 dark:text-text-muted max-w-2xl">
              Things I've built, learned, and thought hard about — in AI systems, backend architecture, and software engineering at scale.
            </p>
          </motion.div>

          {/* Category filters */}
          <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() =>
                  cat.key === "all"
                    ? setSearchParams({})
                    : setSearchParams({ category: cat.key })
                }
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  activeCategory === cat.key
                    ? "bg-gold text-dark-bg border-gold"
                    : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-text-muted hover:border-gold hover:text-gold dark:hover:text-gold"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Article list */}
          {articles.length === 0 ? (
            <motion.p variants={fadeUpVariant} className="text-text-muted text-sm py-12 text-center">
              No articles in this category yet. Check back soon.
            </motion.p>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <motion.article key={article.slug} variants={fadeUpVariant}>
                  <Link
                    to={`/articles/${article.slug}`}
                    className="group block rounded-2xl border border-gray-200 dark:border-white/5 bg-light-surface dark:bg-dark-surface p-6 hover:border-gold/30 dark:hover:border-gold/30 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                              categoryColors[article.category] ?? categoryColors.otherTopics
                            }`}
                          >
                            {t(`header.articleCategories.${article.category}.name`, {
                              defaultValue: article.category,
                            })}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-text-muted">
                            {article.readTime}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-text-primary group-hover:text-gold dark:group-hover:text-gold transition-colors leading-snug">
                          {article.title}
                        </h2>
                        <p className="mt-1.5 text-sm text-gray-500 dark:text-text-muted line-clamp-2">
                          {article.description}
                        </p>
                        {article.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {article.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-text-muted border border-gray-200 dark:border-white/5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <time className="text-xs text-gray-400 dark:text-text-muted whitespace-nowrap shrink-0">
                        {new Date(article.date).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlesPage;
