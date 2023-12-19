import Image from "../common/image/Image";

const Hero: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-10">
          {/* First column */}
          <div className="px-6 lg:col-span-7 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="mx-auto">
                <h1 className="mt-10 text-4xl font-thin tracking-tight text-gray-900 sm:text-6xl">
                  Build the web platform you have always dreamed about.
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  If you're looking for the right mix between technology and
                  business vision, Then you've reached the right place.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Start building
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Second column */}
          <div className="px-6 lg:col-span-5 lg:px-0 lg:pt-4">
            <Image src="./images/Hero image.png" alt="Software services" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
    </div>
  );
};

export default Hero;
