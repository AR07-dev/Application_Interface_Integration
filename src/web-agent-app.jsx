import React, { useState, useRef, useEffect } from 'react';
import { Send, Play, Square, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const WebAgentApp = () => {
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);
  const [currentStep, setCurrentStep] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [selectedApp, setSelectedApp] = useState('linkedin');
  const iframeRef = useRef(null);

  // Simulated browser automation agent
  const executeAction = async (userPrompt) => {
    setIsExecuting(true);
    setExecutionLog([]);
    setCurrentStep('Analyzing request...');
    
    // Step 1: Parse the prompt using Claude API
    await addLog('info', 'Parsing user intent from prompt...');
    await delay(800);
    
    const intent = await parseIntent(userPrompt);
    await addLog('success', `Intent identified: ${intent.action}`);
    await delay(500);

    // Step 2: Plan execution steps
    await addLog('info', 'Planning execution steps...');
    setCurrentStep('Planning navigation...');
    await delay(600);
    
    const steps = await planSteps(intent);
    await addLog('success', `Generated ${steps.length} steps`);
    
    // Step 3: Execute each step
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(`Step ${i + 1}/${steps.length}: ${step.description}`);
      await addLog('info', `Executing: ${step.description}`);
      
      // Simulate browser interaction
      await executeStep(step);
      await delay(1000);
      
      await addLog('success', `✓ ${step.description}`);
    }
    
    setCurrentStep('Completed!');
    await addLog('success', '🎉 Task completed successfully!');
    setIsExecuting(false);
  };

  const parseIntent = async (prompt) => {
    // This would call Claude API to parse the prompt
    // For demo, we'll simulate the parsing
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('send message') || lowerPrompt.includes('message')) {
      const contactMatch = prompt.match(/to\s+([a-zA-Z\s]+)/i);
      const messageMatch = prompt.match(/["""](.+)["""]/);
      
      return {
        action: 'send_message',
        platform: selectedApp,
        contact: contactMatch ? contactMatch[1].trim() : 'John Doe',
        message: messageMatch ? messageMatch[1] : 'Hello!'
      };
    } else if (lowerPrompt.includes('post') || lowerPrompt.includes('share')) {
      return {
        action: 'create_post',
        platform: selectedApp,
        content: prompt
      };
    } else if (lowerPrompt.includes('connect') || lowerPrompt.includes('add')) {
      return {
        action: 'send_connection',
        platform: selectedApp,
        profile: 'Jane Smith'
      };
    }
    
    return {
      action: 'navigate',
      platform: selectedApp,
      destination: 'home'
    };
  };

  const planSteps = async (intent) => {
    const steps = [];
    
    if (intent.action === 'send_message') {
      steps.push(
        { type: 'navigate', description: 'Navigate to LinkedIn home page', url: '/' },
        { type: 'click', description: 'Click on Messaging icon', selector: '[data-nav="messaging"]' },
        { type: 'wait', description: 'Wait for messaging panel to load', duration: 500 },
        { type: 'click', description: `Search for contact: ${intent.contact}`, selector: 'input[placeholder="Search messages"]' },
        { type: 'type', description: `Type contact name: ${intent.contact}`, text: intent.contact },
        { type: 'wait', description: 'Wait for search results', duration: 800 },
        { type: 'click', description: 'Select contact from results', selector: '.msg-conversation-card' },
        { type: 'click', description: 'Click message input field', selector: '.msg-form__contenteditable' },
        { type: 'type', description: `Type message: "${intent.message}"`, text: intent.message },
        { type: 'click', description: 'Click Send button', selector: 'button[type="submit"]' }
      );
    } else if (intent.action === 'create_post') {
      steps.push(
        { type: 'navigate', description: 'Navigate to LinkedIn feed', url: '/feed' },
        { type: 'click', description: 'Click "Start a post" button', selector: '.share-box-feed-entry__trigger' },
        { type: 'wait', description: 'Wait for post modal', duration: 500 },
        { type: 'type', description: 'Type post content', text: intent.content },
        { type: 'click', description: 'Click Post button', selector: 'button.share-actions__primary-action' }
      );
    } else if (intent.action === 'send_connection') {
      steps.push(
        { type: 'navigate', description: 'Navigate to LinkedIn search', url: '/search/people' },
        { type: 'type', description: `Search for: ${intent.profile}`, text: intent.profile },
        { type: 'wait', description: 'Wait for search results', duration: 1000 },
        { type: 'click', description: `Open profile: ${intent.profile}`, selector: '.entity-result' },
        { type: 'wait', description: 'Wait for profile to load', duration: 800 },
        { type: 'click', description: 'Click Connect button', selector: 'button[aria-label*="Connect"]' },
        { type: 'wait', description: 'Wait for connection modal', duration: 500 },
        { type: 'click', description: 'Confirm connection request', selector: 'button[aria-label="Send now"]' }
      );
    }
    
    return steps;
  };

  const executeStep = async (step) => {
    // Simulate executing the step
    // In a real implementation, this would use Puppeteer, Playwright, or browser extension APIs
    switch (step.type) {
      case 'navigate':
        simulateNavigation(step.url);
        break;
      case 'click':
        simulateClick(step.selector);
        break;
      case 'type':
        simulateTyping(step.text);
        break;
      case 'wait':
        await delay(step.duration || 500);
        break;
    }
  };

  const simulateNavigation = (url) => {
    // Visual feedback for navigation
    if (iframeRef.current && showPreview) {
      // In production, this would navigate the iframe or browser
      console.log(`Navigating to: ${url}`);
    }
  };

  const simulateClick = (selector) => {
    console.log(`Clicking element: ${selector}`);
    // Visual highlight effect could be added here
  };

  const simulateTyping = (text) => {
    console.log(`Typing: ${text}`);
  };

  const addLog = async (type, message) => {
    setExecutionLog(prev => [...prev, { 
      type, 
      message, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
    await delay(100);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isExecuting) {
      executeAction(prompt);
    }
  };

  const stopExecution = () => {
    setIsExecuting(false);
    setCurrentStep('Stopped by user');
    addLog('warning', 'Execution stopped by user');
  };

  const examplePrompts = [
    'Send a message to John Smith saying "Hey, would love to connect about the project"',
    'Create a post sharing my latest article on AI trends',
    'Send a connection request to Sarah Johnson with a note',
    'Search for software engineer jobs in San Francisco',
    'Like and comment on recent posts from my network'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Agentic Web Automation
          </h1>
          <p className="text-slate-300">AI-powered browser agent that interacts with web applications</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Control & Logs */}
          <div className="space-y-6">
            {/* Application Selector */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <label className="block text-sm font-medium mb-3 text-slate-300">
                Select Application
              </label>
              <select 
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isExecuting}
              >
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="gmail">Gmail</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            {/* Prompt Input */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    What would you like to do?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Send a message to John Smith saying 'Hello!'"
                    className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                    disabled={isExecuting}
                  />
                </div>
                
                <div className="flex gap-3">
                  {!isExecuting ? (
                    <button
                      type="submit"
                      disabled={!prompt.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      <Play size={20} />
                      Execute
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopExecution}
                      className="flex-1 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      <Square size={20} />
                      Stop
                    </button>
                  )}
                </div>
              </form>

              {/* Example Prompts */}
              <div className="mt-4">
                <p className="text-xs text-slate-400 mb-2">Try these examples:</p>
                <div className="space-y-2">
                  {examplePrompts.slice(0, 3).map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(example)}
                      disabled={isExecuting}
                      className="w-full text-left text-xs bg-slate-700/50 hover:bg-slate-700 px-3 py-2 rounded border border-slate-600 transition-colors disabled:opacity-50"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Step */}
            {isExecuting && (
              <div className="bg-blue-900/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700 flex items-center gap-3">
                <Loader2 className="animate-spin" size={24} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-300">Current Action</p>
                  <p className="text-white">{currentStep}</p>
                </div>
              </div>
            )}

            {/* Execution Log */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Execution Log</h3>
                {executionLog.length > 0 && (
                  <button
                    onClick={() => setExecutionLog([])}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {executionLog.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">
                    No actions executed yet
                  </p>
                ) : (
                  executionLog.map((log, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        log.type === 'success' ? 'bg-green-900/20 border border-green-800' :
                        log.type === 'error' ? 'bg-red-900/20 border border-red-800' :
                        log.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-800' :
                        'bg-slate-700/30 border border-slate-600'
                      }`}
                    >
                      {log.type === 'success' ? <CheckCircle2 size={18} className="text-green-400 mt-0.5" /> :
                       log.type === 'error' ? <AlertCircle size={18} className="text-red-400 mt-0.5" /> :
                       log.type === 'warning' ? <AlertCircle size={18} className="text-yellow-400 mt-0.5" /> :
                       <Loader2 size={18} className="text-blue-400 animate-spin mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm break-words">{log.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Browser Preview */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-slate-300">Browser Preview</span>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {showPreview ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              
              {showPreview ? (
                <div className="aspect-video bg-slate-900 relative">
                  {/* Simulated LinkedIn Interface */}
                  <div className="absolute inset-0 p-6">
                    <div className="bg-white rounded-lg h-full overflow-hidden">
                      {/* LinkedIn Header */}
                      <div className="bg-[#0a66c2] h-14 flex items-center px-4 gap-4">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                          <span className="text-[#0a66c2] font-bold text-sm">in</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Search"
                          className="flex-1 bg-[#f3f6f8] px-3 py-1.5 rounded text-sm text-black"
                          readOnly
                        />
                        <div className="flex gap-4 text-white text-xs">
                          <div className="text-center">Home</div>
                          <div className="text-center">Network</div>
                          <div className="text-center">Jobs</div>
                          <div className="text-center">Messaging</div>
                        </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-6 bg-[#f3f6f8] h-full">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                              <div className="h-2 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                          </div>
                          
                          {isExecuting && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-xs text-blue-800">
                                Agent is interacting with this page...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 flex items-center justify-center">
                  <p className="text-slate-400">Preview hidden</p>
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="font-semibold mb-3">How It Works</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    1
                  </div>
                  <p><strong>Intent Parsing:</strong> Claude analyzes your natural language prompt to understand the desired action</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    2
                  </div>
                  <p><strong>Step Planning:</strong> The agent generates a sequence of browser actions (navigate, click, type)</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    3
                  </div>
                  <p><strong>Execution:</strong> Each step is executed with real-time visual feedback showing the navigation flow</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    4
                  </div>
                  <p><strong>Verification:</strong> The agent confirms successful completion of each action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebAgentApp;