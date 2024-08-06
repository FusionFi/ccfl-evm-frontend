import cssClass from '@/components/borrow/modal-borrow.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { Modal } from 'antd';

interface ModalProps {
  isModalOpen: boolean;
  handleCancel: any;
  children: any;
  title: string;
}

export default function ModalComponent(props: ModalProps) {
  return (
    <div className={twMerge(cssClass.modalComponent)}>
      <div className="modal-container">
        <Modal
          footer={null}
          title={props.title}
          open={props.isModalOpen}
          onCancel={props.handleCancel}
          className="modal-common">
          {props.children}
        </Modal>
      </div>
    </div>
  );
}
