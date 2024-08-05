import cssClass from '@/components/borrow/modal-borrow.component.module.scss';
import { twMerge } from 'tailwind-merge';
import ModalComponent from '@/components/common/modal.component';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
}

export default function ModalBorrowComponent(props: ModalBorrowProps) {
  return (
    <div className={twMerge(cssClass.modalComponent)}>
      <div className="modal-container">
        <ModalComponent
          title="Borrow USDT"
          isModalOpen={props.isModalOpen}
          handleCancel={props.handleCancel}>
          abc
        </ModalComponent>
      </div>
    </div>
  );
}
