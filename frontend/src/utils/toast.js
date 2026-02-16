import toast from 'react-hot-toast';

// Custom toast styles matching Monad theme
const toastStyles = {
    success: {
        style: {
            background: '#1A1A24',
            color: '#fff',
            border: '1px solid #8247E5',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(130, 71, 229, 0.4)',
        },
        iconTheme: {
            primary: '#8247E5',
            secondary: '#fff',
        },
    },
    error: {
        style: {
            background: '#1A1A24',
            color: '#fff',
            border: '1px solid #EF4444',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
        },
        iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
        },
    },
    loading: {
        style: {
            background: '#1A1A24',
            color: '#fff',
            border: '1px solid #6B7280',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
    },
};

// Toast helper functions
export const showSuccess = (message) => {
    return toast.success(message, toastStyles.success);
};

export const showError = (message) => {
    return toast.error(message, toastStyles.error);
};

export const showLoading = (message) => {
    return toast.loading(message, toastStyles.loading);
};

export const showInfo = (message) => {
    return toast(message, {
        icon: 'ℹ️',
        style: toastStyles.loading.style,
    });
};

// Promise toast - shows loading, then success/error
export const showPromise = (promise, messages) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading || 'Processing...',
            success: messages.success || 'Success!',
            error: messages.error || 'Something went wrong',
        },
        {
            success: toastStyles.success,
            error: toastStyles.error,
            loading: toastStyles.loading,
        }
    );
};

// Dismiss toast
export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAll = () => {
    toast.dismiss();
};

// Custom toast for transactions
export const showTransaction = (txHash, explorerUrl) => {
    return toast.success(
        (t) => (
            <div>
                <p className="font-semibold mb-1">Transaction Submitted!</p>
                <a
                    href={`${explorerUrl}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-monad-purple-light hover:underline"
                >
                    View on Explorer →
                </a>
            </div>
        ),
        {
            ...toastStyles.success,
            duration: 6000,
        }
    );
};

export default {
    success: showSuccess,
    error: showError,
    loading: showLoading,
    info: showInfo,
    promise: showPromise,
    transaction: showTransaction,
    dismiss: dismissToast,
    dismissAll,
};
