import React, { Fragment, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { articleCategories } from "./Header.data";
import Toggle from "../common/toggle/toggle";

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    console.log("This toggle will activate dark mode in the future");
  };


  return (
    <header className="bg-white ">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Omar Abdo | Software Development</span>
            <img className="h-8 w-auto" src="./images/logo.svg" alt="" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <a
            href="https://drive.google.com/file/d/1vOzUCXSASKsKUDm_pvwlJuCbl91iKl3h/view?usp=drive_link"
            className="text-sm font-semibold leading-6 text-gray-900"
            target="_blank"
          >
            Portfolio
          </a>
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
              Articles
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
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
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {articleCategories.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 "
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 ">
                        <item.icon
                          className="h-6 w-6 text-gray-600 group-hover:text-red-700"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900"
                          target="_blank"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          <a
            href="https://www.linkedin.com/in/omar-abdo/"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Contact
          </a>
        </Popover.Group>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Toggle onClick={handleToggle} toggled={isToggled} />
          <a
            href="#"
            className="flex pl-3 items-center text-gray-500 hover:text-gray-600"
          >
            <img
              src="https://flagicons.lipis.dev/flags/4x3/gb.svg"
              alt=""
              className="h-auto w-5 flex-shrink-0"
            />
          </a>
          <a
            href="#"
            className="flex pl-3 items-center text-gray-500 hover:text-gray-600"
          >
            <img
              src="https://flagicons.lipis.dev/flags/4x3/de.svg"
              alt=""
              className="h-auto w-5 flex-shrink-0"
            />
          </a>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Omar Abdo | Software Development</span>
              <img className="h-8 w-auto" src="./images/logo.svg" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="https://drive.google.com/file/d/1vOzUCXSASKsKUDm_pvwlJuCbl91iKl3h/view?usp=drive_link"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
                  target="_blank"
                >
                  Portfolio
                </a>
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 ">
                        Articles
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-5 w-5 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...articleCategories].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            target="_blank"
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 "
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <a
                  href="https://www.linkedin.com/in/omar-abdo/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 "
                >
                  Contact
                </a>
              </div>
              <div className="py-6">
                <Toggle onClick={handleToggle} toggled={isToggled} />
              </div>
              <div className="py-6 flex justify-between">
                <a
                  href="#"
                  className="flex  items-center text-gray-500 hover:text-gray-600"
                >
                  <img
                    src="https://flagicons.lipis.dev/flags/4x3/gb.svg"
                    alt=""
                    className="h-auto w-5 flex-shrink-0"
                  />
                </a>
                <a
                  href="#"
                  className="flex items-center text-gray-500 hover:text-gray-600"
                >
                  <img
                    src="https://flagicons.lipis.dev/flags/4x3/de.svg"
                    alt=""
                    className="h-auto w-5 flex-shrink-0"
                  />
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
