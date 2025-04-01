import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import React, { useRef, useEffect, useLayoutEffect, useState, Children, cloneElement, } from "react";
const FULL_PAGE_TIME = 1000;
const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent))
        return "mobile";
    if (/ipad|tablet|android(?!.*mobile)/i.test(userAgent) || navigator.maxTouchPoints > 1)
        return "tablet";
    return "desktop";
};
export function FullPageWrapper({ children, onScrollDirectionChange }) {
    const sectionRefs = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isScrollingRef = useRef(false);
    const timeoutRef = useRef(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const lastScrollTop = useRef(0);
    const checkEnableCondition = () => {
        const userAgent = navigator.userAgent;
        const deviceType = getDeviceType(userAgent);
        const isWideScreen = window.innerWidth >= 1024;
        return deviceType === "desktop" && isWideScreen;
    };
    useEffect(() => {
        setIsEnabled(checkEnableCondition());
        const handleResize = () => {
            setIsEnabled(checkEnableCondition());
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const scrollToSmoothly = (target, duration = FULL_PAGE_TIME) => {
        const start = window.scrollY;
        const change = target - start;
        const startTime = performance.now();
        const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutSine(progress);
            window.scrollTo(0, Math.round(start + change * eased));
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        requestAnimationFrame(animateScroll);
    };
    const scrollToSection = (index) => {
        const section = sectionRefs.current[index];
        if (section) {
            const top = section.getBoundingClientRect().top + window.scrollY;
            scrollToSmoothly(top, FULL_PAGE_TIME);
        }
    };
    const enableScroll = () => {
        isScrollingRef.current = false;
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
    };
    const disableScroll = () => {
        isScrollingRef.current = true;
        timeoutRef.current = setTimeout(() => {
            enableScroll();
        }, FULL_PAGE_TIME + 500);
    };
    const handleWheel = (e, index) => {
        const section = sectionRefs.current[index];
        if (!section || isScrollingRef.current)
            return;
        const deltaY = e.deltaY;
        const isAtTop = section.scrollTop === 0;
        const isAtBottom = Math.ceil(section.scrollTop + section.clientHeight) >= section.scrollHeight;
        if (deltaY > 0 && isAtBottom && index < sectionRefs.current.length - 1) {
            e.preventDefault();
            disableScroll();
            setCurrentIndex((prev) => prev + 1);
        }
        else if (deltaY < 0 && isAtTop && index > 0) {
            e.preventDefault();
            disableScroll();
            setCurrentIndex((prev) => prev - 1);
        }
    };
    const handleInnerScroll = (e) => {
        const target = e.target;
        const scrollTop = target.scrollTop;
        if (onScrollDirectionChange) {
            if (scrollTop > lastScrollTop.current) {
                onScrollDirectionChange("down");
            }
            else {
                onScrollDirectionChange("up");
            }
        }
        lastScrollTop.current = scrollTop;
    };
    useEffect(() => {
        if (!isEnabled)
            return;
        scrollToSection(currentIndex);
    }, [currentIndex, isEnabled]);
    useLayoutEffect(() => {
        if (!isEnabled)
            return;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [isEnabled]);
    useEffect(() => {
        if (!isEnabled)
            return;
        const handlers = [];
        sectionRefs.current.forEach((section, i) => {
            const handler = (e) => handleWheel(e, i);
            handlers.push(handler);
            section === null || section === void 0 ? void 0 : section.addEventListener("wheel", handler, { passive: false });
            section === null || section === void 0 ? void 0 : section.addEventListener("scroll", handleInnerScroll, { passive: true });
        });
        return () => {
            sectionRefs.current.forEach((section, i) => {
                section === null || section === void 0 ? void 0 : section.removeEventListener("wheel", handlers[i]);
                section === null || section === void 0 ? void 0 : section.removeEventListener("scroll", handleInnerScroll);
            });
        };
    }, [children, isEnabled]);
    const childrenWithRefs = Children.map(children, (child, index) => {
        if (!React.isValidElement(child))
            return child;
        return cloneElement(child, {
            ref: (el) => {
                sectionRefs.current[index] = el;
            },
        });
    });
    return _jsx(_Fragment, { children: childrenWithRefs });
}
;
