'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CampaignSummary } from '@/components/ui/campaign-summary';
import { SearchInput } from '@/components/ui/search-input';
import { FormSection } from '@/components/ui/form-section';
import { MetricCard } from '@/components/ui/card';
import { LineChartComponent } from '@/components/ui/line-chart';
import { ArrowUp, Plus, ScanBarcode, Table, ImagePlus, FileText, Building2, MoreHorizontal, TrendingUp, AlertCircle, ChevronLeft, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';
import { addDays } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Filter, FilterOption } from '@/components/ui/filter';

export interface Message {
  id: number;
  text: string | React.ReactNode;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  showCampaigns?: boolean;
  showRetailProducts?: boolean;
}

export interface ChatInterfaceProps {
  initialMessages?: Message[];
}

export const ChatInterface = ({ initialMessages = [] }: ChatInterfaceProps = {}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isStarted, setIsStarted] = useState(initialMessages.length > 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [retailProductSearch, setRetailProductSearch] = useState('');
  const [isRetailProductDropdownOpen, setIsRetailProductDropdownOpen] = useState(false);
  const [selectedRetailProducts, setSelectedRetailProducts] = useState<string[]>([]);
  const [activeContexts, setActiveContexts] = useState<string[]>([]);
  const [contextSelections, setContextSelections] = useState<Record<string, string[]>>({});
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

  // Context data for filter selection
  const contextData: Record<string, FilterOption[]> = {
    campaign: [
      { label: 'Summer Sale 2024', value: 'camp-001', description: 'Sponsored Products • Active' },
      { label: 'Q1 Brand Awareness', value: 'camp-002', description: 'Display • Completed' },
      { label: 'Holiday Special', value: 'camp-003', description: 'Digital In-Store • Active' },
      { label: 'Spring Collection', value: 'camp-004', description: 'Sponsored Products • Draft' },
      { label: 'Back to School', value: 'camp-005', description: 'Display • Scheduled' },
    ],
    creative: [
      { label: 'Product Banner - Red', value: 'crea-001', description: '1200x628 • Active' },
      { label: 'Hero Image - Blue', value: 'crea-002', description: '1920x1080 • Active' },
      { label: 'Mobile Ad - Green', value: 'crea-003', description: '640x1136 • Draft' },
      { label: 'Video Ad 30s', value: 'crea-004', description: 'MP4 • Review' },
      { label: 'Carousel Set', value: 'crea-005', description: '5 images • Active' },
    ],
    'line-item': [
      { label: 'Premium Placement', value: 'line-001', description: 'Budget: $5,000 • Active' },
      { label: 'Standard Display', value: 'line-002', description: 'Budget: $2,500 • Active' },
      { label: 'Mobile Only', value: 'line-003', description: 'Budget: $1,500 • Paused' },
      { label: 'Weekend Boost', value: 'line-004', description: 'Budget: $3,000 • Scheduled' },
      { label: 'Retargeting Campaign', value: 'line-005', description: 'Budget: $4,000 • Active' },
    ],
    advertiser: [
      { label: 'Coca-Cola Company', value: 'adv-001', description: 'Active campaigns: 12' },
      { label: 'Unilever', value: 'adv-002', description: 'Active campaigns: 8' },
      { label: 'Procter & Gamble', value: 'adv-003', description: 'Active campaigns: 15' },
      { label: 'Nike Inc.', value: 'adv-004', description: 'Active campaigns: 6' },
      { label: 'Samsung Electronics', value: 'adv-005', description: 'Active campaigns: 10' },
    ],
    other: [
      { label: 'Product Category', value: 'other-001', description: 'Beverages' },
      { label: 'Target Audience', value: 'other-002', description: 'Age 25-40' },
      { label: 'Geographic Region', value: 'other-003', description: 'Netherlands' },
      { label: 'Budget Range', value: 'other-004', description: '$1,000 - $5,000' },
    ],
  };

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

    // Generate keyword suggestions based on product names
    const generateKeywords = () => {
      const keywords: { keyword: string; volume: string; competitive: string; }[] = [];
      selectedProductNames.forEach((productName) => {
        const parts = productName.split(' - ');
        const brand = parts[0] || '';
        const productType = parts[1] || '';

        // Generate variations
        if (brand && productType) {
          keywords.push({
            keyword: `${brand.toLowerCase()} ${productType.toLowerCase()}`,
            volume: 'high',
            competitive: 'Medium'
          });
          keywords.push({
            keyword: `${productType.toLowerCase()}`,
            volume: 'medium',
            competitive: 'High'
          });
          keywords.push({
            keyword: `best ${productType.toLowerCase()}`,
            volume: 'medium',
            competitive: 'Medium'
          });
        }
      });
      return keywords.slice(0, 6); // Limit to 6 keywords
    };

    const keywords = generateKeywords();

    // Create keyword placements UI component
    const KeywordPlacementsContent = () => (
      <div className="mt-4">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-semibold">Keywords placements</h3>
            <button className="text-muted-foreground hover:text-foreground">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01"/>
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {keywords.map((kw, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div>
                  <div className="font-medium text-base mb-1 capitalize">{kw.keyword}</div>
                  <div className="text-sm text-muted-foreground">
                    Volume: {kw.volume} <span className="mx-2">|</span> Competitive: {kw.competitive}
                  </div>
                </div>
                <Button
                  size="icon"
                  className="bg-foreground hover:bg-foreground/90 text-background flex-shrink-0"
                  onClick={() => console.log('Add keyword:', kw.keyword)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // Simulate AI generating keywords
    const keywordResponse = {
      id: Date.now() + Math.random(),
      text: (
        <>
          <p className="text-sm mb-4">
            Great! I've generated keyword suggestions for your selected products: {selectedProductNames.join(', ')}.
          </p>
          <KeywordPlacementsContent />
        </>
      ),
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, keywordResponse]);
  };

  const createSpendAnalysisContent = () => {
    const calculateMetrics = (spend: number) => {
      const maxRoas = 600;
      const minRoas = 100;
      const roasRange = maxRoas - minRoas;
      const spendRatio = (spend - 10000) / 40000;
      const roas = maxRoas - (spendRatio * roasRange);

      const baseRevenue = 100;
      const maxRevenue = 500;
      const revenueRange = maxRevenue - baseRevenue;
      const revenue = baseRevenue + (spendRatio * revenueRange);

      return { spend, roas: Math.round(roas), revenue: Math.round(revenue) };
    };

    const generateForecastData = () => {
      const data = [];
      for (let spend = 10; spend <= 50; spend += 2) {
        const metrics = calculateMetrics(spend * 1000);
        data.push({
          spend: `${spend}K`,
          spendValue: spend * 1000,
          roas: metrics.roas,
          revenue: metrics.revenue,
        });
      }
      return data;
    };

    const forecastData = generateForecastData();

    const forecastConfig = {
      roas: {
        label: "ROAS",
        color: "hsl(var(--chart-1))",
      },
      revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))",
      },
    };

    return (
      <>
        <p className="text-sm mb-4">Based on your campaign performance, I recommend increasing your spend. Here's why:</p>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <MetricCard
            label="ROAS Performance"
            value="4.2x"
            subMetric="Above target (3.0x)"
            badgeValue="+40%"
            badgeVariant="success"
          />
          <MetricCard
            label="Budget Usage"
            value="95%"
            subMetric="Near depletion"
            badgeValue="High demand"
            badgeVariant="warning"
          />
          <MetricCard
            label="Opportunity Cost"
            value="$12.5K"
            subMetric="Potential lost revenue"
            badgeValue="High"
            badgeVariant="destructive"
          />
        </div>

        {/* Forecast Chart */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-3">Spend vs Performance Forecast</p>
          <div className="bg-white rounded-lg p-4">
            <LineChartComponent
              data={forecastData}
              config={forecastConfig}
              showLegend={true}
              showGrid={true}
              showTooltip={true}
              showXAxis={true}
              showYAxis={true}
              className="h-[300px] w-full"
              xAxisDataKey="spend"
              yAxisLabel="Revenue"
              secondaryYAxis={{
                dataKey: "roas",
                domain: [0, 700],
                label: "ROAS"
              }}
            />
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p><strong>Key insights:</strong></p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span><strong>High ROAS:</strong> Your campaign is generating $4.20 for every $1 spent, which is 40% above your target of 3.0x</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span><strong>Budget Constraint:</strong> You've used 95% of your allocated budget with 2 weeks remaining in the campaign period</span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span><strong>Growth Potential:</strong> Based on current conversion rates, increasing spend by $15K could generate an additional $63K in revenue</span>
            </li>
          </ul>

          <p className="pt-2"><strong>Recommendation:</strong> Increase your campaign budget by $15,000 to capitalize on the high performance and avoid missing out on potential revenue during the remaining campaign period.</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4 pt-4">
          <Button>
            Increase Budget
          </Button>
          <Button variant="outline">
            Show Campaign Details
          </Button>
        </div>
      </>
    );
  };

  const simulateAIResponse = (userMessage: string) => {
    setIsAITyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let aiResponse;

      // Check if user wants budget recommendation
      if (userMessage.toLowerCase().includes("budget recommendation")) {
        aiResponse = {
          id: Date.now() + Math.random(),
          text: createSpendAnalysisContent(),
          isUser: false,
          timestamp: new Date()
        };
      } else if (userMessage.toLowerCase().includes("create a new sponsored products campaign")) {
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
          "Thanks for your message! I'm CampaignAI, here to help with your campaign management. What specific aspect would you like to explore?",
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

  const handleNotificationClick = (notificationType: string) => {
    if (!isStarted) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsStarted(true);
        setIsAnimating(false);
      }, 600);
    }

    // Create user message based on notification type
    let userMessage = '';
    if (notificationType === 'budget-recommendation') {
      userMessage = 'Show me budget recommendation for Summer Sale campaign';
    } else if (notificationType === 'ctr-optimization') {
      userMessage = 'How can I improve CTR for Spring Sale campaign?';
    } else if (notificationType === 'timing-optimization') {
      userMessage = 'Tell me more about Banner_Summer_v2 engagement timing';
    }

    const newMessage = {
      id: Date.now(),
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      simulateAIResponse(userMessage);
    }, isStarted ? 500 : 1100);
  };

  const handleContextSelect = (type: string) => {
    if (!activeContexts.includes(type)) {
      setActiveContexts([...activeContexts, type]);
      setContextSelections({ ...contextSelections, [type]: [] });
    }
  };

  const handleFilterChange = (type: string, values: string[]) => {
    setContextSelections({ ...contextSelections, [type]: values });
  };

  const handleRemoveContext = (type: string) => {
    setActiveContexts(activeContexts.filter(t => t !== type));
    const newSelections = { ...contextSelections };
    delete newSelections[type];
    setContextSelections(newSelections);
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
                <div className="flex flex-col border border-input rounded-xl bg-white shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring w-full p-3">
                  <div className="flex items-center gap-2">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a question..."
                      className="flex-1 border-0 focus:outline-none text-base resize-none min-h-[24px] max-h-[120px] bg-transparent"
                      disabled={isAnimating}
                      rows={1}
                    />
                    <div className="flex items-center gap-1 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        disabled={isAnimating}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onSelect={() => handleContextSelect('campaign')}>
                        <Table className="mr-2 h-4 w-4" />
                        <span>Campaign</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleContextSelect('creative')}>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        <span>Creative</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleContextSelect('line-item')}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Line-item</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleContextSelect('advertiser')}>
                        <Building2 className="mr-2 h-4 w-4" />
                        <span>Advertiser</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => handleContextSelect('other')}>
                        <MoreHorizontal className="mr-2 h-4 w-4" />
                        <span>Other</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                        <Button
                          onClick={handleSend}
                          disabled={!inputValue.trim() || isAnimating}
                          size="icon"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-100"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {activeContexts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {activeContexts.map((type) => (
                          <Filter
                            key={type}
                            name={`Select ${type}`}
                            options={contextData[type] || []}
                            selectedValues={contextSelections[type] || []}
                            onChange={(values) => handleFilterChange(type, values)}
                            className="text-sm"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              {/* Suggestion cards below input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
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
                  onClick={() => handleSuggestionClick("Show me budget recommendation for Summer Sale campaign")}
                >
                  <div>
                    <div className="font-medium text-foreground">Budget recommendation Summer Sale</div>
                    <div className="text-sm text-muted-foreground">Opportunity: $12.5K potential lost revenue</div>
                  </div>
                </Button>
              </div>

              {/* AI Notifications Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">AI Notifications</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                    View all
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* AI Notification 1 */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-muted-foreground hover:text-primary"
                      onClick={() => handleNotificationClick('ctr-optimization')}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Badge variant="info" className="flex-shrink-0 whitespace-nowrap min-w-0">
                      AI Insight
                    </Badge>
                    <p className="text-sm text-foreground flex-1 min-w-0">
                      Campaign <button className="text-primary underline underline-offset-4 font-medium">"Spring Sale"</button> could improve CTR by 23% with optimized targeting parameters.
                    </p>
                  </div>

                  {/* AI Notification 2 */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-muted-foreground hover:text-primary"
                      onClick={() => handleNotificationClick('timing-optimization')}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Badge variant="info" className="flex-shrink-0 whitespace-nowrap min-w-0">
                      AI Insight
                    </Badge>
                    <p className="text-sm text-foreground flex-1 min-w-0">
                      Creative <button className="text-primary underline underline-offset-4 font-medium">"Banner_Summer_v2"</button> shows 34% higher engagement in evening time slots.
                    </p>
                  </div>

                  {/* AI Notification 3 - Budget Recommendation */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-muted-foreground hover:text-primary"
                      onClick={() => handleNotificationClick('budget-recommendation')}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Badge variant="warning" className="flex-shrink-0 whitespace-nowrap min-w-0">
                      Budget Alert
                    </Badge>
                    <p className="text-sm text-foreground flex-1 min-w-0">
                      Campaign <button className="text-primary underline underline-offset-4 font-medium">"Summer Sale"</button> budget recommendation. Opportunity: $12.5K potential lost revenue.
                    </p>
                  </div>
                </div>
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
                      className={`${message.isUser ? 'max-w-[70%]' : 'max-w-[85%]'} rounded-2xl px-4 py-3 ${
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

                      {/* Campaign proposals inside reply card */}
                      {message.showCampaigns && (
                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        </div>
                      )}

                      {/* Retail Products Selector inside reply card */}
                      {message.showRetailProducts && (
                        <div className="mt-4">
                          <FormSection title="Retail products" className="bg-white rounded-lg">
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
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isAITyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted text-muted-foreground rounded-2xl px-4 py-3 max-w-[70%]">
                    <div className="flex items-center space-x-1">
                      <div className="text-sm">CampaignAI is typing</div>
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
          <div className="flex flex-col border border-input rounded-xl bg-white shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring w-full p-3">
            <div className="flex items-center gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask a follow-up question..."
                className="flex-1 border-0 focus:outline-none text-base resize-none min-h-[24px] max-h-[120px] bg-transparent"
                disabled={isAnimating || isAITyping}
                rows={1}
              />
              <div className="flex items-center gap-1 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={isAnimating || isAITyping}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onSelect={() => handleContextSelect('campaign')}>
                  <Table className="mr-2 h-4 w-4" />
                  <span>Campaign</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleContextSelect('creative')}>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  <span>Creative</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleContextSelect('line-item')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Line-item</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleContextSelect('advertiser')}>
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Advertiser</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleContextSelect('other')}>
                  <MoreHorizontal className="mr-2 h-4 w-4" />
                  <span>Other</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isAnimating || isAITyping}
                    size="icon"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-100"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {activeContexts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {activeContexts.map((type) => (
                    <Filter
                      key={type}
                      name={`Select ${type}`}
                      options={contextData[type] || []}
                      selectedValues={contextSelections[type] || []}
                      onChange={(values) => handleFilterChange(type, values)}
                      className="text-sm"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};