import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function AutocompleteTest() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);

  const updatePosition = () => {
    if (!inputRef.current || !dropdownRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    dropdownRef.current.style.top = `${rect.bottom}px`;
    dropdownRef.current.style.left = `${rect.left}px`;
    dropdownRef.current.style.width = `${rect.width}px`;
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  console.log('refreshing', new Date().toISOString());

  return (
    <>
      <input
        ref={inputRef}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />

      {open &&
        createPortal(
          <ul
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 0,
              background: "white",
              border: "1px solid #ccc",
              zIndex: 9999,
              listStyle: "none",
              padding: "0.5rem",
              margin: 0,
            }}
          >
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>,
          document.body
        )}
    </>
  );
}
