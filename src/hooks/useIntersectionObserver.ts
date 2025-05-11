import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const currentElement = useRef<Element | null>(null);

  const handleObserve = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const isCurrentlyVisible = entry.isIntersecting;

    if (freezeOnceVisible && hasBeenVisible) {
      return;
    }

    setIsVisible(isCurrentlyVisible);

    if (isCurrentlyVisible) {
      setHasBeenVisible(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserve, {
      threshold,
      root,
      rootMargin,
    });

    if (currentElement.current) {
      observer.observe(currentElement.current);
    }

    return () => {
      if (currentElement.current) {
        observer.unobserve(currentElement.current);
      }
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [currentElement, isVisible, hasBeenVisible] as const;
};