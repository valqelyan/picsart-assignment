### Optimized Virtualized Masonry Grid with Detailed Photo View
***Would be awesome to use React Compiler, but focused on hooks as required.***

## Overview

This project is a Single Page Application (SPA) built with React and TypeScript that showcases an optimized, virtualized masonry grid layout displaying photos fetched from the Pexels API. It features a detailed photo view with additional information and supports infinite scroll and search functionality.

---

## Features

- **Virtualized Masonry Grid Layout**  
I implemented the virtualized masonry grid **entirely from scratch**, without using any AI or third-party virtualization/layout libraries. I am familiar with various virtualization techniques and have built multiple similar components in the past. My approach was inspired by the patterns used in projects like [preact-virtual-list](https://github.com/developit/preact-virtual-list), which was the first virtualization library I came across. This foundation helped me understand the core concepts of windowing and virtualization, which I adapted and extended to create a performant, responsive masonry grid that meets the assignment requirements.


- **Detailed Photo View**  
Clicking a photo opens a detailed view with a larger image, photographer’s name, title, description, and date. A back button returns to the masonry grid, preserving scroll position for a smooth user experience.


- **Infinite Scroll**  
  Automatically loads more photos as the user scrolls down.

- **Search Functionality (Bonus)**  
  Users can search photos by keywords; the masonry grid updates dynamically based on search results.

- **Responsive Design**  
  The layout adjusts gracefully across devices and screen sizes.

- **Error Boundaries**  
  Graceful handling of runtime errors with user-friendly fallback UI.

---

### Technologies Used

- React  
- React Router v7  
- React Query  
- TypeScript  
- 1-2 hooks from [@uidotdev/usehooks](https://github.com/uidotdev/usehooks)  
- Tailwindcss
- Pexels API 

⚠️ **I started with the Vite React Router template, which includes Tailwind, and since Vite doesn’t inline CSS, I stuck with Tailwind instead of CSS-in-JS. Otherwise, I’d use Linaria for compile-time styling. Hope this choice is fine.**
**Hopefully, this won’t be judged too harshly.**

---

## Performance Optimizations

- **Virtualization:** Render only visible photos to reduce DOM nodes and boost performance.  
- **Memoization:** Used `useMemo` and `useCallback` judiciously to avoid unnecessary re-renders.  
- **Image Optimization:** Sized images properly and leveraged browser caching.  
- **Lightweight Bundle:** Avoided heavy third-party libraries for smaller bundle size.  
- **Infinite Scroll:** Incremental data loading to reduce initial load.  
- **Performance:** Improved web vitals and scores based on Lighthouse audits.


---

This is the URL for a quick preview: [https://pexels-omega-roan.vercel.app](https://pexels-omega-roan.vercel.app)

## How to Run


1. Clone the repository:

   ```bash
   git clone https://github.com/valqelyan/picsart-assignment.git
   cd picsart-assignment

  This project requires a Pexels API key.  
  Create a `.env` file in the project root with:

  ```bash
  VITE_PEXELS_API=<YOUR_API_KEY_HERE>
  ```

2. Install dependencies:
    ```bash
    npm i
    ```
3. To build and run the production version:
    ```bash
    npm run build && npm start
    ```


## Unit tests are included and can be run with:
```bash
npm test
```
