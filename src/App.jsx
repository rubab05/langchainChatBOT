import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

function App() {
    const [messages, setMessages] = useState([
        {
            message: 'Hello I am FASTbot, here to answer all your queries regarding FAST NUCES! ',
            sentTime: 'just now',
            sender: 'Chatbot',
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: 'user',
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        setIsTyping(true);
        await processMessageToChatbot(newMessages);
    };

    async function processMessageToChatbot(chatMessages) {
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: chatMessages[chatMessages.length - 1].message }),
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/bot/query', config); //insert your local FASTAPI here
            const data = await response.json();
            console.log('Response from backend:', data);
            const newResponseMessage = {
                message: data.response,
                sender: 'Chatbot',
            };

            setMessages([...chatMessages, newResponseMessage]);
            setIsTyping(false);
        } catch (error) {
            console.error('Error sending message to backend:', error);
        }
    }

    return (
        <div className="App">
            <div style={{ position: 'relative', height: '800px', width: '700px' }}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content="Chatbot is typing" /> : null}
                        >
                            {messages.map((message, i) => {
                                console.log(message);
                                return <Message key={i} model={message} />;
                            })}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default App;
