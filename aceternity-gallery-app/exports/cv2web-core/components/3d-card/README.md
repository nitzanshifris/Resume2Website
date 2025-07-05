# 3D Card Component

## תיאור
קומפוננטת כרטיס תלת-מימדית אינטראקטיבית עם אפקטים של עומק ותנועה.

## פרומפט הפעלה
הקומפוננטה מופעלת כאשר המשתמש מרחף מעל הכרטיס, יוצר אפקט תלת-מימדי של תנועה וצל.

## קוד
```tsx
import { CardContainer, CardBody, CardItem } from './components/3d-card';
import Compare from "./compare";

export default function Demo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Make things float in 3D
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Hover over this card to see the effect
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
```

## מדריך התקנה ידנית
1. התקן את התלויות הנדרשות:
   ```bash
   npm install framer-motion
   ```
2. העתק את קובץ הקומפוננטה לפרויקט שלך
3. ייבא את הקומפוננטה:
   ```tsx
   import { Card3D } from './components/3d-card';
   ```
4. השתמש בקומפוננטה:
   ```tsx
   <Card3D>
     תוכן הכרטיס
   </Card3D>
   ```

## Features

- Smooth 3D rotation based on mouse position
- Configurable transform properties (translate and rotate)
- TypeScript support
- Accessible
- Customizable styling

## Usage

```tsx
import { CardContainer, CardBody, CardItem } from './components/3d-card';
import Compare from "./compare";

export default function Demo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          Make things float in 3D
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          Hover over this card to see the effect
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
```

## Props

### CardContainer
- `children`: React nodes to render
- `className`: Additional CSS classes
- `containerClassName`: CSS classes for the outer container

### CardBody
- `children`: React nodes to render
- `className`: Additional CSS classes

### CardItem
- `as`: Element type to render (default: "div")
- `children`: React nodes to render
- `className`: Additional CSS classes
- `translateX`: X-axis translation in pixels
- `translateY`: Y-axis translation in pixels
- `translateZ`: Z-axis translation in pixels
- `rotateX`: X-axis rotation in degrees
- `rotateY`: Y-axis rotation in degrees
- `rotateZ`: Z-axis rotation in degrees

## Styling

The component uses Tailwind CSS by default but can be customized using regular CSS classes. Basic styles are provided in `styles.css`. 