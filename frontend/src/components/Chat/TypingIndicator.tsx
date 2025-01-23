import { Alert } from 'antd';

export default function TypingIndicator({ typingUsers }: { typingUsers: string[] }) {
  return (
    typingUsers.length > 0 && (
      <div style={{ marginBottom: '10px' }}>
        <Alert
          type="info"
          message={`${typingUsers.join(', ')} ${
            typingUsers.length > 1 ? 'are' : 'is'
          } typing...`}
          showIcon
        />
      </div>
    )
  );
}
