import React, { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { marked } from "marked";
import { useTranslation } from "react-i18next";
import { getArticleBySlug } from "../../utils/markdown";
import { fadeUpVariant } from "../../utils/animations";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const categoryColors: Record<string, string> = {
  frontend: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  backend: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  computerScience: "text-violet-500 bg-violet-500/10 border-violet-500/20",
  devOps: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  otherTopics: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  const article = useMemo(() => (slug ? getArticleBySlug(slug) : null), [slug]);

  const htmlContent = useMemo(() => {
    if (!article) return "";
    return marked(article.content) as string;
  }, [article]);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  return (
    <section className="min-h-screen py-24 sm:py-32 bg-light-bg dark:bg-dark-bg">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Back link */}
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors mb-10"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            All Articles
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  categoryColors[article.category] ?? categoryColors.otherTopics
                }`}
              >
                {t(`header.articleCategories.${article.category}.name`, {
                  defaultValue: article.category,
                })}
              </span>
              <span className="text-xs text-gray-400 dark:text-text-muted">{article.readTime}</span>
              <time className="text-xs text-gray-400 dark:text-text-muted">
                {new Date(article.date).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-text-primary leading-tight">
              {article.title}
            </h1>
            <p className="mt-4 text-base text-gray-500 dark:text-text-muted leading-relaxed">
              {article.description}
            </p>

            {article.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
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

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-white/5 mb-10" />

          {/* Article body */}
          <div
            className="prose prose-gray dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:tracking-tight
              prose-h2:text-2xl prose-h3:text-lg
              prose-a:text-gold prose-a:no-underline hover:prose-a:underline
              prose-code:text-gold prose-code:bg-gray-100 prose-code:dark:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
              prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
              prose-blockquote:border-l-gold prose-blockquote:text-text-muted
              prose-strong:text-gray-900 dark:prose-strong:text-text-primary"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-text-primary">Omar Abdo</p>
              <p className="text-xs text-text-muted">Senior Software Developer · Berlin</p>
            </div>
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              More articles
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlePage;
