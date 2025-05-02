import { useState, useRef } from "react";

export function Tooltip({
  children,
  text,
  className = "",
  enterDelay = 400,
  exitDelay = 200,
}) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, enterDelay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setVisible(false);
    }, exitDelay);
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div
          className={`pointer-events-none absolute top-10 right-1 rounded-md bg-teal-50 px-3 py-2 text-sm whitespace-nowrap text-black shadow-md dark:bg-gray-800 dark:text-white ${className}`}
        >
          {text.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
