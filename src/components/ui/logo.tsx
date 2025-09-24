'use client';

import { Image } from '@/lib/router-context';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export interface LogoProps {
  /**
   * Theme type that determines which logo to display
   * @default 'auto'
   */
  theme?: 'gambit' | 'albert-heijn' | 'adusa' | 'delhaize' | 'auto';
  /**
   * Color variant for the logo
   * @default 'auto' - uses theme-appropriate colors
   */
  variant?: 'auto' | 'white' | 'blue' | 'original';
  /**
   * Alt text for the logo
   */
  alt?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Click handler for the logo
   */
  onClick?: () => void;
}

/**
 * Logo component that displays either Gambit or Albert Heijn logo based on theme.
 * 
 * The logo automatically switches based on:
 * - Explicit theme prop
 * - CSS custom properties (--brand-theme)
 * - Auto-detection from document theme attributes
 */
export const Logo = ({
  theme = 'auto',
  variant = 'auto',
  alt,
  className,
  onClick,
}: LogoProps) => {
  const [resolvedTheme, setResolvedTheme] = useState<'gambit' | 'albert-heijn' | 'adusa' | 'delhaize'>('gambit');

  useEffect(() => {
    if (theme !== 'auto') {
      setResolvedTheme(theme);
      return;
    }

    // Auto-detect theme from CSS variables or document attributes
    const detectTheme = () => {
      // Check CSS custom property
      const brandTheme = getComputedStyle(document.documentElement)
        .getPropertyValue('--brand-theme')
        .trim();

      if (brandTheme === 'albert-heijn' || brandTheme === 'ah') {
        return 'albert-heijn';
      }
      
      if (brandTheme === 'adusa') {
        return 'adusa';
      }

      if (brandTheme === 'delhaize') {
        return 'delhaize';
      }

      // Check if Albert Heijn CSS variables are present (indicating AH theme is active)
      const brandAppBgHex = getComputedStyle(document.documentElement)
        .getPropertyValue('--brand-app-bg-hex')
        .trim();

      if (brandAppBgHex === '#00ADE6') {
        return 'albert-heijn';
      }
      
      if (brandAppBgHex === '#00644C') {
        return 'adusa';
      }

      if (brandAppBgHex === '#CE1230') {
        return 'delhaize';
      }

      // Check data attributes on html or body
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      const bodyTheme = document.body.getAttribute('data-theme');
      
      if (htmlTheme === 'albert-heijn' || htmlTheme === 'ah' || htmlTheme === 'albertHeijn' ||
          bodyTheme === 'albert-heijn' || bodyTheme === 'ah' || bodyTheme === 'albertHeijn') {
        return 'albert-heijn';
      }
      
      if (htmlTheme === 'adusa' || bodyTheme === 'adusa') {
        return 'adusa';
      }

      if (htmlTheme === 'delhaize' || bodyTheme === 'delhaize') {
        return 'delhaize';
      }

      // Check class names - including the actual theme-ah class used in the app
      const hasAHClass = document.documentElement.classList.contains('albert-heijn') ||
                        document.documentElement.classList.contains('ah-theme') ||
                        document.documentElement.classList.contains('theme-ah') ||
                        document.body.classList.contains('albert-heijn') ||
                        document.body.classList.contains('ah-theme') ||
                        document.body.classList.contains('theme-ah') ||
                        // Check for the direct body className pattern used by ThemeProvider
                        document.body.className.includes('theme-ah');

      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Logo theme detection:', {
          brandTheme,
          brandAppBgHex,
          htmlTheme,
          bodyTheme,
          bodyClassName: document.body.className,
          hasAHClass,
          resolvedTheme: hasAHClass ? 'albert-heijn' : 'gambit'
        });
      }

      // Check for ADUSA classes
      const hasADUSAClass = document.documentElement.classList.contains('adusa') ||
                           document.body.classList.contains('adusa');

      // Check for Delhaize classes
      const hasDelhaizeClass = document.documentElement.classList.contains('delhaize') ||
                              document.body.classList.contains('delhaize');

      if (hasDelhaizeClass) return 'delhaize';
      if (hasADUSAClass) return 'adusa';
      return hasAHClass ? 'albert-heijn' : 'gambit';
    };

    setResolvedTheme(detectTheme());

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setResolvedTheme(detectTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, [theme]);

  const logoConfig = {
    gambit: {
      src: '/gambit-logo.svg',
      alt: alt || 'Gambit Logo',
    },
    'albert-heijn': {
      src: '/ah-logo.svg',
      alt: alt || 'Albert Heijn Logo',
    },
    'adusa': {
      src: '/adusa-logo.svg',
      alt: alt || 'ADUSA Logo',
    },
    'delhaize': {
      src: '/delhaize-logo.svg',
      alt: alt || 'Delhaize Logo',
    },
  };

  const config = logoConfig[resolvedTheme];

  // Determine color filter based on variant and theme
  const getColorFilter = (currentTheme: 'gambit' | 'albert-heijn' | 'adusa' | 'delhaize', currentVariant: string) => {
    if (currentVariant === 'original') return '';
    if (currentVariant === 'white') return 'filter brightness-0 invert';
    if (currentVariant === 'blue') return 'filter brightness-0 saturate-200 sepia-100 hue-rotate-180 brightness-150';
    
    // Auto variant - use theme-appropriate colors
    if (currentVariant === 'auto') {
      if (currentTheme === 'albert-heijn' || currentTheme === 'adusa' || currentTheme === 'delhaize') {
        return 'filter brightness-0 invert'; // White for AH, ADUSA, and Delhaize themes by default
      }
    }
    
    return ''; // Original colors for Gambit theme
  };

  // State for client-side color filter to avoid hydration mismatch
  const [colorFilter, setColorFilter] = useState('');

  useEffect(() => {
    setColorFilter(getColorFilter(resolvedTheme, variant));
  }, [variant, resolvedTheme]);

  return (
    <div
      className={cn(
        'flex items-center justify-center', 
        // Only apply default size if no custom className with size is provided
        !className?.includes('w-') && !className?.includes('h-') && 'w-10 h-10',
        colorFilter,
        className
      )}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        // Use inline style for blue variant to get exact AH blue color
        ...(variant === 'blue' && {
          filter: 'brightness(0) saturate(100%) invert(54%) sepia(93%) saturate(1745%) hue-rotate(179deg) brightness(95%) contrast(101%)'
        })
      }}
    >
      <Image
        src={config.src}
        alt={config.alt}
        width={40}
        height={40}
        className="object-contain w-full h-full"
        priority
      />
    </div>
  );
};