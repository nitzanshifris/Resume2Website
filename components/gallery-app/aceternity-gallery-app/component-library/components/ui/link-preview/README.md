# Link Preview

A customizable link preview component that shows website previews on hover, powered by Microlink API and Radix UI.

## Installation

```bash
npm install @radix-ui/react-hover-card qss
```

## Configuration

Add the Microlink API domain to your Next.js configuration:

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.microlink.io"],
  },
};

module.exports = nextConfig;
```

## Usage

```tsx
import { LinkPreview } from "@/components/ui/link-preview";

export function Example() {
  return (
    <p>
      Check out{" "}
      <LinkPreview url="https://nextjs.org" className="font-bold">
        Next.js
      </LinkPreview>{" "}
      for building React applications.
    </p>
  );
}
```

## Props

- `url` (string) - The URL to preview
- `children` (ReactNode) - The link text content
- `className` (string) - Additional CSS classes for the link
- `width` (number) - Preview width (default: 200)
- `height` (number) - Preview height (default: 125)
- `quality` (number) - Image quality (default: 50)
- `isStatic` (boolean) - Whether to use a static image instead of generating a preview
- `imageSrc` (string) - The static image source (required when isStatic is true)

## Features

- Dynamic website previews using Microlink API
- Smooth hover animations with Framer Motion
- Support for static images
- Mouse-following preview movement
- Customizable preview size and quality
- Dark mode support

## Examples

### Dynamic Preview
```tsx
<LinkPreview url="https://github.com" className="font-bold">
  GitHub
</LinkPreview>
```

### Static Image Preview
```tsx
<LinkPreview 
  url="https://example.com"
  isStatic
  imageSrc="/path/to/image.jpg"
  className="font-bold"
>
  Example Site
</LinkPreview>
```