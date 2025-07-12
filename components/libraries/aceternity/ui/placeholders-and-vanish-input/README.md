# Placeholders And Vanish Input

Sliding in placeholders and vanish effect of input on submit

## Installation

```bash
npm i motion clsx tailwind-merge
```

## Usage

```tsx
import { PlaceholdersAndVanishInput } from "./placeholders-and-vanish-input";

function MyComponent() {
  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask Aceternity UI Anything
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
```

## Props

### PlaceholdersAndVanishInput

| Prop Name | Type | Description |
|-----------|------|-------------|
| `placeholders` | `string[]` | An array of strings used as placeholders that cycle in the input field |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | Function called when the input value changes |
| `onSubmit` | `(e: React.FormEvent<HTMLFormElement>) => void` | Function called when the form is submitted |

## Features

- **Cycling Placeholders**: Automatically cycles through placeholder text every 3 seconds
- **Vanish Animation**: Text disappears with a particle effect when submitted
- **Canvas Animation**: Uses HTML5 Canvas for smooth text dissolution effect
- **Responsive Design**: Adapts to different screen sizes
- **Dark Mode Support**: Works with dark and light themes
- **Keyboard Support**: Submit with Enter key
- **Tab Visibility**: Pauses animations when tab is not visible

## How it Works

1. **Placeholder Cycling**: Uses `setInterval` to cycle through placeholder texts
2. **Canvas Rendering**: Renders input text to canvas to capture pixel data
3. **Particle System**: Converts text pixels to particles for animation
4. **Vanish Effect**: Animates particles dispersing when form is submitted
5. **State Management**: Manages animation states and input value

## Customization

The component comes with built-in styling but can be customized:

```tsx
// The input styling is handled internally with Tailwind classes
// Focus styles, transitions, and dark mode are pre-configured
```

## Performance Notes

- Automatically pauses placeholder cycling when tab is inactive
- Uses `requestAnimationFrame` for smooth animations
- Canvas operations are optimized for performance
- Cleanup on component unmount prevents memory leaks