# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


01
Install Tailwind CSS
Install tailwindcss, @tailwindcss/postcss, and postcss via npm.

Terminal
npm install tailwindcss @tailwindcss/postcss postcss

02
Add Tailwind to your PostCSS configuration
Add @tailwindcss/postcss to your postcss.config.mjs file, or wherever PostCSS is configured in your project.

postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  }
}

03
Import Tailwind CSS
Add an @import to your CSS file that imports Tailwind CSS.

CSS
@import "tailwindcss";

04
Start your build process
Run your build process with npm run dev or whatever command is configured in your package.json file.

Terminal
npm run dev