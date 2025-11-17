vite project


npm create vite@latest
projectname: frontend
select react
select javascript
cd frontend
npm i
npm run dev



//for tailwindcss use
npm install tailwindcss@3
npm i postcss autoprefixer

setup:
in index.css write:   
@tailwind base;
@tailwind components;
@tailwind utilities;


in tailwind.config.js file:
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,ts,tsx}",
  ],

  now we can run: npm run dev to start server


  use talilwindcss classname and give bg-red-500