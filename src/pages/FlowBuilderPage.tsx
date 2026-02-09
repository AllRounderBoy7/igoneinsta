import { useState } from 'react';
import { GitBranch, Plus, MessageCircle, Clock, Split, Zap, ArrowRight, X, Trash2, Save, ChevronDown, ChevronUp, ArrowDown, HelpCircle, Check } from 'lucide-react';

interface FlowNode {
  id: string;
  type: 'trigger' | 'message' | 'condition' | 'delay' | 'action';
  label: string;
  content: string;
}

export function FlowBuilderPage() {
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: '1', type: 'trigger', label: 'When user sends DM', content: 'Keyword: INFO' },
    { id: '2', type: 'message', label: 'Send Message', content: 'Hey {{name}}! Thanks for reaching out! 🎉' },
    { id: '3', type: 'delay', label: 'Wait', content: '2 seconds' },
    { id: '4', type: 'condition', label: 'Check if Follower', content: 'Is user following you?' },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  type NodeType = 'trigger' | 'message' | 'condition' | 'delay' | 'action';
  
  const nodeConfig: Record<NodeType, { color: string; bgColor: string; icon: typeof Zap; emoji: string }> = {
    trigger: { color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', icon: Zap, emoji: '⚡' },
    message: { color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', icon: MessageCircle, emoji: '💬' },
    condition: { color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200', icon: Split, emoji: '🔀' },
    delay: { color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', icon: Clock, emoji: '⏰' },
    action: { color: 'text-pink-600', bgColor: 'bg-pink-50 border-pink-200', icon: ArrowRight, emoji: '🎯' },
  };

  const stepTypes = [
    { type: 'trigger' as NodeType, name: 'Trigger', desc: 'Start when keyword detected', emoji: '⚡' },
    { type: 'message' as NodeType, name: 'Send Message', desc: 'Send a message to user', emoji: '💬' },
    { type: 'condition' as NodeType, name: 'Condition', desc: 'Check and branch flow', emoji: '🔀' },
    { type: 'delay' as NodeType, name: 'Wait/Delay', desc: 'Pause before next step', emoji: '⏰' },
    { type: 'action' as NodeType, name: 'Action', desc: 'Add tag, save data, etc', emoji: '🎯' },
  ];

  const handleSelectNode = (node: FlowNode) => {
    setSelectedNode(node.id);
    setEditContent(node.content);
    setEditLabel(node.label);
  };

  const handleSaveNode = () => {
    if (selectedNode) {
      setNodes(nodes.map(n => n.id === selectedNode ? { ...n, content: editContent, label: editLabel } : n));
      setSelectedNode(null);
    }
  };

  const handleAddNode = (type: NodeType) => {
    const typeInfo = stepTypes.find(s => s.type === type);
    const newNode: FlowNode = {
      id: Date.now().toString(),
      type,
      label: typeInfo?.name || 'New Step',
      content: 'Click to configure...',
    };
    setNodes([...nodes, newNode]);
    setShowAddMenu(false);
    setSelectedNode(newNode.id);
    setEditContent(newNode.content);
    setEditLabel(newNode.label);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const moveNode = (id: string, direction: 'up' | 'down') => {
    const idx = nodes.findIndex(n => n.id === id);
    if (direction === 'up' && idx > 0) {
      const newNodes = [...nodes];
      [newNodes[idx - 1], newNodes[idx]] = [newNodes[idx], newNodes[idx - 1]];
      setNodes(newNodes);
    } else if (direction === 'down' && idx < nodes.length - 1) {
      const newNodes = [...nodes];
      [newNodes[idx], newNodes[idx + 1]] = [newNodes[idx + 1], newNodes[idx]];
      setNodes(newNodes);
    }
  };

  const loadTemplate = (templateName: string) => {
    const templates: Record<string, FlowNode[]> = {
      'lead': [
        { id: '1', type: 'trigger', label: 'Keyword Trigger', content: 'Keywords: INFO, PRICE, DETAILS' },
        { id: '2', type: 'message', label: 'Welcome Message', content: 'Hey {{name}}! 👋 Thanks for reaching out!' },
        { id: '3', type: 'message', label: 'Ask Interest', content: 'What product are you interested in?' },
        { id: '4', type: 'condition', label: 'Check Response', content: 'Did user reply?' },
        { id: '5', type: 'action', label: 'Add Tag', content: 'Tag as: interested_lead' },
      ],
      'product': [
        { id: '1', type: 'trigger', label: 'Keyword Trigger', content: 'Keywords: SHOP, BUY, CATALOG' },
        { id: '2', type: 'message', label: 'Product Catalog', content: 'Here are our products! 🛍️' },
        { id: '3', type: 'delay', label: 'Wait', content: '3 seconds' },
        { id: '4', type: 'message', label: 'Follow Up', content: 'Any questions? Just reply!' },
      ],
      'support': [
        { id: '1', type: 'trigger', label: 'Keyword Trigger', content: 'Keywords: HELP, SUPPORT, ISSUE' },
        { id: '2', type: 'message', label: 'Support Welcome', content: 'Hi {{name}}, sorry to hear you need help! 😊' },
        { id: '3', type: 'message', label: 'Ask Issue', content: 'Can you describe your issue briefly?' },
        { id: '4', type: 'action', label: 'Create Ticket', content: 'Create support ticket' },
      ],
      'welcome': [
        { id: '1', type: 'trigger', label: 'New Follower', content: 'When someone follows you' },
        { id: '2', type: 'delay', label: 'Wait', content: '10 seconds' },
        { id: '3', type: 'message', label: 'Welcome DM', content: 'Hey {{name}}! 👋 Welcome to our community! 🎉' },
        { id: '4', type: 'message', label: 'Offer', content: 'Use code WELCOME10 for 10% off your first order!' },
      ],
    };
    if (templates[templateName]) {
      setNodes(templates[templateName]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Flow Builder</h1>
          <p className="text-gray-500 text-sm mt-1">Create visual conversation flows</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGuide(!showGuide)} 
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm border ${showGuide ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            <HelpCircle size={16} /> {showGuide ? 'Hide Guide' : 'Show Guide'}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold text-sm">
            <Save size={16} /> Save Flow
          </button>
        </div>
      </div>

      {/* Guide */}
      {showGuide && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">📖 How to Use Flow Builder</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="bg-white rounded-xl p-3 border border-blue-100">
              <div className="text-2xl mb-1">1️⃣</div>
              <strong className="text-gray-800">Add Steps</strong>
              <p className="text-xs text-gray-500 mt-1">Click the "Add Step" button below to add trigger, message, delay, etc.</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-100">
              <div className="text-2xl mb-1">2️⃣</div>
              <strong className="text-gray-800">Configure</strong>
              <p className="text-xs text-gray-500 mt-1">Tap on any step to edit its content and settings.</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-100">
              <div className="text-2xl mb-1">3️⃣</div>
              <strong className="text-gray-800">Reorder</strong>
              <p className="text-xs text-gray-500 mt-1">Use ↑↓ arrows to change the order of steps.</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-100">
              <div className="text-2xl mb-1">4️⃣</div>
              <strong className="text-gray-800">Save</strong>
              <p className="text-xs text-gray-500 mt-1">Click "Save Flow" when done. Your flow will be active!</p>
            </div>
          </div>
        </div>
      )}

      {/* Templates */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">🎨</span> Quick Templates
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'lead', name: 'Lead Capture', emoji: '🎯', color: 'from-purple-500 to-pink-500' },
            { id: 'product', name: 'Product Inquiry', emoji: '🛍️', color: 'from-blue-500 to-cyan-500' },
            { id: 'support', name: 'Support Flow', emoji: '🎫', color: 'from-orange-500 to-amber-500' },
            { id: 'welcome', name: 'Welcome Flow', emoji: '👋', color: 'from-green-500 to-emerald-500' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => loadTemplate(t.id)}
              className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-lg mb-2`}>
                {t.emoji}
              </div>
              <p className="font-semibold text-gray-900 text-sm group-hover:text-purple-700">{t.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Add Step Button */}
      <div className="relative">
        <button 
          onClick={() => setShowAddMenu(!showAddMenu)} 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-purple-200 hover:shadow-xl transition-all w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Step
          <ChevronDown size={16} className={`transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Add Menu */}
        {showAddMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)} />
            <div className="absolute left-0 right-0 sm:right-auto top-14 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-scale-in">
              <div className="p-2">
                <p className="text-xs text-gray-400 font-medium px-3 py-2 uppercase">Select Step Type</p>
                {stepTypes.map((step) => (
                  <button 
                    key={step.type} 
                    onClick={() => handleAddNode(step.type)} 
                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl ${nodeConfig[step.type].bgColor} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {step.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{step.name}</p>
                      <p className="text-xs text-gray-500">{step.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Flow Steps */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <GitBranch size={16} className="text-purple-600" /> 
            Flow Steps ({nodes.length})
          </h3>
        </div>
        
        {nodes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4 text-3xl">
              🔧
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No steps yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start building your flow by adding steps</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {nodes.map((node, i) => {
              const config = nodeConfig[node.type];
              const isSelected = selectedNode === node.id;
              
              return (
                <div key={node.id}>
                  {/* Node Card */}
                  <div 
                    className={`relative border-2 rounded-xl p-3 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-purple-500 shadow-lg bg-purple-50' 
                        : `${config.bgColor} hover:shadow-md`
                    }`}
                    onClick={() => handleSelectNode(node)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Step Number & Icon */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">#{i + 1}</span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isSelected ? 'bg-purple-100' : 'bg-white/80'}`}>
                          {config.emoji}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isSelected ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
                            {node.type}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">{node.label}</h4>
                        <p className="text-xs text-gray-600 truncate">{node.content}</p>
                        
                        {/* Condition branches */}
                        {node.type === 'condition' && (
                          <div className="flex gap-2 mt-1.5">
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Yes</span>
                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">✗ No</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveNode(node.id, 'up'); }} 
                          disabled={i === 0}
                          className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30"
                        >
                          <ChevronUp size={14} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveNode(node.id, 'down'); }} 
                          disabled={i === nodes.length - 1}
                          className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30"
                        >
                          <ChevronDown size={14} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }} 
                          className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {i < nodes.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown size={18} className="text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Panel - Bottom Sheet on Mobile */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl animate-slide-up max-h-[85vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="text-xl">{nodeConfig[nodes.find(n => n.id === selectedNode)?.type || 'message'].emoji}</span>
                Edit Step
              </h3>
              <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Step Type</label>
                <p className={`text-sm font-semibold capitalize px-3 py-2 rounded-lg ${nodeConfig[nodes.find(n => n.id === selectedNode)?.type || 'message'].bgColor}`}>
                  {nodeConfig[nodes.find(n => n.id === selectedNode)?.type || 'message'].emoji} {nodes.find(n => n.id === selectedNode)?.type || 'message'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Label</label>
                <input 
                  value={editLabel} 
                  onChange={e => setEditLabel(e.target.value)} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="e.g. Send Welcome Message"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Content / Configuration</label>
                <textarea 
                  value={editContent} 
                  onChange={e => setEditContent(e.target.value)} 
                  rows={4} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" 
                  placeholder="Configure this step..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Quick Variables</label>
                <div className="flex flex-wrap gap-1">
                  {['{{name}}', '{{username}}', '👋', '🎉', '✅', '❤️'].map(v => (
                    <button 
                      key={v} 
                      onClick={() => setEditContent(editContent + ' ' + v)} 
                      className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-lg hover:bg-purple-100"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSaveNode} 
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Save Changes
                </button>
                <button 
                  onClick={() => setSelectedNode(null)} 
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
