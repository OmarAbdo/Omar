import "./Service.css";
const posts = [
  {
    id: 1,
    title: "Software development",
    href: "#",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In fermentum et sollicitudin ac.",
    imageUrl: "./images/service 1.png",
  },
  {
    id: 2,
    title: "Software consultancy",
    href: "#",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In fermentum et sollicitudin ac.",
    imageUrl: "./images/service 2.png",
  },
];

const Service: React.FC = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-thin tracking-tight text-gray-900 sm:text-4xl">
            What do I offer?
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between custom-shadow"
            >
              <div className="relative w-full">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full  bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0  ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="group relative py-5 pl-10 pr-20">
                  <h3 className="mt-5 text-25xl font-thin leading-6 text-gray-900 group-hover:text-gray-600">
                    {post.title}
                  </h3>
                  <p className="mt-5 line-clamp-4 text-sm leading-6 text-gray-600">
                    {post.description}
                  </p>
                  <div className="py-5">
                    <a
                      href="#"
                      className="text-red-700 hover:text-red-900 font-bold py-10"
                    >
                      Learn more
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
