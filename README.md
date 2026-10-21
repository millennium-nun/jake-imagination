# Jake's Imagination Control

A responsive web toy made for the Parsons DT Bootcamp 2019. Squeeze the browser window and Jake changes:

| Window width | Scene |
| --- | --- |
| wider than 1200px | Jake's face. Boop the nose. |
| 1025–1200px | BMO control room. ON starts the knife rain. Don't touch the red button. |
| 751–1024px | Stretchy Jake. Hover (or tap) to stretch him; ON is chaos. |
| 415–750px | The floor is lava. |
| 414px and below | "Use a computer" notice. |

It's a static site, so open `index.html` or serve the folder with any static server
(`npx serve .` or `python3 -m http.server`).

## 2026 refresh

- **No dependencies.** jQuery is gone; `js/app.js` is plain JavaScript, loaded with `defer`.
- **Resizing never breaks a scene.** Each scene is laid out in its own unit (`--u`), sized from both
  width and height, so the face and BMO scenes always fit, even in short windows. Breakpoints use
  media-query range syntax, so fractional widths (browser zoom) can't fall between scenes. Nothing
  scrolls sideways except the stretch scene, where that's intended.
- **Performance**
  - The 15.5 MB knife-rain GIF is now a 0.8 MB MP4, with a WebM fallback. It only downloads when you press ON.
  - PNGs are served as WebP, with optimized PNG fallbacks. Images in hidden scenes are lazy-loaded.
  - The YouTube embed is a click-to-load facade, so the player only loads when someone plays it.
  - Adobe Fonts load without blocking rendering, and the audio uses `preload="none"`.
  - Animations use transforms and the Web Animations API, and they pause when their scene is hidden.
- **Fixes:** duplicate IDs, a broken resize handler, dead `#nonono` / `#warn` code,
  `jQuery.mouseover` handlers that piled up on every OFF click, and SVG attributes written in `vw`.
- **Friendlier:** the blocking `alert()` is now an on-page warning. The nose is a real button, and
  stretching works by tapping on touch screens. Reduced-motion settings are respected.
