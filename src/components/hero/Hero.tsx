import Image from "../common/image/Image";
import { useTranslation } from "react-i18next";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-20">
          {/* First column */}
          <div className="px-6 lg:col-span-7 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="mx-auto">
                <h1 className="mt-10 text-4xl font-thin tracking-tight text-gray-900 sm:text-6xl">
                  {t("home.hero.title")}
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {t("home.hero.subTitle")}
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-full bg-red-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  >
                    {t("home.hero.button")}
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Second column */}
          <div className="p-6 lg:col-span-5 lg:px-0 lg:pt-4">
            <Image
              imageSrc="./images/Hero image.png"
              imageAlt="Software services"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
