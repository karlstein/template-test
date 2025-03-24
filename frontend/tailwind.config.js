/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/*.{tsx}",
    "./src/app/**/*.{tsx}",
    "./src/app/*.{tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#121212",
        "card-bg": "#1e1e1e",
        accent: "#4ecdc4",
        "secondary-text": "#a0a0a0",
        error: "#ff6b6b",
        google: "#4285F4",
      },
      keyframes: {
        wave: {
          "0%": { backgroundPositionX: "0" },
          "100%": { backgroundPositionX: "1000px" },
        },
      },
      animation: {
        "wave-normal": "wave 20s linear infinite",
        "wave-reverse": "wave 15s linear infinite reverse",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".scrollbar::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
        ".scrollbar::-webkit-scrollbar-track": {
          "border-radius": "100vh",
          background: "#1e1e1e",
        },
        ".scrollbar::-webkit-scrollbar-thumb": {
          background: "rgba(107, 202, 195, 0.6)",
          "border-radius": "100vh",
          /* padding: 3px, */
          border: "2px solid #1e1e1e",
        },
        ".scrollbar::-webkit-scrollbar-thumb:hover": {
          background: "#6bcac3",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
