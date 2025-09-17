import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../app-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { defaultRoutes } from '../default-routes';
import { MenuContextProvider } from '@/contexts/menu-context';
import { useMenu } from '@/hooks/use-menu';
import React, { useState } from 'react';
import { MessageSquare, ArrowUp, Plus } from 'lucide-react';

const meta: Meta<typeof AppLayout> = {
  title: 'Page templates/Chat',
  component: AppLayout,
  parameters: { 
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Chat Page Template

The Chat page template provides a conversational interface for AI-powered interactions. It offers a clean layout structure optimized for chat-based applications and messaging.

## Features

- **Full-screen layout**: Utilizes the entire viewport for maximum chat area
- **AppLayout integration**: Built on top of the AppLayout component with navigation and user management
- **Flexible content area**: Ready-to-use content container for chat interfaces and messaging components
- **Responsive design**: Adapts to different screen sizes seamlessly

## Usage

This template is ideal for:
- AI chat interfaces
- Customer support chat pages
- Conversational AI applications
- Messaging and communication tools

## Components Used

- AppLayout (navigation, user management, breadcrumbs)
- Card (content containers)
- CardHeader, CardTitle, CardDescription (content structure)
- CardContent (main content area)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ChatInterface = () => {
  const [messages, setMessages] = useState<Array<{
    id: number, 
    text: string, 
    isUser: boolean, 
    timestamp: Date,
    isTyping?: boolean
  }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const { collapsed } = useMenu();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input after sending
  React.useEffect(() => {
    if (inputRef.current && isStarted && !isAITyping) {
      inputRef.current.focus();
    }
  }, [isStarted, isAITyping]);

  const simulateAIResponse = (userMessage: string) => {
    setIsAITyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      const responses = [
        "Thanks for your message! I'm AdGenie AI, here to help with your campaign management. What specific aspect would you like to explore?",
        "Great question! Let me analyze that for you. I can help optimize your campaigns, track performance, and suggest improvements.",
        "I understand you're looking for campaign insights. Based on current data, I can provide recommendations for better ROI.",
        "That's an interesting point about your advertising strategy. Let me break down some optimization opportunities for you.",
        "Perfect! I can definitely assist with that. Here are some data-driven suggestions to improve your campaign performance."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse = {
        id: Date.now() + Math.random(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsAITyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    if (!isStarted) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsStarted(true);
        setIsAnimating(false);
      }, 600);
    }
    
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    const currentMessage = inputValue;
    setInputValue('');
    
    // Simulate AI response with more realistic behavior
    setTimeout(() => {
      simulateAIResponse(currentMessage);
    }, isStarted ? 500 : 1100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Max 120px height
  };


  // Single container structure that handles all states
  return (
    <>
      <style>{`
        /* Override AppLayout for chat template - allow page to grow */
        .w-full.p-6.pb-24.min-h-screen.bg-slate-50.overflow-x-hidden {
          min-height: auto !important;
          padding: 0 !important;
          overflow: visible !important;
          background: transparent !important;
        }
      `}</style>
      <div className="w-full bg-slate-50 min-h-screen">
      {/* Content area that shows/hides based on state */}
      <div className="flex flex-col">
        {/* Initial centered content - only show when not started and not animating */}
        {!isStarted && !isAnimating && (
          <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
            <div className="w-full max-w-[800px]">
              {/* Input field */}
              <div className="mb-8">
                <div className="flex items-end border border-input rounded-xl bg-white shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring w-full px-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="flex-1 border-0 focus:outline-none text-base px-3 py-4 resize-none min-h-[48px] max-h-[120px] bg-transparent"
                    disabled={isAnimating}
                    rows={1}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-1 h-8 w-8 text-muted-foreground hover:text-foreground mb-2"
                    disabled={isAnimating}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isAnimating}
                    size="icon"
                    className="mr-2 h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 mb-2"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Suggestion cards below input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="text-left p-4 h-auto justify-start hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setInputValue("Show me my campaign performance metrics");
                    handleSend();
                  }}
                >
                  <div>
                    <div className="font-medium text-foreground">Campaign Performance</div>
                    <div className="text-sm text-muted-foreground">Show me my campaign metrics</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="text-left p-4 h-auto justify-start hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setInputValue("Help me optimize my ad spend budget");
                    handleSend();
                  }}
                >
                  <div>
                    <div className="font-medium text-foreground">Budget Optimization</div>
                    <div className="text-sm text-muted-foreground">Optimize my ad spend budget</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="text-left p-4 h-auto justify-start hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setInputValue("Create a new sponsored products campaign");
                    handleSend();
                  }}
                >
                  <div>
                    <div className="font-medium text-foreground">New Campaign</div>
                    <div className="text-sm text-muted-foreground">Create a sponsored products campaign</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="text-left p-4 h-auto justify-start hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setInputValue("Analyze my competitor performance");
                    handleSend();
                  }}
                >
                  <div>
                    <div className="font-medium text-foreground">Competitor Analysis</div>
                    <div className="text-sm text-muted-foreground">Analyze competitor performance</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Chat messages - only show when conversation started */}
        {isStarted && (
          <div className="px-4 py-6">
            <div className="max-w-[800px] mx-auto pb-24">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    } shadow-sm`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isAITyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted text-muted-foreground rounded-2xl px-4 py-3 max-w-[70%]">
                    <div className="flex items-center space-x-1">
                      <div className="text-sm">AdGenie AI is typing</div>
                      <div className="flex space-x-1 ml-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>
      
      {/* Input area - fixed at bottom only during chat state */}
      {isStarted && (
        <div 
          className="fixed bottom-6 transition-all duration-500 ease-in-out z-50"
          style={{
            left: collapsed ? '96px' : '309px',
            right: '24px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <div className="flex items-end border border-input rounded-xl bg-white shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring w-full px-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask a follow-up question..."
              className="flex-1 border-0 focus:outline-none text-base px-3 py-4 resize-none min-h-[48px] max-h-[120px] bg-transparent"
              disabled={isAnimating || isAITyping}
              rows={1}
            />
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 h-8 w-8 text-muted-foreground hover:text-foreground mb-2"
              disabled={isAnimating || isAITyping}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isAnimating || isAITyping}
              size="icon"
              className="mr-2 h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 mb-2"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};


export const Chat: Story = {
  args: {
    routes: defaultRoutes,
    logo: { src: '/next.svg', alt: 'Logo', width: 40, height: 40 },
    user: { name: 'Jane Doe', avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&size=32' },
    onLogout: () => alert('Logout clicked'),
    breadcrumbProps: {},
    pageHeaderProps: {
      title: 'AdGenie Chat',
      subtitle: 'AI-powered conversational interface for campaign management',
      headerRight: null,
      onEdit: () => alert('Edit clicked'),
      onExport: () => alert('Export clicked'),
      onImport: () => alert('Import clicked'),
      onSettings: () => alert('Settings clicked'),
    },
    children: <ChatInterface />,
  },
  render: (args) => (
    <MenuContextProvider>
      <AppLayout {...args} />
    </MenuContextProvider>
  ),
}; 