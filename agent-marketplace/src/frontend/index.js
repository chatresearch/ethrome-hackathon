"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.panels = void 0;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("react-dom/client");
require("./index.css");
const react_1 = __importDefault(require("react"));
const queryClient = new react_query_1.QueryClient();
/**
 * Main Example route component
 */
function ExampleRoute() {
    const config = window.ELIZA_CONFIG;
    const agentId = config?.agentId;
    // Apply dark mode to the root element
    react_1.default.useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);
    if (!agentId) {
        return (<div className="p-4 text-center">
        <div className="text-red-600 font-medium">Error: Agent ID not found</div>
        <div className="text-sm text-gray-600 mt-2">
          The server should inject the agent ID configuration.
        </div>
      </div>);
    }
    return <ExampleProvider agentId={agentId}/>;
}
/**
 * Example provider component
 */
function ExampleProvider({ agentId }) {
    return (<react_query_1.QueryClientProvider client={queryClient}>
      <div>Hello {agentId}</div>
    </react_query_1.QueryClientProvider>);
}
// Initialize the application - no router needed for iframe
const rootElement = document.getElementById('root');
if (rootElement) {
    (0, client_1.createRoot)(rootElement).render(<ExampleRoute />);
}
/**
 * Example panel component for the plugin system
 */
const PanelComponent = ({ agentId }) => {
    return <div>Helllo {agentId}!</div>;
};
// Export the panel configuration for integration with the agent UI
exports.panels = [
    {
        name: 'Example',
        path: 'example',
        component: PanelComponent,
        icon: 'Book',
        public: false,
        shortLabel: 'Example',
    },
];
__exportStar(require("./utils"), exports);
