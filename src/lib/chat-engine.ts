export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  quickReplies?: string[];
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  currentFlow: string | null;
  step: number;
  collectedData: Record<string, string>;
  leadCreated: boolean;
}

interface FlowStep {
  botMessage: string;
  quickReplies?: string[];
  field?: string;
  next?: (response: string) => number | "done" | "contact";
}

function createId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function botMsg(
  content: string,
  quickReplies?: string[]
): ChatMessage {
  return {
    id: createId(),
    role: "bot",
    content,
    quickReplies,
    timestamp: new Date(),
  };
}

// ---------------------------------------------------------------------------
// Flow definitions
// ---------------------------------------------------------------------------

const buyFlow: FlowStep[] = [
  {
    botMessage: "What type of hardware are you looking for?",
    quickReplies: ["Servers", "Storage & NAS", "Networking", "Workstations", "Components"],
    field: "hardwareType",
    next: () => 1,
  },
  {
    botMessage: "What's your approximate budget?",
    quickReplies: ["Under \u20B950K", "\u20B950K\u2013\u20B92L", "\u20B92L\u2013\u20B95L", "\u20B95L\u2013\u20B910L", "\u20B910L+"],
    field: "budget",
    next: () => 2,
  },
  {
    botMessage: "Do you prefer new or refurbished?",
    quickReplies: ["New", "Refurbished", "Either is fine"],
    field: "condition",
    next: () => 3,
  },
  {
    botMessage: "When do you need this?",
    quickReplies: ["Urgent", "Within a week", "Within a month", "Flexible"],
    field: "timeline",
    next: () => 4,
  },
  {
    botMessage:
      "Great! I have all the details. Would you like me to connect you with our sales team for personalised recommendations?",
    quickReplies: ["Yes, connect me!", "Browse products myself"],
    field: "action",
    next: (response: string) => {
      const lower = response.toLowerCase();
      if (lower.includes("yes") || lower.includes("connect")) return "contact";
      return "done";
    },
  },
];

const sellFlow: FlowStep[] = [
  {
    botMessage: "What hardware would you like to sell?",
    quickReplies: ["Server", "Storage", "Networking", "Workstation", "Other"],
    field: "hardwareType",
    next: () => 1,
  },
  {
    botMessage: "What condition is it in?",
    quickReplies: ["Working", "Partially Working", "Not Working"],
    field: "condition",
    next: () => 2,
  },
  {
    botMessage: "How old is the equipment?",
    quickReplies: ["<1 year", "1\u20133 years", "3\u20135 years", "5+ years"],
    field: "age",
    next: () => 3,
  },
  {
    botMessage: "Would you like our team to evaluate and make an offer?",
    quickReplies: ["Yes, get an offer!", "Fill the detailed form"],
    field: "action",
    next: (response: string) => {
      const lower = response.toLowerCase();
      if (lower.includes("yes") || lower.includes("offer")) return "contact";
      return "done";
    },
  },
];

const recycleFlow: FlowStep[] = [
  {
    botMessage:
      "We offer certified e-waste recycling with proper documentation. What type of equipment do you want to recycle?",
    quickReplies: ["Servers", "Desktops/Laptops", "Networking Equipment", "Mixed IT Hardware"],
    field: "hardwareType",
    next: () => 1,
  },
  {
    botMessage: "Approximately how many units?",
    quickReplies: ["1\u20135", "5\u201320", "20\u201350", "50+"],
    field: "quantity",
    next: () => 2,
  },
  {
    botMessage: "Do you need a Certificate of Destruction?",
    quickReplies: ["Yes", "No", "Not sure"],
    field: "certificate",
    next: () => 3,
  },
  {
    botMessage:
      "We can arrange a free pickup for bulk items. Would you like our recycling team to contact you?",
    quickReplies: ["Yes, schedule pickup", "I'll drop off myself"],
    field: "action",
    next: (response: string) => {
      const lower = response.toLowerCase();
      if (lower.includes("yes") || lower.includes("schedule") || lower.includes("pickup"))
        return "contact";
      return "done";
    },
  },
];

const quoteFlow: FlowStep[] = [
  {
    botMessage: "What are you looking to configure?",
    quickReplies: ["Rack Server", "Storage Array", "Network Switch", "Complete Setup"],
    field: "configType",
    next: () => 1,
  },
  {
    botMessage:
      "Tell me more about your requirements \u2014 use case, capacity needs, any specific brands or specs you have in mind.",
    field: "requirements",
    next: () => 2,
  },
  {
    botMessage: "What\u2019s your budget range?",
    quickReplies: ["Under \u20B950K", "\u20B950K\u2013\u20B92L", "\u20B92L\u2013\u20B95L", "\u20B95L+"],
    field: "budget",
    next: () => 3,
  },
  {
    botMessage:
      "I\u2019ll connect you with our solutions team for a detailed quote. Can I get your name and email?",
    field: "contactInfo",
    next: () => "contact",
  },
];

const contactSteps: FlowStep[] = [
  {
    botMessage: "Please share your name so our team can reach out:",
    field: "name",
    next: () => 1,
  },
  {
    botMessage: "And your email address?",
    field: "email",
    next: () => 2,
  },
  {
    botMessage: "Lastly, your phone number (optional \u2014 you can type 'skip'):",
    field: "phone",
    next: () => "done",
  },
];

const supportAnswers: Record<string, string> = {
  warranty:
    "All our products come with a minimum 90-day warranty. Refurbished items include a 1-year warranty. Extended warranty plans are also available.",
  shipping:
    "We ship pan-India! Free shipping on orders above \u20B925,000. Standard delivery takes 3\u20137 business days; express options are available.",
  return:
    "We have a 30-day return policy on all products. Items must be in their original condition with all accessories included.",
  payment:
    "We accept UPI, NEFT/RTGS, credit/debit cards, and net banking. A GST invoice is provided with every order.",
  refund:
    "Refunds are processed within 5\u20137 business days after we receive the returned item. The amount is credited to your original payment method.",
};

// ---------------------------------------------------------------------------
// Intent detection
// ---------------------------------------------------------------------------

type Intent =
  | "buy"
  | "sell"
  | "recycle"
  | "quote"
  | "support"
  | "greeting"
  | "thanks"
  | "unknown";

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase().trim();

  // Greeting
  if (/^(hi|hello|hey|namaste|good\s?(morning|afternoon|evening))/.test(lower)) return "greeting";

  // Thanks
  if (/^(thanks|thank you|thx|ty|great|awesome|perfect|ok|okay)/.test(lower)) return "thanks";

  // Buy
  if (
    /(buy|purchase|need|looking\s+for|want\s+to\s+buy|find\s+hardware|server|storage|network|workstation|browse\s+products)/.test(
      lower
    )
  )
    return "buy";

  // Sell
  if (/(sell|dispose|get\s+rid|old\s+hardware|sell\s+hardware)/.test(lower)) return "sell";

  // Recycle
  if (/(recycle|e[\-\s]?waste|dispose|dead|broken|scrap)/.test(lower)) return "recycle";

  // Quote
  if (/(quote|price|cost|budget|configure|custom|get\s+a\s+quote)/.test(lower)) return "quote";

  // Support keywords
  if (
    /(help|support|warranty|return|shipping|payment|refund|talk\s+to\s+sales)/.test(lower)
  )
    return "support";

  return "unknown";
}

function detectSupportTopic(message: string): string | null {
  const lower = message.toLowerCase();
  for (const key of Object.keys(supportAnswers)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Quick-reply to intent mapping (for greeting chips)
// ---------------------------------------------------------------------------

function chipToIntent(chip: string): Intent {
  const lower = chip.toLowerCase();
  if (lower.includes("find hardware") || lower.includes("browse")) return "buy";
  if (lower.includes("sell")) return "sell";
  if (lower.includes("quote")) return "quote";
  if (lower.includes("recycl") || lower.includes("e-waste")) return "recycle";
  if (lower.includes("sales") || lower.includes("support") || lower.includes("talk"))
    return "support";
  return "unknown";
}

// ---------------------------------------------------------------------------
// Flow helpers
// ---------------------------------------------------------------------------

function getFlowSteps(flow: string): FlowStep[] {
  switch (flow) {
    case "buy":
      return buyFlow;
    case "sell":
      return sellFlow;
    case "recycle":
      return recycleFlow;
    case "quote":
      return quoteFlow;
    case "contact":
      return contactSteps;
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const GREETING_MESSAGE =
  "Hello! I\u2019m InfraMitra\u2019s virtual assistant. How can I help you today?";
const GREETING_CHIPS = [
  "Find Hardware",
  "Sell Hardware",
  "Get a Quote",
  "E-Waste Recycling",
  "Talk to Sales",
];

export function getInitialState(): ChatState {
  return {
    messages: [botMsg(GREETING_MESSAGE, GREETING_CHIPS)],
    currentFlow: null,
    step: 0,
    collectedData: {},
    leadCreated: false,
  };
}

export function processMessage(
  state: ChatState,
  userMessage: string
): { newState: ChatState; shouldCreateLead: boolean } {
  const newMessages: ChatMessage[] = [
    ...state.messages,
    {
      id: createId(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    },
  ];

  let { currentFlow, step, collectedData, leadCreated } = state;
  let shouldCreateLead = false;
  const responseMsgs: ChatMessage[] = [];

  // --- Currently in a flow ---
  if (currentFlow) {
    const steps = getFlowSteps(currentFlow);
    const currentStep = steps[step];

    // Store collected data
    if (currentStep?.field) {
      collectedData = { ...collectedData, [currentStep.field]: userMessage };
    }

    // Determine next
    const nextResult = currentStep?.next?.(userMessage);

    if (nextResult === "done") {
      // Flow complete
      if (currentFlow === "contact") {
        responseMsgs.push(
          botMsg(
            "Thank you! Our team will reach out to you shortly. Is there anything else I can help with?",
            ["Find Hardware", "Sell Hardware", "Get a Quote", "No, that\u2019s all"]
          )
        );
        shouldCreateLead = !leadCreated;
        leadCreated = true;
      } else {
        responseMsgs.push(
          botMsg(
            "Thanks for the info! You can browse our marketplace to find what you need. Is there anything else I can help with?",
            ["Find Hardware", "Get a Quote", "Talk to Sales", "No, that\u2019s all"]
          )
        );
      }
      currentFlow = null;
      step = 0;
    } else if (nextResult === "contact") {
      // Transition to contact collection
      collectedData = { ...collectedData, flowSource: currentFlow };
      currentFlow = "contact";
      step = 0;
      const contactStep = contactSteps[0];
      responseMsgs.push(botMsg(contactStep.botMessage, contactStep.quickReplies));
    } else if (typeof nextResult === "number") {
      step = nextResult;
      const nextStep = steps[step];
      if (nextStep) {
        responseMsgs.push(botMsg(nextStep.botMessage, nextStep.quickReplies));
      }
    }
  } else {
    // --- No active flow: detect intent ---
    let intent = detectIntent(userMessage);

    // Also check if this is a chip click that maps to a known intent
    if (intent === "unknown") {
      intent = chipToIntent(userMessage);
    }

    switch (intent) {
      case "greeting": {
        responseMsgs.push(botMsg(GREETING_MESSAGE, GREETING_CHIPS));
        break;
      }
      case "thanks": {
        responseMsgs.push(
          botMsg(
            "You\u2019re welcome! Feel free to reach out anytime. Is there anything else I can help with?",
            GREETING_CHIPS
          )
        );
        break;
      }
      case "buy": {
        currentFlow = "buy";
        step = 0;
        collectedData = {};
        leadCreated = false;
        const s = buyFlow[0];
        responseMsgs.push(botMsg(s.botMessage, s.quickReplies));
        break;
      }
      case "sell": {
        currentFlow = "sell";
        step = 0;
        collectedData = {};
        leadCreated = false;
        const s = sellFlow[0];
        responseMsgs.push(botMsg(s.botMessage, s.quickReplies));
        break;
      }
      case "recycle": {
        currentFlow = "recycle";
        step = 0;
        collectedData = {};
        leadCreated = false;
        const s = recycleFlow[0];
        responseMsgs.push(botMsg(s.botMessage, s.quickReplies));
        break;
      }
      case "quote": {
        currentFlow = "quote";
        step = 0;
        collectedData = {};
        leadCreated = false;
        const s = quoteFlow[0];
        responseMsgs.push(botMsg(s.botMessage, s.quickReplies));
        break;
      }
      case "support": {
        const topic = detectSupportTopic(userMessage);
        if (topic) {
          responseMsgs.push(
            botMsg(supportAnswers[topic] + "\n\nAnything else I can help with?", [
              "Warranty",
              "Shipping",
              "Returns",
              "Payment",
              "Talk to Sales",
            ])
          );
        } else {
          responseMsgs.push(
            botMsg(
              "I can help with common questions! What would you like to know about?",
              ["Warranty", "Shipping", "Returns", "Payment", "Talk to Sales"]
            )
          );
        }
        break;
      }
      default: {
        responseMsgs.push(
          botMsg(
            "I\u2019m not sure I understood that. Let me know how I can help!",
            GREETING_CHIPS
          )
        );
        break;
      }
    }
  }

  return {
    newState: {
      messages: [...newMessages, ...responseMsgs],
      currentFlow,
      step,
      collectedData,
      leadCreated,
    },
    shouldCreateLead,
  };
}
