import cssClass from '@/components/common/modal.component.module.scss';
import { twMerge } from 'tailwind-merge';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface ModalProps {
  isModalOpen: boolean;
  handleCancel: any;
  children: any;
  title: string;
  closeIcon?: any;
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
          className={`modal-common ${props.closeIcon === false ? 'noti' : ''}`}
          closeIcon={props.closeIcon === false ? null : <CloseOutlined />}>
          {props.children}
        </Modal>
      </div>
    </div>
  );
}
