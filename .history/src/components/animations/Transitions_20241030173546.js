
import React from 'react';
import { theme } from '../../styles/theme';

// Fade transition component
export const Fade = ({ 
  children, 
  show = true, 
  duration = 'normal',
  className = '' 
}) => {
  const durations = {
    fast: theme.animation.timing.fast,
    normal: theme.animation.timing.normal,
    slow: theme.animation.timing.slow
  };

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: show ? 1 : 0,
        transitionDuration: durations[duration],
        visibility: show ? 'visible' : 'hidden'
      }}
    >
      {children}
    </div>
  );
};

// Slide transition component
export const Slide = ({
  children,
  show = true,
  direction = 'right',
  duration = 'normal',
  className = ''
}) => {
  const directions = {
    right: { enter: 'translate-x-0', leave: 'translate-x-full' },
    left: { enter: 'translate-x-0', leave: '-translate-x-full' },
    up: { enter: 'translate-y-0', leave: '-translate-y-full' },
    down: { enter: 'translate-y-0', leave: 'translate-y-full' }
  };

  const durations = {
    fast: theme.animation.timing.fast,
    normal: theme.animation.timing.normal,
    slow: theme.animation.timing.slow
  };

  return (
    <div
      className={`transform transition-transform ${className}`}
      style={{
        transform: show ? 'none' : `translateX(${directions[direction].leave})`,
        transitionDuration: durations[duration],
        visibility: show ? 'visible' : 'hidden'
      }}
    >
      {children}
    </div>
  );
};

// Scale transition component
export const Scale = ({
  children,
  show = true,
  duration = 'normal',
  className = ''
}) => {
  const durations = {
    fast: theme.animation.timing.fast,
    normal: theme.animation.timing.normal,
    slow: theme.animation.timing.slow
  };

  return (
    <div
      className={`transform transition-transform ${className}`}
      style={{
        transform: show ? 'scale(1)' : 'scale(0)',
        transitionDuration: durations[duration],
        visibility: show ? 'visible' : 'hidden'
      }}
    >
      {children}
    </div>
  );
};

// Animated list component
export const AnimatedList = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Loading animation component
export const LoadingAnimation = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    primary: theme.colors.primary[500],
    secondary: theme.colors.neutral[500],
    white: '#ffffff'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-pulse rounded-full ${sizes[size]}`}
        style={{ backgroundColor: colors[color] }}
      />
    </div>
  );
};

// Animated number component
export const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    const startValue = displayValue;
    const endValue = value;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setDisplayValue(
          Math.round(startValue + (endValue - startValue) * progress)
        );
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

// Tooltip animation component
export const AnimatedTooltip = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                      opacity-0 group-hover:opacity-100
                      translate-y-2 group-hover:translate-y-0
                      transition-all duration-200 ease-out
                      bg-neutral-800 text-white text-sm rounded px-2 py-1
                      whitespace-nowrap">
        {content}
      </div>
    </div>
  );
};