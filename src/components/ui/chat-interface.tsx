'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { SearchInput } from '@/components/ui/search-input';
import { FormSection } from '@/components/ui/form-section';
import { ArrowUp, Plus, ScanBarcode } from 'lucide-react';
import { addDays } from 'date-fns';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  showCampaigns?: boolean;
  showRetailProducts?: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [retailProductSearch, setRetailProductSearch] = useState('');
  const [isRetailProductDropdownOpen, setIsRetailProductDropdownOpen] = useState(false);
  const [selectedRetailProducts, setSelectedRetailProducts] = useState<string[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Retail products data from line-item template
  const retailProducts = [
    { id: '606983', name: 'Coca-Cola - coca-cola zero fl - 1 liter' },
    { id: '607124', name: 'Pepsi - pepsi max - 1.5 liter' },
    { id: '608456', name: 'Red Bull - energy drink original - 250ml' },
    { id: '609782', name: 'Heineken - premium lager beer - 6x330ml' },
    { id: '610394', name: 'Samsung - galaxy s24 ultra - 256GB' },
    { id: '611205', name: 'iPhone - 15 pro max - 512GB' },
    { id: '612816', name: 'Nike - air max 270 - size 42' },
    { id: '613427', name: 'Adidas - ultraboost 22 - size 43' },
    { id: '614038', name: 'Nutella - hazelnut spread - 750g' },
  ];

  // Check if we're in a menu context and get collapsed state
  React.useEffect(() => {
    // Try to detect sidebar state from DOM
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      const observer = new MutationObserver(() => {
        const isCollapsed = sidebar.getAttribute('data-collapsed') === 'true';
        setCollapsed(isCollapsed);
      });
      observer.observe(sidebar, { attributes: true, attributeFilter: ['data-collapsed'] });
      return () => observer.disconnect();
    }
  }, []);

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

  // Retail products handlers
  const handleRetailProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRetailProductSearch(value);
    setIsRetailProductDropdownOpen(value.length > 0);
  };

  const handleRetailProductClick = () => {
    setIsRetailProductDropdownOpen(true);
  };

  const handleRetailProductSelect = (productId: string) => {
    if (!selectedRetailProducts.includes(productId)) {
      setSelectedRetailProducts([...selectedRetailProducts, productId]);
    }
    setRetailProductSearch('');
    setIsRetailProductDropdownOpen(false);
  };

  const handleRetailProductRemove = (productId: string) => {
    setSelectedRetailProducts(selectedRetailProducts.filter(id => id !== productId));
  };

  const generateKeywordsForProducts = () => {
    if (selectedRetailProducts.length === 0) return;

    const selectedProductNames = selectedRetailProducts.map(id =>
      retailProducts.find(p => p.id === id)?.name || ''
    );

    // Simulate AI generating keywords based on selected products
    const keywordResponse = {
      id: Date.now() + Math.random(),
      text: `Great! I've generated keyword suggestions for your selected products: ${selectedProductNames.join(', ')}. Here are some high-performing keyword recommendations:

**Broad Keywords:**
• ${selectedProductNames[0]?.split(' - ')[0] || 'Product'} alternatives
• Best ${selectedProductNames[0]?.split(' - ')[1] || 'products'}
• ${selectedProductNames[0]?.split(' - ')[0] || 'Brand'} deals

**Long-tail Keywords:**
• "Buy ${selectedProductNames[0]?.toLowerCase() || 'product'} online"
• "${selectedProductNames[0]?.split(' - ')[0] || 'Brand'} ${selectedProductNames[0]?.split(' - ')[1] || 'product'} review"
• "Best price ${selectedProductNames[0]?.toLowerCase() || 'product'}"

These keywords are optimized for your product selection and should help improve your campaign performance.`,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, keywordResponse]);
  };

  const simulateAIResponse = (userMessage: string) => {
    setIsAITyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let aiResponse;

      // Check if user wants to create sponsored products campaign
      if (userMessage.toLowerCase().includes("create a new sponsored products campaign")) {
        aiResponse = {
          id: Date.now() + Math.random(),
          text: "Based on your requirements, I've generated 3 sponsored products campaign proposals with different optimization strategies. Each targets different goals and budget allocations:",
          isUser: false,
          timestamp: new Date(),
          showCampaigns: true
        };
      } else if (userMessage.toLowerCase().includes("keyword") || userMessage.toLowerCase().includes("suggested keywords")) {
        aiResponse = {
          id: Date.now() + Math.random(),
          text: "I'd be happy to help you generate targeted keyword suggestions! To provide the most relevant keywords, please select the retail products you'd like to target in your campaign:",
          isUser: false,
          timestamp: new Date(),
          showRetailProducts: true
        };
      } else {
        const responses = [
          "Thanks for your message! I'm AdGenie AI, here to help with your campaign management. What specific aspect would you like to explore?",
          "Great question! Let me analyze that for you. I can help optimize your campaigns, track performance, and suggest improvements.",
          "I understand you're looking for campaign insights. Based on current data, I can provide recommendations for better ROI.",
          "That's an interesting point about your advertising strategy. Let me break down some optimization opportunities for you.",
          "Perfect! I can definitely assist with that. Here are some data-driven suggestions to improve your campaign performance."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        aiResponse = {
          id: Date.now() + Math.random(),
          text: randomResponse,
          isUser: false,
          timestamp: new Date()
        };
      }

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

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSend();
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
                  onClick={() => handleSuggestionClick("Show me my campaign performance metrics")}
                >
                  <div>
                    <div className="font-medium text-foreground">Campaign Performance</div>
                    <div className="text-sm text-muted-foreground">Show me my campaign metrics</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="text-left p-4 h-auto justify-start hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSuggestionClick("Help me with suggested keywords")}
                >
                  <div>
                    <div className="font-medium text-foreground">Keyword Suggestions</div>
                    <div className="text-sm text-muted-foreground">Help me with suggested keywords</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="text-left p-4 h-auto justify-start hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSuggestionClick("Create a new sponsored products campaign")}
                >
                  <div>
                    <div className="font-medium text-foreground">New Campaign</div>
                    <div className="text-sm text-muted-foreground">Create a sponsored products campaign</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="text-left p-4 h-auto justify-start hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSuggestionClick("Analyze my competitor performance")}
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
                <div key={message.id} className="mb-4">
                  <div
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
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

                  {/* Campaign proposals */}
                  {message.showCampaigns && (
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Campaign 1 - Performance focused */}
                      <CampaignSummary
                        title="Performance Campaign"
                        badge={{ text: "Best ROAS", variant: "default" }}
                        goal="performance-transaction"
                        goalOptions={[
                          { label: 'Performance on transaction', value: 'performance-transaction' },
                          { label: 'Brand awareness', value: 'brand-awareness' },
                          { label: 'Lead generation', value: 'lead-generation' }
                        ]}
                        audience="high-value"
                        audienceOptions={[
                          { label: 'High-value customers', value: 'high-value' },
                          { label: 'Premium customers', value: 'premium' },
                          { label: 'Loyal customers', value: 'loyal' }
                        ]}
                        estimatedRoas="4.8x"
                        budget="$5,000"
                        engines={[
                          { id: 'display', name: 'Display', enabled: true },
                          { id: 'sponsored', name: 'Sponsored products', enabled: true },
                          { id: 'digital', name: 'Digital in-store', enabled: true }
                        ]}
                        dateRange={{
                          from: new Date('2024-01-01'),
                          to: addDays(new Date('2024-01-01'), 30)
                        }}
                        features={[]}
                        onEdit={() => console.log('Edit campaign 1')}
                        onAddToCart={() => console.log('Add campaign 1 to cart')}
                      />

                      {/* Campaign 2 - Brand awareness */}
                      <CampaignSummary
                        title="Brand Awareness Campaign"
                        badge={{ text: "Wide Reach", variant: "secondary" }}
                        goal="brand-awareness"
                        goalOptions={[
                          { label: 'Performance on transaction', value: 'performance-transaction' },
                          { label: 'Brand awareness', value: 'brand-awareness' },
                          { label: 'Lead generation', value: 'lead-generation' }
                        ]}
                        audience="new"
                        audienceOptions={[
                          { label: 'New customers', value: 'new' },
                          { label: 'AH bonus shoppers', value: 'ah-bonus' },
                          { label: 'Premium customers', value: 'premium' }
                        ]}
                        estimatedRoas="3.2x"
                        budget="$7,500"
                        engines={[
                          { id: 'display', name: 'Display', enabled: true },
                          { id: 'sponsored', name: 'Sponsored products', enabled: false },
                          { id: 'digital', name: 'Digital in-store', enabled: true }
                        ]}
                        dateRange={{
                          from: new Date('2024-01-01'),
                          to: addDays(new Date('2024-01-01'), 45)
                        }}
                        features={[]}
                        onEdit={() => console.log('Edit campaign 2')}
                        onAddToCart={() => console.log('Add campaign 2 to cart')}
                      />

                      {/* Campaign 3 - Lead generation */}
                      <CampaignSummary
                        title="Lead Generation Campaign"
                        badge={{ text: "High Conversion", variant: "outline" }}
                        goal="lead-generation"
                        goalOptions={[
                          { label: 'Performance on transaction', value: 'performance-transaction' },
                          { label: 'Brand awareness', value: 'brand-awareness' },
                          { label: 'Lead generation', value: 'lead-generation' }
                        ]}
                        audience="premium"
                        audienceOptions={[
                          { label: 'Premium customers', value: 'premium' },
                          { label: 'Loyal customers', value: 'loyal' },
                          { label: 'High-value customers', value: 'high-value' }
                        ]}
                        estimatedRoas="5.1x"
                        budget="$3,500"
                        engines={[
                          { id: 'display', name: 'Display', enabled: false },
                          { id: 'sponsored', name: 'Sponsored products', enabled: true },
                          { id: 'digital', name: 'Digital in-store', enabled: false }
                        ]}
                        dateRange={{
                          from: new Date('2024-01-15'),
                          to: addDays(new Date('2024-01-15'), 21)
                        }}
                        features={[]}
                        onEdit={() => console.log('Edit campaign 3')}
                        onAddToCart={() => console.log('Add campaign 3 to cart')}
                      />
                    </div>
                  )}

                  {/* Retail Products Selector */}
                  {message.showRetailProducts && (
                    <div className="mt-4">
                      <FormSection title="Retail products">
                        <div className="space-y-4">
                          <div className="relative" data-dropdown-container>
                            <label className="block text-sm font-medium mb-2">Select retail products*</label>
                            <SearchInput
                              value={retailProductSearch}
                              onChange={handleRetailProductSearchChange}
                              onClick={handleRetailProductClick}
                              placeholder="Select product by name or ID..."
                              className="w-full"
                              icon={<ScanBarcode className="w-4 h-4" />}
                            />
                            {isRetailProductDropdownOpen && (
                              <div className="absolute z-50 w-full bg-white border border-input rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                                {retailProducts
                                  .filter(product =>
                                    retailProductSearch === '' ||
                                    product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
                                    product.id.includes(retailProductSearch)
                                  )
                                  .filter(product => !selectedRetailProducts.includes(product.id))
                                  .map(product => (
                                    <div
                                      key={product.id}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                      onClick={() => handleRetailProductSelect(product.id)}
                                    >
                                      <div className="text-sm font-medium">{product.name}</div>
                                      <div className="text-xs text-gray-500">ID: {product.id}</div>
                                    </div>
                                  ))}
                                {retailProducts.filter(product =>
                                  (retailProductSearch === '' ||
                                   product.name.toLowerCase().includes(retailProductSearch.toLowerCase()) ||
                                   product.id.includes(retailProductSearch)) &&
                                  !selectedRetailProducts.includes(product.id)
                                ).length === 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    No products found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Selected products */}
                          {selectedRetailProducts.length > 0 && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Selected products ({selectedRetailProducts.length})</label>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {selectedRetailProducts.map(productId => {
                                  const product = retailProducts.find(p => p.id === productId);
                                  return product ? (
                                    <div key={productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">{product.name}</div>
                                        <div className="text-xs text-gray-500">ID: {product.id}</div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRetailProductRemove(productId)}
                                        className="ml-2 h-6 w-6 p-0"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}

                          {/* Generate Keywords Button */}
                          {selectedRetailProducts.length > 0 && (
                            <div className="pt-4">
                              <Button
                                onClick={generateKeywordsForProducts}
                                className="w-full"
                              >
                                Generate Keywords for Selected Products
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormSection>
                    </div>
                  )}
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