import { Input, Button } from 'antd';

export default function MessageInput({ message, onChange, onSend }: { message: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onSend: () => void }) {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Input
        placeholder="Type your message"
        value={message}
        onChange={onChange}
        onPressEnter={onSend}
        allowClear
      />
      <Button type="primary" onClick={onSend}>
        Send
      </Button>
    </div>
  );
}
