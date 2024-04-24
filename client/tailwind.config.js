/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // darkBlue: "#264653",
        // lightGreen: "#00a6fb",
        // lightYellow: "#e9c46a",
        // lightOrange: "#f4a261",
        // darkBlack: "#000814",
        lightWhite: "#ededed",
        lighterWhite: "#f5f5f5",
        darkBlack: "#1f1f1f",
        darkerBlack: "#121212",
        
        vividCerulean: "#00AAEE",  // default blue ( closest websafe #0099FF )
        vividCeruleanLight: "#4DC4F3",  // default blue ( lighter )
        vividCeruleanDark: "#0077A7",  // default blue ( darker )

        teleMagenta: "#d43370", // default pink ( closest websafe #CC3366 )

        orangePantone: "#FF5904",  // default blue ( inverse )
        willpowerOrange: "#00a6fb",  // default blue ( complementary )
        mountainMeadowGreen: "#2BCC8F", // default pink ( inverse )
        eucalyptusGreen: "#33D497" // default pink ( complementary )
      },
      height: {
        '512': '512px',
        '1024': '1024px',
        '1250': '1250px',
      },
      width: {
        '512': '512px',
        '1024': '1024px',
        '1250': '1250px',
      },
      maxWidth: {
        '256': '256px',
        '512': '512px',
        '1024': '1024px',
        '1250': '1250px',
      },
    },
  },
  plugins: [],
};
