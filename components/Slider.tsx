'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  image: string;
  heading: string;
  href?: string;
}

interface SliderProps {
  slides: Slide[];
}

export default function Slider({ slides }: SliderProps) {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isMobile) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [isMobile, next]);

  if (isMobile) return null;

  return (
    <div className="slider">
      <div className="slides">
        <div className="slide">
          {slides.map((slide, i) => (
            <div key={i} className={`slide-content${i === current ? ' active' : ''}`}>
              <Image
                src={slide.image}
                alt={slide.heading}
                fill
                priority={i === 0}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="100vw"
              />
              <div className="text">
                <h2>{slide.heading}</h2>
                <Link href={slide.href ?? '/products'} className="shop-btn">
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="navigation">
        <button
          className={`prev${current === 0 ? ' disabled' : ''}`}
          onClick={prev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className={`next${current === slides.length - 1 ? ' disabled' : ''}`}
          onClick={next}
          aria-label="Next slide"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
