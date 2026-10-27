// Measures a rendered page in the browser. This file is one arrow function:
// pass its whole contents as the `function` argument of the Playwright MCP
// tool `browser_evaluate`.
//
// It leaves itself on the page as `window.pxeMeasure`, so measure it again
// after a resize, a navigation within the same page, or opening a state with
// the one-line call instead of pasting this file a second time:
//
//   browser_evaluate(function: "() => window.pxeMeasure()")
//
// A full page load clears it; paste this file again after one. Pass
// `filename` to keep the result out of the conversation and read it from the
// file instead.
//
// It measures what a source diff cannot show and a screenshot cannot state as
// a number: overflow, text contrast, target sizes, controls with no name,
// heading order, unsized media, and how many type sizes, radii and shadows the
// page actually uses.
//
// It reports measurements, not findings. A number here is a candidate: confirm
// it on the screenshot, decide whether it harms the user, and group everything
// with one cause into one finding.
//
// Limits, which belong in any report that cites it: it reads the page as it
// stands, so a state nobody opened is not measured. Contrast is computed from
// the nearest opaque background colour, so text over an image or a gradient
// comes back as "unmeasured" rather than wrong. It cannot see hierarchy,
// rhythm, crowding or whether the page is any good.
() => {
  const measure = () => {
  const SAMPLE = 12;
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  const parseColour = (value) => {
    const match = /rgba?\(([^)]+)\)/.exec(value || "");
    if (!match) return null;
    const parts = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };

  const luminance = ({ r, g, b }) => {
    const channel = (value) => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };

  const contrast = (foreground, background) => {
    const a = luminance(foreground);
    const b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  // The colour behind an element: the nearest ancestor with an opaque
  // background. An image or a gradient on the way makes the result unusable,
  // which the caller has to sample from the screenshot instead.
  const backgroundBehind = (element) => {
    let node = element;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      if (style.backgroundImage && style.backgroundImage !== "none") return { unmeasured: "background-image" };
      const colour = parseColour(style.backgroundColor);
      if (colour && colour.a === 1) return { colour };
      if (colour && colour.a > 0 && colour.a < 1) return { unmeasured: "translucent-background" };
      node = node.parentElement;
    }
    const root = parseColour(getComputedStyle(document.documentElement).backgroundColor);
    return root && root.a === 1 ? { colour: root } : { colour: { r: 255, g: 255, b: 255, a: 1 } };
  };

  const visible = (element) => {
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  };

  const describe = (element) => {
    const id = element.id ? `#${element.id}` : "";
    const classes = typeof element.className === "string" && element.className
      ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : "";
    return `${element.tagName.toLowerCase()}${id}${classes}`;
  };

  const text = (element) => (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);

  const all = Array.from(document.querySelectorAll("*")).filter(visible);

  // 1. Horizontal overflow. The page scrolling sideways is the finding; the
  // widest elements are the evidence.
  const documentWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body ? document.body.scrollWidth : 0,
  );
  const overflow = {
    documentWidth,
    viewportWidth: viewport.width,
    scrollsSideways: documentWidth > viewport.width + 1,
    widest: all
      .map((element) => ({ element, box: element.getBoundingClientRect() }))
      .filter(({ box }) => box.right > viewport.width + 1 || box.left < -1)
      .sort((a, b) => b.box.right - a.box.right)
      .slice(0, SAMPLE)
      .map(({ element, box }) => ({
        selector: describe(element),
        right: Math.round(box.right),
        left: Math.round(box.left),
        text: text(element),
      })),
  };

  // 2. Text contrast against the nearest opaque background.
  const textNodes = all.filter((element) => {
    if (!element.firstChild) return false;
    return Array.from(element.childNodes).some(
      (node) => node.nodeType === 3 && node.textContent.trim().length > 0,
    );
  });
  const contrastFailures = [];
  const unmeasuredContrast = [];
  for (const element of textNodes) {
    const style = getComputedStyle(element);
    const foreground = parseColour(style.color);
    if (!foreground || foreground.a < 1) continue;
    const behind = backgroundBehind(element);
    const size = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    if (behind.unmeasured) {
      unmeasuredContrast.push({ selector: describe(element), reason: behind.unmeasured, text: text(element) });
      continue;
    }
    const ratio = contrast(foreground, behind.colour);
    const required = large ? 3 : 4.5;
    if (ratio < required) {
      contrastFailures.push({
        selector: describe(element),
        text: text(element),
        ratio: Math.round(ratio * 100) / 100,
        required,
        fontSize: Math.round(size * 10) / 10,
        colour: style.color,
        background: `rgb(${behind.colour.r}, ${behind.colour.g}, ${behind.colour.b})`,
      });
    }
  }

  // 3. Interactive elements: size and accessible name.
  const interactiveSelector = [
    "a[href]", "button", "input", "select", "textarea", "summary",
    "[role=button]", "[role=link]", "[role=checkbox]", "[role=radio]",
    "[role=switch]", "[role=tab]", "[role=menuitem]", "[tabindex]:not([tabindex='-1'])",
  ].join(",");
  const interactive = Array.from(document.querySelectorAll(interactiveSelector)).filter(visible);

  const accessibleName = (element) => {
    const label = element.getAttribute("aria-label");
    if (label && label.trim()) return label.trim();
    const labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      const names = labelledBy.split(/\s+/)
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((node) => (node.textContent || "").trim())
        .filter(Boolean);
      if (names.length) return names.join(" ");
    }
    if (element.labels && element.labels.length) {
      const fromLabel = Array.from(element.labels).map((node) => (node.textContent || "").trim()).filter(Boolean);
      if (fromLabel.length) return fromLabel.join(" ");
    }
    const own = (element.textContent || "").trim();
    if (own) return own;
    const title = element.getAttribute("title");
    if (title && title.trim()) return title.trim();
    const image = element.querySelector("img[alt]");
    if (image && image.getAttribute("alt").trim()) return image.getAttribute("alt").trim();
    if (element.tagName === "INPUT" && element.getAttribute("value")) return element.getAttribute("value");
    return null;
  };

  const inlineLink = (element) => {
    if (element.tagName !== "A") return false;
    const parent = element.parentElement;
    if (!parent) return false;
    // A link inside running text is exempt from the target-size rule.
    return getComputedStyle(element).display === "inline" &&
      (parent.textContent || "").trim().length > (element.textContent || "").trim().length + 10;
  };

  const smallTargets = [];
  const unnamedControls = [];
  const placeholderOnly = [];
  for (const element of interactive) {
    const box = element.getBoundingClientRect();
    const name = accessibleName(element);
    if (!name) {
      unnamedControls.push({ selector: describe(element), html: element.outerHTML.slice(0, 120) });
    }
    if (!inlineLink(element) && (box.width < 24 || box.height < 24)) {
      smallTargets.push({
        selector: describe(element),
        name,
        width: Math.round(box.width),
        height: Math.round(box.height),
        below: "24x24 (WCAG 2.5.8)",
      });
    } else if (!inlineLink(element) && (box.width < 44 || box.height < 44)) {
      smallTargets.push({
        selector: describe(element),
        name,
        width: Math.round(box.width),
        height: Math.round(box.height),
        below: "44x44 (Apple HIG comfortable target)",
      });
    }
    if ((element.tagName === "INPUT" || element.tagName === "TEXTAREA") &&
        element.getAttribute("placeholder") && !name) {
      placeholderOnly.push({ selector: describe(element), placeholder: element.getAttribute("placeholder") });
    }
  }

  // 4. Heading order.
  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).filter(visible);
  const levels = headings.map((element) => ({ level: Number(element.tagName[1]), text: text(element) }));
  const skips = [];
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i].level - levels[i - 1].level > 1) {
      skips.push({ from: `h${levels[i - 1].level}`, to: `h${levels[i].level}`, at: levels[i].text });
    }
  }

  // 5. Media with no reserved space. Measured from the attributes, not the
  // render: a cached or inline image decodes before paint and shifts nothing
  // locally while a real network image does.
  const unsizedMedia = Array.from(document.querySelectorAll("img,video,iframe,embed,object"))
    .filter(visible)
    .filter((element) => {
      const style = getComputedStyle(element);
      if (style.aspectRatio && style.aspectRatio !== "auto") return false;
      const hasAttributes = element.getAttribute("width") && element.getAttribute("height");
      return !hasAttributes;
    })
    .slice(0, SAMPLE)
    .map((element) => ({
      selector: describe(element),
      source: (element.currentSrc || element.src || element.getAttribute("src") || "").slice(-70),
    }));

  const imagesWithoutAlt = Array.from(document.querySelectorAll("img")).filter(visible)
    .filter((element) => element.getAttribute("alt") === null)
    .slice(0, SAMPLE)
    .map((element) => ({ selector: describe(element), source: (element.currentSrc || element.src || "").slice(-70) }));

  // 6. Census. Drift shows up here before anyone can name it: a page with
  // fourteen type sizes and nine radii has no scale.
  const census = (values) => {
    const counts = new Map();
    for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, count }));
  };

  const fontSizes = [];
  const radii = [];
  const shadows = [];
  const families = [];
  const tiny = [];
  for (const element of all) {
    const style = getComputedStyle(element);
    if ((element.textContent || "").trim()) {
      const size = Math.round(parseFloat(style.fontSize) * 10) / 10;
      if (size) fontSizes.push(`${size}px`);
      if (size && size < 12) tiny.push({ selector: describe(element), fontSize: size, text: text(element) });
      families.push(style.fontFamily.split(",")[0].replace(/["']/g, "").trim());
    }
    if (style.borderRadius && style.borderRadius !== "0px") radii.push(style.borderRadius);
    if (style.boxShadow && style.boxShadow !== "none") shadows.push(style.boxShadow.slice(0, 60));
  }

  return {
    url: location.href,
    title: document.title,
    viewport,
    measuredAt: new Date().toISOString(),
    counts: {
      elements: all.length,
      interactive: interactive.length,
      contrastFailures: contrastFailures.length,
      contrastUnmeasured: unmeasuredContrast.length,
      smallTargets: smallTargets.length,
      unnamedControls: unnamedControls.length,
      placeholderOnlyFields: placeholderOnly.length,
      headingSkips: skips.length,
      h1: headings.filter((element) => element.tagName === "H1").length,
      unsizedMedia: unsizedMedia.length,
      imagesWithoutAlt: imagesWithoutAlt.length,
      textBelow12px: tiny.length,
      typeSizes: new Set(fontSizes).size,
      radiusValues: new Set(radii).size,
      shadowValues: new Set(shadows).size,
      fontFamilies: new Set(families).size,
    },
    overflow,
    contrastFailures: contrastFailures.slice(0, SAMPLE),
    contrastUnmeasured: unmeasuredContrast.slice(0, SAMPLE),
    smallTargets: smallTargets.slice(0, SAMPLE),
    unnamedControls: unnamedControls.slice(0, SAMPLE),
    placeholderOnlyFields: placeholderOnly.slice(0, SAMPLE),
    headings: { order: levels.slice(0, 30), skips },
    unsizedMedia,
    imagesWithoutAlt,
    textBelow12px: tiny.slice(0, SAMPLE),
    census: {
      typeSizes: census(fontSizes).slice(0, 14),
      radii: census(radii).slice(0, 10),
      shadows: census(shadows).slice(0, 8),
      fontFamilies: census(families).slice(0, 6),
    },
  };
  };

  window.pxeMeasure = measure;
  return measure();
}
