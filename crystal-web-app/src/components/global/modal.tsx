import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

type Props = {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
};

/**
 * Reusable modal component for displaying content in overlay dialogs
 * 
 * This component provides a consistent modal interface using shadcn/ui Dialog:
 * 1. Flexible trigger element (button, link, etc.)
 * 2. Customizable title and description
 * 3. Content area for any React components
 * 4. Responsive design with proper accessibility
 * 
 * Used throughout the app for:
 * - User search interface
 * - Confirmation dialogs
 * - Form modals
 * - Information displays
 * 
 * @param trigger - Element that opens the modal when clicked
 * @param children - Content to display inside the modal
 * @param title - Modal title displayed in header
 * @param description - Optional description text
 * @param className - Additional CSS classes for styling
 * @returns JSX element containing the modal structure
 */
function Modal({ trigger, children, title, description, className}: Props) {
  return (
    <Dialog>
      {/* Trigger element that opens the modal */}
      <DialogTrigger
        className={className}
        asChild
      >
        {trigger}
      </DialogTrigger>
      
      {/* Modal content container */}
      <DialogContent showCloseButton={false} className="pt-0">
        {/* Modal header with title and description */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {/* Main content area - can contain any components */}
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;