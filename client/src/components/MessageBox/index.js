import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Badge } from '@mui/material';

const MessageContainer = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: 300px;
  height: 400px;
  background: #fff;
`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px #fff`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

const MessageBox = ({socket, allPlayers}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const currentPlayer = allPlayers.find(player => player.socketId === socket.id) || null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        sender: currentPlayer.name,
        socketId: socket.id,
        text: newMessage,
      };
      socket.emit('send-message', message);
      setNewMessage('');
    }
  };

  socket.on('receive-message', (message) => {
    setMessages([...message]);
  });
  

  if(currentPlayer === null){
    return null;
  }

  return(
    <MessageContainer>
      <div className="flex flex-col h-full max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center px-2 py-2 bg-gray-200">
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar>{currentPlayer.name[0]}</Avatar>
        </StyledBadge>
        <h2 className="ml-4 text-lg font-semibold">Chat</h2>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-2 overflow-y-auto no-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className="flex items-center mb-4"
          >
            <p className="text-sm mr-4">{message.sender}:</p>
            <div className="bg-gray-200 p-2 rounded-lg">
              
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex items-center p-2 bg-gray-200"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 mr-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
    </MessageContainer>
  )
}

export default MessageBox;