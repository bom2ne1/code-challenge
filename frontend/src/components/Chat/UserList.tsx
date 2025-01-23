import { List, Avatar, Typography } from 'antd';

const { Text } = Typography;

export default function UserList({ users }: { users: string[] }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Users Online</h3>
      <List
        bordered
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <Avatar style={{ backgroundColor: '#87d068' }}>{user[0]}</Avatar>
            <Text style={{ marginLeft: '10px' }}>{user}</Text>
          </List.Item>
        )}
      />
    </div>
  );
}
