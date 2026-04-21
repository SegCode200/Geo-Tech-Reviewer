import Swal, { SweetAlertIcon } from 'sweetalert2';

/**
 * Custom Alert Service for the Geo-Tech Reviewer application
 *
 * This service provides a consistent, government-themed alert system across the application.
 * It wraps SweetAlert2 with custom styling that matches the project's design system.
 *
 * Usage Examples:
 *
 * // Simple success message
 * Alert.success("Operation Completed", "Your changes have been saved successfully.");
 *
 * // Error message
 * Alert.error("Failed to Save", "Please check your input and try again.");
 *
 * // Warning message
 * Alert.warning("Attention Required", "Please review the form before submitting.");
 *
 * // Info message
 * Alert.info("Information", "This is an informational message.");
 *
 * // Confirmation dialog
 * const confirmed = await Alert.confirm({
 *   title: "Are you sure?",
 *   text: "This action cannot be undone.",
 *   confirmButtonText: "Yes, proceed",
 *   type: "warning"
 * });
 *
 * // Input prompt
 * const userInput = await Alert.prompt({
 *   title: "Enter Details",
 *   text: "Please provide additional information:",
 *   inputType: "textarea",
 *   confirmButtonText: "Submit"
 * });
 *
 * // Auto-dismiss after 3 seconds
 * Alert.success("Saved!", "Changes saved automatically.", { timer: 3000 });
 */

interface AlertOptions {
  title: string;
  text?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  timer?: number;
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

class AlertService {
  private static getIcon(type: AlertOptions['type']): SweetAlertIcon {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  private static getConfirmButtonColor(type: AlertOptions['type']): string {
    switch (type) {
      case 'success':
        return '#003366'; // primary
      case 'error':
        return '#C5192D'; // accent
      case 'warning':
        return '#FFA500'; // orange
      case 'info':
      default:
        return '#004B87'; // secondary
    }
  }

  static show(options: AlertOptions) {
    const {
      title,
      text,
      type = 'info',
      timer,
      showConfirmButton = true,
      confirmButtonText = 'OK',
      onConfirm,
      onClose
    } = options;

    return Swal.fire({
      title,
      text,
      icon: this.getIcon(type),
      timer,
      showConfirmButton,
      confirmButtonText,
      confirmButtonColor: this.getConfirmButtonColor(type),
      customClass: {
        popup: 'gov-alert-popup',
        title: 'gov-alert-title',
        htmlContainer: 'gov-alert-text',
        confirmButton: 'gov-alert-confirm-button',
        timerProgressBar: 'gov-alert-timer-bar'
      },
      didClose: onClose,
      preConfirm: onConfirm
    });
  }

  static success(title: string, text?: string, options?: Partial<Omit<AlertOptions, 'title' | 'text' | 'type'>>) {
    return this.show({ ...options, title, text, type: 'success' });
  }

  static error(title: string, text?: string, options?: Partial<Omit<AlertOptions, 'title' | 'text' | 'type'>>) {
    return this.show({ ...options, title, text, type: 'error' });
  }

  static warning(title: string, text?: string, options?: Partial<Omit<AlertOptions, 'title' | 'text' | 'type'>>) {
    return this.show({ ...options, title, text, type: 'warning' });
  }

  static info(title: string, text?: string, options?: Partial<Omit<AlertOptions, 'title' | 'text' | 'type'>>) {
    return this.show({ ...options, title, text, type: 'info' });
  }

  static async confirm(options: {
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }): Promise<boolean> {
    const {
      title,
      text,
      confirmButtonText = 'Yes',
      cancelButtonText = 'Cancel',
      type = 'warning'
    } = options;

    const result = await Swal.fire({
      title,
      text,
      icon: this.getIcon(type),
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: this.getConfirmButtonColor(type),
      cancelButtonColor: '#6B7280',
      customClass: {
        popup: 'gov-alert-popup',
        title: 'gov-alert-title',
        htmlContainer: 'gov-alert-text',
        confirmButton: 'gov-alert-confirm-button',
        cancelButton: 'gov-alert-cancel-button',
        timerProgressBar: 'gov-alert-timer-bar'
      }
    });

    return result.isConfirmed;
  }

  static prompt(options: {
    title: string;
    text?: string;
    inputPlaceholder?: string;
    inputType?: 'text' | 'textarea' | 'email' | 'password' | 'number';
    confirmButtonText?: string;
    cancelButtonText?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }): Promise<string | null> {
    const {
      title,
      text,
      inputPlaceholder = '',
      inputType = 'text',
      confirmButtonText = 'OK',
      cancelButtonText = 'Cancel',
      type = 'info'
    } = options;

    return Swal.fire({
      title,
      text,
      input: inputType,
      inputPlaceholder,
      icon: this.getIcon(type),
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: this.getConfirmButtonColor(type),
      cancelButtonColor: '#6B7280',
      inputAttributes: {
        'aria-label': inputPlaceholder
      },
      customClass: {
        popup: 'gov-alert-popup',
        title: 'gov-alert-title',
        htmlContainer: 'gov-alert-text',
        confirmButton: 'gov-alert-confirm-button',
        cancelButton: 'gov-alert-cancel-button',
        input: 'gov-alert-input',
        timerProgressBar: 'gov-alert-timer-bar'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        return result.value;
      }
      return null;
    });
  }
}

// Add custom CSS styles
const customStyles = `
  .gov-alert-popup {
    font-family: 'Urbanist', sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 51, 102, 0.15);
  }

  .gov-alert-title {
    color: #003366;
    font-weight: 600;
    font-size: 1.25rem;
  }

  .gov-alert-text {
    color: #1A1A1A;
    font-size: 1rem;
    line-height: 1.6;
  }

  .gov-alert-confirm-button {
    font-family: 'Urbanist', sans-serif;
    font-weight: 500;
    border-radius: 4px;
    padding: 0.5rem 1.5rem;
    transition: all 0.2s ease;
  }

  .gov-alert-confirm-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 51, 102, 0.2);
  }

  .gov-alert-cancel-button {
    font-family: 'Urbanist', sans-serif;
    font-weight: 500;
    border-radius: 4px;
    padding: 0.5rem 1.5rem;
    background-color: #6B7280 !important;
    color: white !important;
    border: none !important;
    transition: all 0.2s ease;
  }

  .gov-alert-cancel-button:hover {
    background-color: #4B5563 !important;
    transform: translateY(-1px);
  }

  .gov-alert-timer-bar {
    background-color: #003366;
  }
`;

// Inject styles into the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default AlertService;