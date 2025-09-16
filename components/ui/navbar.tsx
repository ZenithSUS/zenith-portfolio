"use client";

import { FaFire } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface NavigationItem {
  name: string;
  href: string;
  id: string;
}

interface SectionData {
  id: string;
  element: HTMLElement;
  index: number;
}

const Navigations: NavigationItem[] = [
  { name: "Home", href: "/#home", id: "home" },
  { name: "Skills", href: "/#skills", id: "skills" },
  { name: "Projects", href: "/#projects", id: "projects" },
  { name: "Testimonials", href: "/#testimonials", id: "testimonials" },
  { name: "Contact", href: "/#contact", id: "contact" },
];

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionElements = useRef<SectionData[]>([]);

  // Cache DOM section elements once
  useEffect(() => {
    sectionElements.current = Navigations.map((nav, index) => {
      const el = document.getElementById(nav.id);
      return el ? { id: nav.id, element: el, index } : null;
    }).filter(Boolean) as SectionData[];
  }, []);

  // Get dynamic navbar height
  const getNavbarHeight = (): number => {
    const navbar = document.querySelector("nav");
    return navbar ? navbar.offsetHeight : 80;
  };

  // Hide/show navbar on scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const current = window.scrollY;

      if (
        (current > lastScrollY && current > 50) ||
        (current > 0 && current < lastScrollY - 50)
      ) {
        if (show) setShow(false);
        if (menuOpen) setMenuOpen(false);
      } else {
        if (!show) setShow(true);
      }

      setLastScrollY(current);
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY, show, menuOpen]);

  // Track active section
  useEffect(() => {
    const handleScrollForActiveSection = () => {
      const navbarHeight = getNavbarHeight();
      const scrollPosition = window.scrollY + navbarHeight + 20;

      let currentIndex = 0;

      if (window.scrollY < 50) {
        if (activeIndex !== 0) setActiveIndex(0);
        return;
      }

      for (const section of sectionElements.current) {
        const sectionTop = section.element.offsetTop;
        const sectionBottom = sectionTop + section.element.offsetHeight;

        if (
          scrollPosition >= sectionTop - 50 &&
          scrollPosition < sectionBottom - 50
        ) {
          currentIndex = section.index;
          break;
        }

        if (scrollPosition >= sectionTop - 50) {
          currentIndex = section.index;
        }
      }

      if (activeIndex !== currentIndex) {
        setActiveIndex(currentIndex);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollForActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeIndex]);

  // Track mobile vs desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (index: number, href: string) => {
    if (activeIndex !== index) setActiveIndex(index);
    setMenuOpen(false);

    const targetId = href.replace("/#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navbarHeight = getNavbarHeight();
      const targetPosition = targetElement.offsetTop - navbarHeight - 10;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {!show && (
        <button onClick={() => setShow(true)}>
          <FaFire
            className="text-primary fixed top-4 right-4 z-50 cursor-pointer text-3xl drop-shadow-[0_0_10px_#00cfff]"
            size={26}
          />
        </button>
      )}
      <motion.nav
        aria-hidden={!show ? "true" : "false"}
        animate={{ y: show ? 0 : -120 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="border-accent/40 bg-foreground/40 fixed top-0 z-50 w-full border-b backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex flex-row items-center gap-2">
            <FaFire
              size={26}
              className="text-primary drop-shadow-[0_0_10px_#00cfff]"
            />
            <h1 className="text-text glow-blue text-2xl font-bold">
              Jeran.dev
            </h1>
          </div>

          {/* Desktop Links */}
          <ul className="hidden space-x-8 text-lg font-medium md:flex">
            {Navigations.map((nav, index) => (
              <li key={nav.name}>
                <a
                  href={nav.href}
                  className={`group ${
                    activeIndex === index ? "text-primary" : ""
                  } hover:text-primary relative transition-all duration-300`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(index, nav.href);
                  }}
                >
                  {nav.name}
                  <span
                    className={`from-primary to-accent absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r transition-all duration-300 ${
                      activeIndex === index
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="text-primary z-50 transition-transform hover:scale-110"
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobile && menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="bg-foreground/95 border-accent/30 fixed inset-x-0 top-[64px] z-40 border-t backdrop-blur-lg md:hidden"
            >
              <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-6">
                {Navigations.map((nav, index) => (
                  <a
                    key={nav.name}
                    href={nav.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(index, nav.href);
                    }}
                    className={`hover:text-primary relative w-full text-center text-lg font-medium transition-colors ${
                      activeIndex === index ? "text-primary" : ""
                    }`}
                  >
                    {nav.name}
                    <span
                      className={`from-primary to-accent absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 bg-gradient-to-r transition-all duration-300 ${
                        activeIndex === index
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
