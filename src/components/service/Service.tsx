import { useTranslation } from "react-i18next";

import "./Service.css";
import { services } from "./Service.data";

const Service: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mt-10 text-4xl font-thin tracking-tight text-gray-900 sm:text-6xl">
            {t("home.services.title")}
          </h1>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {services.map((serviceItem) => (
            <article
              key={serviceItem.id}
              className="flex flex-col items-start justify-between custom-shadow"
            >
              <div className="relative w-full">
                <img
                  src={serviceItem.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full  bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
              </div>
              <div className="max-w-xl">
                <div className="group relative py-5 pl-10 pr-20">
                  <h3 className="mt-5 text-25xl font-thin leading-6 text-gray-900 group-hover:text-gray-600">
                    {t(serviceItem.title)}
                  </h3>
                  <p className="mt-5 line-clamp-4 text-sm leading-6 text-gray-600">
                    {t(serviceItem.description)}
                  </p>
                  <div className="py-5">
                    <a
                      href="#"
                      className="text-red-700 hover:text-red-900 font-bold py-10"
                    >
                      {t(serviceItem.link)}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
