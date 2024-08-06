import cssClass from '@/components/borrow/modal-borrow.component.module.scss';
import { twMerge } from 'tailwind-merge';
import ModalComponent from '@/components/common/modal.component';

interface ModalBorrowProps {
  isModalOpen: boolean;
  handleCancel: any;
}

export default function ModalBorrowComponent(props: ModalBorrowProps) {
  const modalStyles = {
    // header: {
    //   borderLeft: `5px solid `,
    //   borderRadius: 0,
    //   paddingInlineStart: 5,
    // },
    body: {
      boxShadow: 'inset 0 0 5px #999',
      borderRadius: 5,
    },
    // mask: {
    //   backdropFilter: 'blur(10px)',
    // },
    // footer: {
    //   borderTop: '1px solid #333',
    // },
    content: {
      boxShadow: '0 0 30px #999',
    },
  };

  return (
    <div className={twMerge(cssClass.modalComponent)}>
      <div className="modal-container">
        <ModalComponent
          title="Borrow USDT"
          isModalOpen={props.isModalOpen}
          handleCancel={props.handleCancel}
          modalStyles={modalStyles}>
          <div className="modal-content">abc</div>
        </ModalComponent>
      </div>
    </div>
  );
}
