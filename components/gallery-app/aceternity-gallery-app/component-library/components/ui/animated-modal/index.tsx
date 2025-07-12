export {
  Modal,
  ModalTrigger,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalProvider,
  useModal,
  useOutsideClick,
} from "./animated-modal-base";

export { AnimatedModalTravelBooking } from "./animated-modal-travel-booking";
export { AnimatedModalSimpleForm } from "./animated-modal-simple-form";
export { AnimatedModalConfirmation } from "./animated-modal-confirmation";

// Gallery-specific preview components
export { 
  AnimatedModalGalleryBasic,
  AnimatedModalGalleryForm,
  AnimatedModalGalleryConfirmation,
  AnimatedModalGalleryMinimal
} from "./animated-modal-gallery-preview";

export type {
  ModalContextType,
  ModalProviderProps,
  ModalProps,
  ModalTriggerProps,
  ModalBodyProps,
  ModalContentProps,
  ModalFooterProps,
  OverlayProps,
} from "./animated-modal.types";