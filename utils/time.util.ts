import dayjs from 'dayjs';

export const formatTime = (val: any, format = 'DD/MM/YYYY - HH:mm:ss') => {
  if (!val) return '';
  if (typeof val == 'number') {
    return dayjs.unix(val).format(format);
  }
  return dayjs(val).format(format);
};
