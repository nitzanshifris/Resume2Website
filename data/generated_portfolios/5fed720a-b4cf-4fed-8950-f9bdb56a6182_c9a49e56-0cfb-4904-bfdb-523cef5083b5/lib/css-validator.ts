/**
 * CSS Security Validator
 * Provides utilities for validating and sanitizing CSS values to prevent injection attacks
 */

/**
 * Validates if a string is a safe CSS color value
 * Supports: hex, rgb, rgba, hsl, hsla, and named colors
 */
export function isValidCSSColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  
  // Remove whitespace for consistent checking
  const trimmedColor = color.trim();
  
  // Check for common patterns that could indicate injection attempts
  if (trimmedColor.includes(';') || trimmedColor.includes('}') || trimmedColor.includes('{')) {
    return false;
  }
  
  // Hex color validation
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(trimmedColor)) {
    return true;
  }
  
  // RGB/RGBA validation
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[01]?\.?\d*)?\s*\)$/i.test(trimmedColor)) {
    return true;
  }
  
  // HSL/HSLA validation
  if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*[01]?\.?\d*)?\s*\)$/i.test(trimmedColor)) {
    return true;
  }
  
  // Named color validation - only allow a safe subset of CSS named colors
  const safeNamedColors = [
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
    'gray', 'grey', 'orange', 'purple', 'brown', 'pink', 'transparent'
  ];
  
  if (safeNamedColors.includes(trimmedColor.toLowerCase())) {
    return true;
  }
  
  return false;
}

/**
 * Escapes a string to be safe for use as a CSS identifier
 * Uses CSS.escape if available, otherwise implements a safe escaping mechanism
 */
export function escapeCSSIdentifier(identifier: string): string {
  if (!identifier || typeof identifier !== 'string') return '';
  
  // Use native CSS.escape if available
  if (typeof CSS !== 'undefined' && CSS.escape) {
    return CSS.escape(identifier);
  }
  
  // Fallback implementation
  // Replace any character that's not alphanumeric, dash, or underscore
  return identifier.replace(/[^a-zA-Z0-9\-_]/g, (char) => {
    // Convert to hex code
    return '\\' + char.charCodeAt(0).toString(16) + ' ';
  });
}

/**
 * Sanitizes a CSS value to prevent injection attacks
 * Returns the original value if valid, or a safe default if not
 */
export function sanitizeCSSValue(value: string, defaultValue: string = 'inherit'): string {
  if (isValidCSSColor(value)) {
    return value;
  }
  return defaultValue;
}