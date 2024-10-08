import cssClass from '@/components/common/empty.component.module.scss';
import { twMerge } from 'tailwind-merge';

interface IProps {
  message: any;
}

export default function EmptyComponent({ message }: IProps) {
  return (
    <div className={twMerge(cssClass['empty-wrapper'])}>
      {message}
    </div>
  );
}
