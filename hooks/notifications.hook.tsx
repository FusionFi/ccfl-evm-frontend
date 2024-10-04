import { message } from 'antd';
import { useCallback } from 'react';
export function useNotification() {
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccess: any = useCallback(
    (message: any) => {
      messageApi.open({
        type: 'success',
        content: message,
      });
    },
    [messageApi],
  );
  const showError: any = useCallback(
    (error: any) => {
      let message = error?.data?.message || error?.message || error;
      if (error?.message?.includes('insufficient funds')) {
        message = 'Insufficient balance';
      }
      messageApi.open({
        type: 'error',
        content: message || error,
      });
    },
    [messageApi],
  );
  const showWarning: any = useCallback(
    (message: any) => {
      messageApi.open({
        type: 'warning',
        content: message,
      });
    },
    [messageApi],
  );
  return [showSuccess, showError, showWarning, contextHolder];
}
