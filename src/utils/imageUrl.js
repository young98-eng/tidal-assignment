export function resized(url, width = 600) {
  if (!url) return url;
  return url.includes('?') ? `${url}&width=${width}` : `${url}?width=${width}`;
}

// "https://.../GreenSweatpants01.jpg?v=123" → "GreenSweatpants"
export function getImagePrefix(url) {
  if (!url) return '';
  const filename = url.split('/').pop().split('?')[0];
  const m = filename.match(/^(.+?)\d+\.\w+$/);
  return m ? m[1] : filename.replace(/\.\w+$/, '');
}

// Returns all images from product.images that share the same filename prefix as the given color's variant image.
// For UUID-format filenames (e.g. "1_abc123.png"), groups by exclusion: collects all sequential-numbered
// images not claimed as variant images by any other color.
export function getColorImages(product, color) {
  if (!color) return product.images || [];
  const matchingVariant = product.variants?.find(v =>
    v.selectedOptions.some(o => o.name.toLowerCase() === 'color' && o.value === color)
  );
  if (!matchingVariant?.image?.url) return [];

  const variantUrl = matchingVariant.image.url;
  const prefix = getImagePrefix(variantUrl);

  // Standard case: prefix-based grouping (e.g. GreenHoodie01/02/03.jpg)
  if (prefix) {
    const matched = (product.images || []).filter(img => getImagePrefix(img.url) === prefix);
    if (matched.length > 1) return matched;
  }

  // UUID fallback: filename starts with a digit+underscore (e.g. "1_72ff506b...png")
  const filename = variantUrl.split('/').pop().split('?')[0];
  if (/^\d+_/.test(filename)) {
    const otherColorUrls = new Set(
      (product.variants || [])
        .filter(v => !v.selectedOptions.some(o => o.name.toLowerCase() === 'color' && o.value === color))
        .map(v => v.image?.url)
        .filter(Boolean)
    );
    const group = (product.images || []).filter(img => {
      const fn = img.url.split('/').pop().split('?')[0];
      return /^\d+_/.test(fn) && !otherColorUrls.has(img.url);
    });
    if (group.length > 0) return group;
  }

  return [matchingVariant.image];
}
