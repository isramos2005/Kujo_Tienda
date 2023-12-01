declare const SuccessToast: any;
declare const ErrorToast: any;
declare const InfoToast: any;
declare const WarningToast: any;

export class ToastUtils {
    static showSuccessToast(message: string) {
      SuccessToast(message);
    }
    
    static showErrorToast(message: string) {
      ErrorToast(message);
    }
    
    static showInfoToast(message: string) {
      InfoToast(message);
    }
    
    static showWarningToast(message: string) {
      WarningToast(message);
    }
  }
  