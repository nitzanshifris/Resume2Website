# Animated Modal Component

A customizable, compound modal component with animated transitions and 3D effects.

## Usage

```tsx
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";

<Modal>
  <ModalTrigger>Open Modal</ModalTrigger>
  <ModalBody>
    <ModalContent>
      {/* Your content */}
    </ModalContent>
    <ModalFooter>
      {/* Footer buttons */}
    </ModalFooter>
  </ModalBody>
</Modal>
```

## Variants

### Travel Booking
Complex modal with image gallery and icon features for booking interfaces.

### Simple Form
Clean form modal for sign-up and data collection.

### Confirmation Dialog
Centered confirmation modal with warning icon for destructive actions.

## Components

### Modal
Root component that provides context to all child components.

### ModalTrigger
Button that opens the modal. Fully customizable with className.

### ModalBody
Container for the modal with backdrop and animations.

### ModalContent
Main content area with padding.

### ModalFooter
Footer area for action buttons.

## Features
- Compound component pattern for flexibility
- Smooth spring animations
- 3D perspective effects
- Click outside to close
- Backdrop blur
- Dark mode support
- Fully accessible
- TypeScript support