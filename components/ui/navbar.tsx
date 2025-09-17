"use client";

import { FaFire } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

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

  // Refs for performance optimization
  const sectionElements = useRef<SectionData[]>([]);
  const navbarRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize navbar height calculation to avoid repeated DOM queries
  const getNavbarHeight = useCallback((): number => {
    if (navbarRef.current) {
      return navbarRef.current.offsetHeight;
    }
    return 80; // fallback
  }, []);

  // Cache DOM section elements once with error handling
  useEffect(() => {
    const elements: SectionData[] = [];

    Navigations.forEach((nav, index) => {
      const el = document.getElementById(nav.id);
      if (el) {
        elements.push({ id: nav.id, element: el, index });
      }
    });

    sectionElements.current = elements;
  }, []);

  // Optimized scroll handler with debouncing and RAF batching
  const handleScroll = useCallback(() => {
    const current = window.scrollY;
    const navbarHeight = getNavbarHeight();

    // Batch DOM reads together
    const scrollPosition = current + navbarHeight + 20;

    // Handle navbar visibility
    if (
      (current > lastScrollY && current > 50) ||
      (current > 0 && current < lastScrollY - 50)
    ) {
      if (show) setShow(false);
      if (menuOpen) setMenuOpen(false);
    } else {
      if (!show) setShow(true);
    }

    // Handle active section detection
    let currentIndex = 0;

    if (current < 50) {
      currentIndex = 0;
    } else {
      // Use cached elements and batch DOM reads
      for (const section of sectionElements.current) {
        const rect = section.element.getBoundingClientRect();
        const sectionTop = current + rect.top;
        const sectionBottom = sectionTop + rect.height;

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
    }

    // Batch state updates
    setLastScrollY(current);
    if (activeIndex !== currentIndex) {
      setActiveIndex(currentIndex);
    }
  }, [lastScrollY, show, menuOpen, activeIndex, getNavbarHeight]);

  // Throttled scroll handler with RAF
  useEffect(() => {
    let isScrolling = false;

    const onScroll = () => {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Use RAF for smooth performance
      if (!isScrolling) {
        requestAnimationFrame(() => {
          handleScroll();
          isScrolling = false;
        });
        isScrolling = true;
      }

      // Debounce final scroll event
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isScrolling) {
          requestAnimationFrame(() => {
            handleScroll();
          });
        }
      }, 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    if (!mobile) setMenuOpen(false);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(handleResize, 100);
    };

    handleResize(); // Initial call
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  // Optimized navigation click handler
  const handleNavClick = useCallback(
    (index: number, href: string) => {
      if (activeIndex !== index) setActiveIndex(index);
      setMenuOpen(false);

      const targetId = href.replace("/#", "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Batch DOM reads
        const navbarHeight = getNavbarHeight();
        const rect = targetElement.getBoundingClientRect();
        const targetPosition = window.scrollY + rect.top - navbarHeight + 60;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth",
        });
      }
    },
    [activeIndex, getNavbarHeight],
  );

  // Memoize navigation items to prevent re-renders
  const navigationItems = useMemo(
    () =>
      Navigations.map((nav, index) => (
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
                activeIndex === index ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </a>
        </li>
      )),
    [activeIndex, handleNavClick],
  );

  // Memoize mobile navigation items
  const mobileNavigationItems = useMemo(
    () =>
      Navigations.map((nav, index) => (
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
              activeIndex === index ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </a>
      )),
    [activeIndex, handleNavClick],
  );

  return (
    <>
      {!show && (
        <button
          onClick={() => setShow(true)}
          aria-label="Show navigation"
          className="fixed top-4 right-4 z-50"
        >
          <FaFire
            className="text-primary cursor-pointer text-3xl drop-shadow-[0_0_10px_#00cfff] transition-transform hover:scale-110"
            size={26}
          />
        </button>
      )}

      <motion.nav
        ref={navbarRef}
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
            {navigationItems}
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
                {mobileNavigationItems}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
