import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink, useLocation } from 'react-router';
import { Socket } from 'socket.io-client';
import { Layout } from 'antd';

import MessageList from '../../components/Chat/MessageList';
import MessageInput from '../../components/Chat/MessageInput';
import TypingIndicator from '../../components/Chat/TypingIndicator';
import UserList from '../../components/Chat/UserList';
import UsernameModal from '../../components/Chat/UsernameModal';

const { Header, Content } = Layout;

type Message = {
  userId: string;
  message: string;
  createdAt: string;
};

export default function Chat({ socket }: { socket: Socket }) {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasJoined = useRef(false);

  const [userId, setUserId] = useState<string>(paramUserId || '');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const isModalVisible = !userId;

  const formatTimestamp = (timestamp: string) => (
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(timestamp))
  );

  const initializeUser = (newUserId: string) => {
    setUserId(newUserId);
    navigate(`/chat/${newUserId}`);
  };

  useEffect(() => {
    if (userId !== paramUserId) {
      setMessages([]);
    }
    const socketEvents = {
      messageHistory: (history: Message[]) => 
        setMessages(prevMessages => [...history, ...prevMessages]),
      message: (messageData: Message) => 
        setMessages(prev => [...prev, messageData]),
      updateUsers: setUsers,
      typing: (typingUserId: string) => 
        setTypingUsers(prev => [...new Set([...prev, typingUserId])]),
      stopTyping: (typingUserId: string) => 
        setTypingUsers(prev => prev.filter(user => user !== typingUserId))
    };

    if (userId && !hasJoined.current) {
      socket.emit('join', userId);
      hasJoined.current = true;
    }

    Object.entries(socketEvents).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(socketEvents).forEach(event => {
        socket.off(event);
      });
    };
  }, [socket, userId]);

  useEffect(() => {
    if (location.pathname === '/') {
      setMessages([]);
      setUserId('');
      hasJoined.current = false;
    }
  }, [location]);

  const handleMessage = {
    send: () => {
      const trimmedMessage = message.trim();
      if (trimmedMessage) {
        socket.emit('message', {
          userId,
          message: trimmedMessage,
          createdAt: new Date().toISOString()
        });
        setMessage('');
        socket.emit('stopTyping', userId);
      }
    },
    typing: (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMessage = e.target.value;
      setMessage(newMessage);
      socket.emit(newMessage.trim() ? 'typing' : 'stopTyping', userId);
    }
  };

  const handleUsername = {
    submit: () => {
      if (username.trim()) {
        initializeUser(username);
      }
    },
    guest: () => {
      initializeUser(`Guest_${Date.now()}`);
    },
    change: (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    }
  };

  return (
    <>
      <UsernameModal
        visible={isModalVisible}
        username={username}
        onUsernameChange={handleUsername.change}
        onUsernameSubmit={handleUsername.submit}
        onGuestSubmit={handleUsername.guest}
        onCancel={() => {}}
      />
      {userId && (
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ color: 'white', fontSize: '1.5rem' }}>
            <NavLink to="/">
              Chat App
            </NavLink>
          </Header>
          <Content style={{ padding: '20px' }}>
            <TypingIndicator typingUsers={typingUsers} />
            <UserList users={users} />
            <MessageList messages={messages} formatTimestamp={formatTimestamp} />
            <MessageInput 
              message={message} 
              onChange={handleMessage.typing} 
              onSend={handleMessage.send} 
            />
          </Content>
        </Layout>
      )}
    </>
  );
}
