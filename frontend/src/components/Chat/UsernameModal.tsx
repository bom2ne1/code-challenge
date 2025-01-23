import { Modal, Input, Button } from 'antd';

type UsernameModalProps = {
  visible: boolean;
  username: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsernameSubmit: () => void;
  onGuestSubmit: () => void;
  onCancel: () => void;
};

const UsernameModal = ({
  visible,
  username,
  onUsernameChange,
  onUsernameSubmit,
  onGuestSubmit,
  onCancel,
}: UsernameModalProps) => (
  <Modal
    title="Choose Your Username"
    visible={visible}
    footer={null}
    onCancel={onCancel}
    closable={false}
  >
    <Input
      placeholder="Enter your username"
      value={username}
      onChange={onUsernameChange}
    />
    <Button onClick={onUsernameSubmit} style={{ marginTop: '10px' }}>
      Join as {username ? username : 'Username'}
    </Button>
    <Button onClick={onGuestSubmit} style={{ marginTop: '10px', marginLeft: '10px' }}>
      Continue as Guest
    </Button>
  </Modal>
);

export default UsernameModal;
