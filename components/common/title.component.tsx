import cssClass from '@/components/common/title.component.module.scss';
import { twMerge } from 'tailwind-merge';

interface TitleProps {
  children: any;
  text: string;
}

export default function TitleComponent(props: TitleProps) {
  return (
    <div className={twMerge(cssClass.titleComponent)}>
      <div className="title-container">
        <div className="title-content">{props.text}</div>
        {props.children}
      </div>
    </div>
  );
}
