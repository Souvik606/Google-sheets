import { useState } from "react";

export function Tooltip({ children, text }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="pointer-events-none absolute top-10 right-1 rounded-md bg-teal-50 px-3 py-2 text-sm whitespace-nowrap text-black shadow-md dark:bg-gray-800 dark:text-white">
          {text.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
