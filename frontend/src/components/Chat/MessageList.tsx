import { List, Avatar } from 'antd';
import { useEffect, useRef } from 'react';

type Message = {
  userId: string;
  message: string;
  createdAt: string;
};

type MessageListProps = {
  messages: Message[];
  formatTimestamp: (timestamp: string) => string; // Accept the formatTimestamp prop
};

export default function MessageList({ messages, formatTimestamp }: MessageListProps) {
  const messageListRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]); // This will run every time messages change

  return (
    <div
      ref={messageListRef}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '20px',
        maxHeight: '300px',
        overflowY: 'scroll',
      }}
    >
      <List
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{msg.userId[0]}</Avatar>}
              title={
                <span>
                  {msg.userId}{' '}
                  <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                    ({formatTimestamp(msg.createdAt)}) {/* Use the formatTimestamp function */}
                  </span>
                </span>
              }
              description={msg.message}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
