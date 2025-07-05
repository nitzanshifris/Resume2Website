# Signup Form

A customizable form component built on top of shadcn's input and label components, enhanced with Framer Motion animations for beautiful hover effects.

## Features

- Beautiful input hover animations with radial gradient
- Custom shadow effects
- Dark mode support
- Social login buttons (GitHub, Google, OnlyFans)
- Multiple form variants (Signup, Login, Contact)
- Fully accessible with proper labels
- Responsive design

## Usage

```tsx
import { SignupFormDemo } from "@/components/ui/signup-form";

export function MySignupPage() {
  const handleSubmit = (data) => {
    console.log("Form data:", data);
    // Handle form submission
  };

  return (
    <SignupFormDemo onSubmit={handleSubmit} />
  );
}
```

## Variants

### Signup Form
Full registration form with first name, last name, email, password fields and social login options.

### Login Form
Simplified login form with email and password fields.

### Contact Form
Contact form with name, email, subject, and message fields.

## Props

### SignupForm Props
- `className` - Additional CSS classes to apply
- `onSubmit` - Function called when form is submitted with form data

### Form Data Structure
```typescript
interface SignupFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  twitterpassword: string;
}
```

## Components Used

### Enhanced Input
The Input component features:
- Framer Motion hover effects
- Radial gradient animation on hover
- Custom shadow styling
- Dark mode support

### Enhanced Label
The Label component is built on @radix-ui/react-label and provides:
- Accessibility features
- Consistent styling
- Dark mode support

## Customization

You can customize the forms by:
- Modifying the gradient colors in the BottomGradient component
- Changing the social login providers
- Adjusting the input hover effect radius
- Customizing the shadow effects via CSS variables