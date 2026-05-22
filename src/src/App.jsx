import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  ScanLine,
  Palette,
  CalendarCheck,
  DoorOpen,
  Wallet,
  FileText,
  Bell,
  ShoppingCart,
  FolderOpen,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Upload,
  Sparkles,
  ClipboardCheck,
  Hammer,
  Receipt,
  Search,
  X,
  ChevronRight,
  Save,
  ShieldCheck,
  Info,
  BadgeCheck,
  Clock,
  CreditCard,
  Wrench,
} from "lucide-react";

const RM = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0,
});

const houseTypes = [
  "Condo",
  "Apartment",
  "Single Storey Terrace",
  "Double Storey Terrace",
  "Semi-D",
  "Bungalow",
];

const renovationGoals = [
  "Move in as soon as possible",
  "Budget controlled",
  "Nice and practical",
  "Modern full renovation",
  "Premium renovation",
  "Renovate slowly over time",
];

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "scan", label: "Floor Plan", icon: ScanLine },
  { id: "style", label: "Style", icon: Palette },
  { id: "timeline", label: "Timeline", icon: CalendarCheck },
  { id: "areas", label: "Areas", icon: DoorOpen },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "quotes", label: "Quotations", icon: FileText },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "shopping", label: "Shopping", icon: ShoppingCart },
  { id: "documents", label: "Documents", icon: FolderOpen },
];

const defaultProject = {
  projectName: "My First Home Reno",
  houseType: "Double Storey Terrace",
  houseSize: 1800,
  rooms: 4,
  budget: 200000,
  moveInDeadline: "2026-10-01",
  goal: "Nice and practical",
};

const categoryList = [
  "Electrical",
  "Aircond",
  "Plumbing",
  "Wet works",
  "Waterproofing",
  "Painting",
  "Lighting",
  "Plaster ceiling",
  "Carpentry",
  "Kitchen",
  "Bathroom",
  "Furniture",
  "Appliances",
  "Curtains",
  "Smart home",
  "Cleaning",
  "Defects / repair",
  "Miscellaneous",
];

const priorityClasses = {
  "Must Do First": "bg-red-50 text-red-700 ring-red-200",
  "Before Move-In": "bg-amber-50 text-amber-700 ring-amber-200",
  "Can Buy Later": "bg-blue-50 text-blue-700 ring-blue-200",
  "Optional / Nice to Have": "bg-slate-50 text-slate-700 ring-slate-200",
};

const roomTemplates = {
  "Living Room": {
    must: ["Electrical sockets", "TV point", "Internet point", "Fan / lighting point", "Aircond point if needed", "Curtain measurement"],
    later: ["Sofa", "Coffee table", "Rug", "TV console", "Decor", "Plants", "Side table"],
    contractor: "Electrical / Curtain / ID contractor",
    starterBudget: 18000,
  },
  Kitchen: {
    must: ["Cabinet layout", "Sink position", "Hob and hood position", "Fridge size", "Oven / microwave point", "Water point", "Drainage", "Countertop material"],
    later: ["Kitchen organisers", "Small appliances", "Bar stools", "Extra shelves", "Decorative lighting"],
    contractor: "Kitchen cabinet contractor",
    starterBudget: 35000,
  },
  "Dry Kitchen": {
    must: ["Cabinet layout", "Fridge size", "Power points", "Lighting", "Countertop material"],
    later: ["Coffee corner", "Bar stools", "Display shelves", "Small appliances"],
    contractor: "Carpentry contractor",
    starterBudget: 25000,
  },
  "Wet Kitchen": {
    must: ["Sink position", "Hob and hood position", "Water point", "Drainage", "Heavy-duty countertop", "Ventilation"],
    later: ["Organisers", "Extra rack", "Utility shelf"],
    contractor: "Kitchen / wet works contractor",
    starterBudget: 30000,
  },
  "Master Bedroom": {
    must: ["Aircond point", "Wardrobe position", "Bed position", "Lighting switch position", "Curtain measurement", "Socket beside bed"],
    later: ["Bedside table", "Dressing table", "Decor", "Carpet", "Extra storage"],
    contractor: "Carpentry / electrical contractor",
    starterBudget: 24000,
  },
  "Room 1": {
    must: ["Bed position", "Wardrobe", "Study table point", "Fan / lighting", "Aircond point", "Sockets"],
    later: ["Study chair", "Shelves", "Loose cabinet", "Decor", "Mattress upgrade"],
    contractor: "Electrical / furniture supplier",
    starterBudget: 12000,
  },
  "Room 2": {
    must: ["Bed position", "Wardrobe", "Study table point", "Fan / lighting", "Aircond point", "Sockets"],
    later: ["Study chair", "Shelves", "Loose cabinet", "Decor", "Mattress upgrade"],
    contractor: "Electrical / furniture supplier",
    starterBudget: 12000,
  },
  "Room 3": {
    must: ["Bed position", "Wardrobe", "Study table point", "Fan / lighting", "Aircond point", "Sockets"],
    later: ["Study chair", "Shelves", "Loose cabinet", "Decor", "Mattress upgrade"],
    contractor: "Electrical / furniture supplier",
    starterBudget: 10000,
  },
  "Bathroom 1": {
    must: ["Waterproofing", "Water heater point", "Shower area", "Basin", "WC", "Drainage", "Mirror cabinet"],
    later: ["Accessories", "Towel rack", "Storage shelf", "Premium mirror", "Decor"],
    contractor: "Plumber / bathroom contractor",
    starterBudget: 12000,
  },
  "Bathroom 2": {
    must: ["Waterproofing", "Water heater point", "Shower area", "Basin", "WC", "Drainage", "Mirror cabinet"],
    later: ["Accessories", "Towel rack", "Storage shelf", "Premium mirror", "Decor"],
    contractor: "Plumber / bathroom contractor",
    starterBudget: 10000,
  },
  Yard: {
    must: ["Washing machine point", "Dryer point", "Water inlet", "Drainage", "Storage", "Ventilation"],
    later: ["Storage rack", "Laundry basket", "Cleaning tools", "Wall hooks"],
    contractor: "Plumber / electrical contractor",
    starterBudget: 8000,
  },
  "Car Porch": {
    must: ["Autogate power point", "Porch lighting", "Drainage", "Floor slope", "CCTV point if needed"],
    later: ["Shoe rack", "Outdoor cabinet", "Plants", "Outdoor bench", "Pressure washer"],
    contractor: "Autogate / electrical contractor",
    starterBudget: 16000,
  },
  Balcony: {
    must: ["Water outlet check", "Drainage", "Outdoor lighting", "Safety railing check"],
    later: ["Outdoor chair", "Plants", "Floor decking", "Decor lights"],
    contractor: "General contractor",
    starterBudget: 6000,
  },
  Garden: {
    must: ["Drainage", "Outdoor water point", "Outdoor lighting", "Floor slope"],
    later: ["Plants", "Outdoor bench", "Stepping stones", "Decor"],
    contractor: "Landscape contractor",
    starterBudget: 12000,
  },
  "Dining Area": {
    must: ["Lighting point", "Fan / aircond consideration", "Power sockets", "Dining table size planning"],
    later: ["Dining table", "Dining chairs", "Pendant light", "Display cabinet"],
    contractor: "Electrical / furniture supplier",
    starterBudget: 10000,
  },
  "Entrance Area": {
    must: ["Shoe cabinet position", "Lighting", "Switch location", "Door lock / smart lock planning"],
    later: ["Shoe bench", "Mirror", "Decor", "Plants"],
    contractor: "Carpentry / smart lock supplier",
    starterBudget: 7000,
  },
  "Staircase / Landing": {
    must: ["Lighting", "Switch position", "Safety railing check", "Wall finishing"],
    later: ["Artwork", "Feature light", "Runner carpet", "Decor"],
    contractor: "Electrical / general contractor",
    starterBudget: 9000,
  },
};

const styles = [
  {
    name: "Minimalist",
    min: 50000,
    sweet: 100000,
    description: "Clean, simple and practical. Focuses on only what you need to move in comfortably.",
    sample: "White walls, simple lighting, loose furniture, limited built-ins and neat storage.",
    can: ["Basic lighting", "Simple paint", "Loose furniture", "Limited carpentry", "Simple curtains"],
    avoid: ["Too many feature walls", "Full-house built-ins", "Luxury stone", "Over-customising every room"],
  },
  {
    name: "Modern Contemporary",
    min: 100000,
    sweet: 200000,
    description: "Modern, clean and flexible. Suitable for most Malaysian new homeowners.",
    sample: "Neutral colour palette, selected built-ins, warm lighting and practical furniture.",
    can: ["Kitchen cabinet", "Selected wardrobes", "Lighting upgrade", "Curtains", "Basic appliances"],
    avoid: ["Changing design too often", "Overspending on carpentry", "Expensive imported fittings"],
  },
  {
    name: "Japandi",
    min: 150000,
    sweet: 230000,
    description: "Warm wood tone, neutral colours, simple carpentry, warm lighting and natural textures.",
    sample: "Warm timber cabinets, soft beige walls, simple lines, indirect lighting and calm decorations.",
    can: ["Warm wood carpentry", "Simple built-ins", "Warm lighting", "Neutral paint", "Natural textures"],
    avoid: ["Full Japandi built-ins on low budget", "Too many wood textures", "Cheap laminate that clashes"],
  },
  {
    name: "Industrial",
    min: 120000,
    sweet: 220000,
    description: "Raw, bold and slightly darker. Best when planned properly with lighting and finishing.",
    sample: "Track lights, cement-look finish, black frames, exposed details and practical furniture.",
    can: ["Track lighting", "Black accents", "Cement-look paint", "Metal shelves", "Loose furniture"],
    avoid: ["Poor lighting", "Too much dark colour", "Unplanned exposed wiring", "Cheap raw finishing"],
  },
  {
    name: "Luxury / Premium",
    min: 300000,
    sweet: 450000,
    description: "More complete carpentry, premium kitchen, better bathroom fittings, smart home and richer finishing.",
    sample: "Feature lighting, premium cabinets, stone-look surfaces, smart switches and better appliances.",
    can: ["Premium kitchen", "More built-ins", "Smart home", "Better bathroom fittings", "Feature lighting"],
    avoid: ["Structural works without proper advice", "Luxury imported materials without buffer", "High upfront payment"],
  },
];

const baseTimeline = [
  ["Planning and measurement", "Must Do First"],
  ["Defects check", "Must Do First"],
  ["Electrical planning", "Must Do First"],
  ["Aircond piping / aircond points", "Must Do First"],
  ["Plumbing and water points", "Must Do First"],
  ["Internet / CCTV / smart home wiring", "Must Do First"],
  ["Hacking and wet works", "Must Do First"],
  ["Waterproofing", "Must Do First"],
  ["Plaster ceiling and curtain box", "Before Move-In"],
  ["Lighting and fan point confirmation", "Before Move-In"],
  ["Painting and surface finishing", "Before Move-In"],
  ["Carpentry and built-ins", "Before Move-In"],
  ["Fixtures and appliance installation", "Before Move-In"],
  ["Furniture and loose items", "Can Buy Later"],
  ["Final inspection and cleaning", "Before Move-In"],
].map(([title, priority], index) => ({
  id: `phase-${index + 1}`,
  title,
  priority,
  done: index < 3,
  explanation: getPhaseExplanation(title),
}));

function getPhaseExplanation(title) {
  const map = {
    "Planning and measurement": "Measure first so your budget, cabinets, furniture and electrical points are based on real dimensions.",
    "Defects check": "Check developer defects before renovation so you do not pay contractors to fix items the developer should rectify.",
    "Electrical planning": "Decide sockets, switches, lights, TV, internet and appliance points before ceiling or wall works start.",
    "Aircond piping / aircond points": "Aircond piping should be planned early because it is often hidden above ceiling or inside trunking.",
    "Plumbing and water points": "Confirm water inlet, drainage, sink, washer and heater points before hacking or tiling.",
    "Internet / CCTV / smart home wiring": "Plan network and CCTV points before closing ceiling or walls.",
    "Hacking and wet works": "Only proceed after layout is confirmed. Hacking changes later can be expensive.",
    Waterproofing: "Waterproofing should be tested before tiling, especially bathrooms, balcony and wet kitchen.",
    "Plaster ceiling and curtain box": "Do this after wiring and aircond points are confirmed.",
    "Lighting and fan point confirmation": "Confirm exact positions before final ceiling closing and painting.",
    "Painting and surface finishing": "Paint after messy works, but before final furniture and loose items are installed.",
    "Carpentry and built-ins": "Kitchen appliances and measurements should be confirmed before final fabrication.",
    "Fixtures and appliance installation": "Install once the major dusty works are done.",
    "Furniture and loose items": "Buy gradually after move-in if budget is tight.",
    "Final inspection and cleaning": "Test all sockets, switches, plumbing and finishes before final payment.",
  };
  return map[title] || "Follow this step in sequence to reduce rework and budget surprises.";
}

const importantWarnings = [
  "Electrical and aircond points should be confirmed before plaster ceiling.",
  "Kitchen appliances should be selected before cabinet final measurement.",
  "Sink, hob, hood, fridge and oven dimensions should be confirmed before kitchen fabrication.",
  "Waterproofing should be checked before tiling.",
  "Take photos of hidden wiring and piping before closing ceiling or walls.",
  "Do not make final payment before defect checking.",
];

const defaultBudgetItems = [
  { id: "b1", category: "Electrical", room: "Whole House", planned: 14000, actual: 6200, quote: 14000, paid: 3000 },
  { id: "b2", category: "Aircond", room: "Whole House", planned: 18000, actual: 0, quote: 17500, paid: 0 },
  { id: "b3", category: "Kitchen", room: "Kitchen", planned: 38000, actual: 5000, quote: 42000, paid: 5000 },
  { id: "b4", category: "Carpentry", room: "Master Bedroom", planned: 30000, actual: 0, quote: 32000, paid: 0 },
  { id: "b5", category: "Lighting", room: "Whole House", planned: 12000, actual: 3000, quote: 12000, paid: 3000 },
  { id: "b6", category: "Furniture", room: "Living Room", planned: 25000, actual: 0, quote: 0, paid: 0 },
  { id: "b7", category: "Appliances", room: "Kitchen", planned: 22000, actual: 0, quote: 0, paid: 0 },
  { id: "b8", category: "Curtains", room: "Whole House", planned: 9000, actual: 0, quote: 0, paid: 0 },
  { id: "b9", category: "Cleaning", room: "Whole House", planned: 2500, actual: 0, quote: 0, paid: 0 },
  { id: "b10", category: "Miscellaneous", room: "Contingency", planned: 20000, actual: 0, quote: 0, paid: 0 },
];

const defaultQuotes = [
  {
    id: "q1",
    contractor: "ABC Electrical & Aircond",
    amount: 31500,
    scopeIncluded: "Wiring, socket relocation, lighting points, aircond piping and testing",
    scopeExcluded: "Light fittings, concealed hacking repair, painting touch-up",
    material: "Standard copper wiring, branded switches, copper aircond piping",
    warranty: "12 months workmanship",
    timeline: "3 weeks",
    payment: "30% deposit, 50% progress, 20% after testing",
    notes: "Need to confirm all switch locations before ceiling work.",
    rating: 4,
    deposit: 9450,
    progress: 15750,
    final: 6300,
    retention: 0,
    dueDate: "2026-07-15",
    upfrontPercent: 30,
  },
  {
    id: "q2",
    contractor: "Nice Home Carpentry",
    amount: 74000,
    scopeIncluded: "Kitchen cabinet, master wardrobe, TV console, shoe cabinet",
    scopeExcluded: "Appliances, sink, hob, hood, delivery after Klang Valley, stone upgrade",
    material: "Melamine carcass, soft closing hinges, quartz top for kitchen",
    warranty: "5 years hardware, 1 year workmanship",
    timeline: "6-8 weeks after final measurement",
    payment: "40% deposit, 40% before installation, 20% after installation",
    notes: "Appliance dimensions must be confirmed before final measurement.",
    rating: 4,
    deposit: 29600,
    progress: 29600,
    final: 14800,
    retention: 0,
    dueDate: "",
    upfrontPercent: 40,
  },
];

const defaultReminders = [
  { id: "r1", text: "Confirm aircond point before plaster ceiling", done: false, due: "2026-06-20", priority: "Must Do First" },
  { id: "r2", text: "Confirm kitchen appliances before cabinet measurement", done: false, due: "2026-06-25", priority: "Must Do First" },
  { id: "r3", text: "Confirm sink and hob size before countertop", done: false, due: "2026-07-05", priority: "Before Move-In" },
  { id: "r4", text: "Confirm curtain measurement after plaster ceiling", done: false, due: "2026-08-01", priority: "Before Move-In" },
  { id: "r5", text: "Pay second deposit only after work milestone", done: false, due: "2026-07-20", priority: "Must Do First" },
  { id: "r6", text: "Check waterproofing before tiling", done: false, due: "2026-07-10", priority: "Must Do First" },
  { id: "r7", text: "Take photo of hidden wiring before closing ceiling", done: false, due: "2026-06-30", priority: "Must Do First" },
  { id: "r8", text: "Test all sockets before final payment", done: false, due: "2026-09-20", priority: "Before Move-In" },
  { id: "r9", text: "Keep all receipts and warranties", done: false, due: "2026-09-25", priority: "Before Move-In" },
  { id: "r10", text: "Schedule deep cleaning before move-in", done: false, due: "2026-09-28", priority: "Before Move-In" },
];

const defaultShopping = [
  { id: "s1", name: "Mattress", group: "Must buy before move-in", budget: 3500, bought: false },
  { id: "s2", name: "Fridge", group: "Must buy before move-in", budget: 3500, bought: false },
  { id: "s3", name: "Washing machine", group: "Must buy before move-in", budget: 2500, bought: false },
  { id: "s4", name: "Basic lights", group: "Must buy before move-in", budget: 5000, bought: true },
  { id: "s5", name: "Fans", group: "Must buy before move-in", budget: 2500, bought: false },
  { id: "s6", name: "Water heater", group: "Must buy before move-in", budget: 1800, bought: false },
  { id: "s7", name: "Curtains / blinds", group: "Must buy before move-in", budget: 9000, bought: false },
  { id: "s8", name: "Basic kitchen items", group: "Must buy before move-in", budget: 2000, bought: false },
  { id: "s9", name: "Sofa", group: "Can buy slowly", budget: 6000, bought: false },
  { id: "s10", name: "Dining table", group: "Can buy slowly", budget: 3500, bought: false },
  { id: "s11", name: "TV", group: "Can buy slowly", budget: 3500, bought: false },
  { id: "s12", name: "Carpet", group: "Can buy slowly", budget: 800, bought: false },
  { id: "s13", name: "Decor", group: "Can buy slowly", budget: 1500, bought: false },
  { id: "s14", name: "Side table", group: "Can buy slowly", budget: 600, bought: false },
  { id: "s15", name: "Extra storage", group: "Can buy slowly", budget: 2500, bought: false },
  { id: "s16", name: "Smart home devices", group: "Can buy slowly", budget: 2500, bought: false },
  { id: "s17", name: "Plants", group: "Can buy slowly", budget: 800, bought: false },
  { id: "s18", name: "Paintings", group: "Can buy slowly", budget: 1000, bought: false },
  { id: "s19", name: "Premium mirror", group: "Optional upgrades", budget: 1500, bought: false },
  { id: "s20", name: "Outdoor bench", group: "Optional upgrades", budget: 1200, bought: false },
];

const documentTypes = [
  "Floor plan",
  "Quotations",
  "Receipts",
  "Payment proofs",
  "Warranties",
  "Contractor contacts",
  "Defect photos",
  "Before and after photos",
];

const defectBefore = [
  "Wall cracks",
  "Water leakage",
  "Hollow tiles",
  "Uneven floor",
  "Door alignment",
  "Window defects",
  "Drainage issue",
  "Ceiling stain",
  "Electrical points not working",
  "Water pressure issue",
];

const defectAfter = [
  "Cabinet alignment",
  "Paint touch-up",
  "Light switch testing",
  "Socket testing",
  "Aircond testing",
  "Water heater testing",
  "Drainage test",
  "Leakage test",
  "Door closing",
  "Final cleaning",
];

function getBudgetProfile(budget) {
  if (budget < 50000) {
    return {
      title: "Very tight budget",
      tone: "Plan carefully",
      description: "Focus on safety, defects, basic electrical points, essential appliances and move-in items. Avoid heavy carpentry or major hacking.",
      can: ["Essential repairs", "Basic lights", "Basic furniture", "Simple cleaning", "Move-in essentials"],
      avoid: ["Full-house custom cabinets", "Premium finishes", "Major hacking", "Luxury appliances"],
    };
  }
  if (budget < 100000) {
    return {
      title: "Basic move-in renovation",
      tone: "Good for essentials",
      description: "Suitable for basic move-in renovation, simple lighting, essential electrical works, basic furniture and limited built-in carpentry.",
      can: ["Simple lighting", "Essential electrical works", "Basic furniture", "Limited built-ins", "Basic curtains"],
      avoid: ["Full-house custom cabinets", "Luxury materials", "Major hacking", "Expensive bathroom upgrades"],
    };
  }
  if (budget < 200000) {
    return {
      title: "Simple modern renovation",
      tone: "Control carpentry",
      description: "Suitable for a simple modern renovation with basic kitchen cabinet, selected wardrobes, lighting and electrical upgrades, curtains and basic furniture.",
      can: ["Basic kitchen cabinet", "Selected wardrobes", "Lighting and electrical upgrade", "Curtains", "Basic furniture"],
      avoid: ["Too much carpentry", "Multiple bathroom upgrades", "Premium appliances", "Design changes after work starts"],
    };
  }
  if (budget < 300000) {
    return {
      title: "Comfortable modern home",
      tone: "Healthy range",
      description: "Suitable for a comfortable modern home with kitchen cabinet, selected built-ins, lighting upgrade, aircond points, furniture, curtains and appliances.",
      can: ["Kitchen cabinet", "Selected built-ins", "Lighting upgrade", "Aircond points", "Furniture and appliances", "Basic car porch / autogate"],
      avoid: ["Uncontrolled luxury finishes", "Too much custom carpentry", "Structural changes without advice"],
    };
  }
  return {
    title: "Fuller renovation budget",
    tone: "More flexibility",
    description: "Suitable for more complete carpentry, premium kitchen, better bathroom fittings, smart home features, nicer lighting and interior theme.",
    can: ["More complete carpentry", "Premium kitchen", "Better bathroom fittings", "Smart home features", "Nicer lighting"],
    avoid: ["Structural works without proper advice", "Luxury imported materials without buffer", "Paying too much upfront"],
  };
}

function getStyleFit(style, budget) {
  if (budget >= style.sweet) return "Good Fit";
  if (budget >= style.min) return "Stretch Budget";
  return "Not Recommended";
}

function fitClass(fit) {
  if (fit === "Good Fit") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (fit === "Stretch Budget") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

function localGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function localSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can fail in private mode. Prototype continues without persistence.
  }
}

function mockScanFloorPlan(project) {
  // Prototype mock AI scan.
  // Later replacement point:
  // return await realAIVisionScan({ imageFile, houseType: project.houseType, budget: project.budget });
  const base = ["Living Room", "Dining Area", "Kitchen", "Master Bedroom", "Bathroom 1", "Bathroom 2", "Yard", "Entrance Area"];
  const byType = {
    Condo: ["Balcony"],
    Apartment: ["Balcony"],
    "Single Storey Terrace": ["Car Porch", "Garden", "Room 1", "Room 2"],
    "Double Storey Terrace": ["Car Porch", "Garden", "Room 1", "Room 2", "Room 3", "Staircase / Landing", "Dry Kitchen", "Wet Kitchen"],
    "Semi-D": ["Car Porch", "Garden", "Room 1", "Room 2", "Room 3", "Staircase / Landing", "Dry Kitchen", "Wet Kitchen", "Balcony"],
    Bungalow: ["Car Porch", "Garden", "Room 1", "Room 2", "Room 3", "Staircase / Landing", "Dry Kitchen", "Wet Kitchen", "Balcony"],
  };
  const roomCountAreas = Array.from({ length: Math.max(0, Number(project.rooms || 0) - 1) }, (_, i) => `Room ${i + 1}`).filter((x) => roomTemplates[x]);
  const combined = [...new Set([...base, ...(byType[project.houseType] || []), ...roomCountAreas])];
  return combined.map((name, index) => {
    const template = roomTemplates[name] || {
      must: ["Measure area", "Confirm electrical point", "Confirm renovation need"],
      later: ["Loose furniture", "Decor"],
      contractor: "General contractor",
      starterBudget: 7000,
    };
    const priority = index < 8 ? "Must Do First" : index < 12 ? "Before Move-In" : "Can Buy Later";
    return {
      id: `scan-${name.replaceAll(" ", "-").toLowerCase()}`,
      name,
      confidence: Math.max(72, Math.min(97, 94 - index * 2 + (project.houseType.includes("Terrace") ? 2 : 0))),
      suggestedNeeds: template.must.slice(0, 4),
      starterBudget: template.starterBudget,
      priority,
      timing: priority,
      added: false,
    };
  });
}

function makeRoomFromArea(area) {
  const template = roomTemplates[area.name] || {
    must: area.suggestedNeeds || [],
    later: ["Loose furniture", "Decor"],
    contractor: "General contractor",
    starterBudget: area.starterBudget || 7000,
  };
  return {
    id: `room-${area.name}-${Date.now()}`,
    name: area.name,
    allocated: area.starterBudget || template.starterBudget,
    spent: 0,
    completion: 0,
    must: template.must,
    later: template.later,
    reminders: template.must.slice(0, 3).map((x) => `Confirm ${x.toLowerCase()}`),
    contractor: template.contractor,
    status: area.priority === "Can Buy Later" ? "Planning" : "Need attention",
  };
}

function ProgressBar({ value }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}

function Badge({ children, className = "bg-slate-50 text-slate-700 ring-slate-200" }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>{children}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-2xl bg-slate-900 p-2 text-white shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        {subtitle && <p className="text-sm leading-6 text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, prefix = "", placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-slate-900/10">
        {prefix && <span className="mr-1 text-sm text-slate-500">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}

function TextInput({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Onboarding({ project, setProject, onDone }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto my-6 max-w-2xl rounded-3xl bg-white p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-2xl bg-slate-900 p-3 text-white">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-950">Welcome to RenoGuide</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">Start with your budget and floor plan. RenoGuide will turn it into a practical renovation plan.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput label="Project name" value={project.projectName} onChange={(v) => setProject({ ...project, projectName: v })} />
          <SelectInput label="House type" value={project.houseType} onChange={(v) => setProject({ ...project, houseType: v })} options={houseTypes} />
          <NumberInput label="House size" value={project.houseSize} onChange={(v) => setProject({ ...project, houseSize: v })} placeholder="1800" />
          <NumberInput label="Number of rooms" value={project.rooms} onChange={(v) => setProject({ ...project, rooms: v })} placeholder="4" />
          <NumberInput label="Renovation budget" prefix="RM" value={project.budget} onChange={(v) => setProject({ ...project, budget: v })} placeholder="200000" />
          <TextInput label="Move-in deadline" type="date" value={project.moveInDeadline} onChange={(v) => setProject({ ...project, moveInDeadline: v })} />
          <div className="sm:col-span-2">
            <SelectInput label="Renovation goal" value={project.goal} onChange={(v) => setProject({ ...project, goal: v })} options={renovationGoals} />
          </div>
        </div>

        <button
          onClick={onDone}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm active:scale-[0.99]"
        >
          <Sparkles className="h-4 w-4" /> Create my renovation plan
        </button>
      </motion.div>
    </div>
  );
}

function Dashboard({ project, budgetItems, quotes, rooms, reminders, selectedStyle, warnings, setShowOnboarding, setActiveTab }) {
  const planned = budgetItems.reduce((s, x) => s + Number(x.planned || 0), 0);
  const actual = budgetItems.reduce((s, x) => s + Number(x.actual || 0), 0);
  const paid = budgetItems.reduce((s, x) => s + Number(x.paid || 0), 0);
  const completion = rooms.length ? Math.round(rooms.reduce((s, r) => s + r.completion, 0) / rooms.length) : 0;
  const profile = getBudgetProfile(project.budget);

  return (
    <div className="space-y-4 pb-24">
      <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">RenoGuide Project</p>
            <h1 className="mt-1 text-2xl font-black">{project.projectName}</h1>
            <p className="mt-2 text-sm text-slate-300">{project.houseType} · {project.houseSize} sq ft · {project.rooms} rooms</p>
          </div>
          <button onClick={() => setShowOnboarding(true)} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white ring-1 ring-white/10">Edit</button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
            <p className="text-xs text-slate-300">Target Budget</p>
            <p className="text-lg font-black">{RM.format(project.budget || 0)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
            <p className="text-xs text-slate-300">Move-in Deadline</p>
            <p className="text-lg font-black">{project.moveInDeadline || "Not set"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard label="Planned" value={RM.format(planned)} note={`${Math.round((planned / Math.max(project.budget, 1)) * 100)}% of target`} />
        <MetricCard label="Actual Spent" value={RM.format(actual)} note={`${RM.format(project.budget - actual)} remaining`} />
        <MetricCard label="Paid" value={RM.format(paid)} note="Payment tracker" />
        <MetricCard label="Progress" value={`${completion}%`} note={`${rooms.length} rooms planned`} />
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-950">Budget realism checker</h3>
              <Badge>{profile.tone}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{profile.description}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <MiniList title="Realistic to do" items={profile.can} good />
              <MiniList title="Be careful / avoid" items={profile.avoid} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-950">Smart alerts</h3>
            <p className="text-sm text-slate-500">Warnings based on your current plan.</p>
          </div>
          <Badge className={warnings.length ? "bg-red-50 text-red-700 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}>{warnings.length} alerts</Badge>
        </div>
        <div className="space-y-2">
          {warnings.length ? warnings.slice(0, 5).map((warning) => <AlertRow key={warning} text={warning} />) : <GoodRow text="No major planning alerts for now." />}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold text-slate-950">Next best actions</h3>
          <div className="space-y-2">
            {[
              ["Upload or scan your floor plan", "scan"],
              ["Select a realistic renovation style", "style"],
              ["Confirm electrical and aircond points", "timeline"],
              ["Compare contractor quotations", "quotes"],
            ].map(([text, tab]) => (
              <button key={text} onClick={() => setActiveTab(tab)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-3 text-left text-sm hover:bg-slate-50">
                <span>{text}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-bold text-slate-950">Project summary</h3>
          <div className="space-y-3 text-sm">
            <SummaryLine label="Goal" value={project.goal} />
            <SummaryLine label="Selected style" value={selectedStyle || "Not selected"} />
            <SummaryLine label="Rooms / areas" value={`${rooms.length} added`} />
            <SummaryLine label="Active reminders" value={`${reminders.filter((r) => !r.done).length} pending`} />
            <SummaryLine label="Quotations" value={`${quotes.length} saved`} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <Card className="p-3">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </Card>
  );
}

function MiniList({ title, items, good }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-xs leading-5 text-slate-600">
            {good ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /> : <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />}
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function AlertRow({ text }) {
  return (
    <div className="flex gap-2 rounded-2xl bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-100">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function GoodRow({ text }) {
  return (
    <div className="flex gap-2 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-100">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function FloorPlanScan({ project, scannedAreas, setScannedAreas, rooms, setRooms }) {
const FLOOR_PLAN_AI_JSON_PROMPT = `
You are an AI renovation planning assistant for first-time homeowners.

Analyse the uploaded floor plan or house layout image.

Identify all visible areas, such as living room, dining area, kitchen, dry kitchen, wet kitchen, master bedroom, bedroom 1, bedroom 2, bedroom 3, bathrooms, yard, balcony, car porch, staircase, entrance and any other visible areas.

Return the result in structured JSON only.

For each detected area, include:
- areaName
- confidenceScore from 0 to 100
- likelyFunction
- renovationPriority: High, Medium or Low
- phase: Must Do First, Before Move-In, Can Buy Later, or Optional
- suggestedWorks
- estimatedBudgetRangeMYR
- keyReminders
- buyNowItems
- buyLaterItems
- risksOrWarnings

Also provide:
- overallHomeSummary
- recommendedRenovationStyle based on the user’s budget
- whether the user’s budget is realistic
- top 10 priority tasks
- top 10 reminders
- suggested contingency budget

Use beginner-friendly language.
Do not give professional engineering or structural advice.
Remind the user to confirm measurements, hacking, electrical, plumbing, waterproofing and structural matters with qualified professionals.

Return JSON in this format:

{
  "overallHomeSummary": "",
  "budgetRealism": {
    "userBudgetMYR": 0,
    "realisticLevel": "",
    "summary": "",
    "recommendedStyle": "",
    "notRecommended": []
  },
  "detectedAreas": [
    {
      "areaName": "",
      "confidenceScore": 0,
      "likelyFunction": "",
      "renovationPriority": "",
      "phase": "",
      "suggestedWorks": [],
      "estimatedBudgetRangeMYR": "",
      "keyReminders": [],
      "buyNowItems": [],
      "buyLaterItems": [],
      "risksOrWarnings": []
    }
  ],
  "priorityTasks": [],
  "reminders": [],
  "contingencyBudgetSuggestion": "",
  "disclaimer": ""
}
`.trim();

function getRecommendedStyleFromBudget(budget) {
  if (budget < 80000) return "Minimalist";
  if (budget < 150000) return "Modern Contemporary";
  if (budget < 250000) return "Modern Contemporary or Japandi-lite";
  if (budget < 300000) return "Japandi or Modern Contemporary";
  return "Luxury / Premium";
}

function getBudgetRealismText(budget) {
  if (budget < 50000) {
    return {
      level: "Very tight",
      summary:
        "This budget is only suitable for essential move-in works. Focus on safety, defects, basic electrical works, basic lights and must-buy items.",
      notRecommended: [
        "Full-house custom carpentry",
        "Luxury materials",
        "Major hacking",
        "Premium bathroom renovation",
        "Full smart home setup",
      ],
    };
  }

  if (budget < 100000) {
    return {
      level: "Basic move-in renovation",
      summary:
        "This budget can work for basic move-in renovation, simple lighting, essential electrical works, basic furniture and limited built-in carpentry.",
      notRecommended: [
        "Full-house custom cabinets",
        "Premium kitchen",
        "Luxury imported materials",
        "Major hacking",
      ],
    };
  }

  if (budget < 200000) {
    return {
      level: "Simple modern renovation",
      summary:
        "This budget is suitable for a simple modern renovation with basic kitchen cabinet, selected wardrobes, lighting upgrade, curtains and basic furniture.",
      notRecommended: [
        "Too much carpentry",
        "Premium bathroom fittings in all bathrooms",
        "Luxury appliances",
        "Too many design changes after work starts",
      ],
    };
  }

  if (budget < 300000) {
    return {
      level: "Comfortable modern home",
      summary:
        "This budget is suitable for a comfortable modern home with kitchen cabinet, selected built-ins, lighting upgrade, aircond points, furniture, curtains and appliances.",
      notRecommended: [
        "Uncontrolled luxury finishes",
        "Too much custom carpentry",
        "Structural changes without professional advice",
      ],
    };
  }

  return {
    level: "Fuller renovation budget",
    summary:
      "This budget gives more flexibility for fuller renovation, more complete carpentry, premium kitchen, better bathroom fittings, smart home features and nicer lighting.",
    notRecommended: [
      "Structural works without professional advice",
      "Luxury imported materials without contingency",
      "High upfront payment to contractors",
    ],
  };
}

function getAreaWarnings(areaName) {
  const name = areaName.toLowerCase();

  if (name.includes("kitchen")) {
    return [
      "Confirm sink, hob, hood, fridge and oven dimensions before cabinet fabrication.",
      "Confirm water point, drainage and power points before final cabinet measurement.",
      "Kitchen cost can increase quickly if countertop, hardware and accessories are upgraded.",
    ];
  }

  if (name.includes("bathroom")) {
    return [
      "Check waterproofing before tiling.",
      "Confirm water heater point, drainage and water pressure.",
      "Do not cover leakage issues before defect checking.",
    ];
  }

  if (name.includes("bedroom") || name.includes("room")) {
    return [
      "Confirm bed and wardrobe position before electrical point planning.",
      "Check aircond point and socket locations before painting or ceiling work.",
    ];
  }

  if (name.includes("living")) {
    return [
      "Confirm TV point, internet point, sockets, fan and lighting layout before plaster ceiling.",
      "Curtain measurement should be taken after ceiling and curtain box are confirmed.",
    ];
  }

  if (name.includes("porch")) {
    return [
      "Confirm autogate power point, drainage and CCTV point early.",
      "Check floor slope to reduce water ponding risk.",
    ];
  }

  return [
    "Confirm measurements before ordering materials or furniture.",
    "Take photos of hidden wiring and piping before closing walls or ceiling.",
  ];
}

function createMockAiVisionJson(project, scannedAreas) {
  const realism = getBudgetRealismText(project.budget);
  const recommendedStyle = getRecommendedStyleFromBudget(project.budget);
  const contingencyLow = Math.round(project.budget * 0.1);
  const contingencyHigh = Math.round(project.budget * 0.15);

  return {
    overallHomeSummary: `${project.houseType} with approximately ${project.size} sq ft and ${project.rooms} rooms. The renovation should focus first on defects, measurements, electrical planning, aircond points, plumbing, kitchen planning and waterproofing before cosmetic items.`,
    budgetRealism: {
      userBudgetMYR: Number(project.budget || 0),
      realisticLevel: realism.level,
      summary: realism.summary,
      recommendedStyle: recommendedStyle,
      notRecommended: realism.notRecommended,
    },
    detectedAreas: scannedAreas.map((area) => {
      const template = roomTemplates[area.name] || roomTemplates["Living Room"];
      const lowBudget = Math.round((area.starter || template.starter || 8000) * 0.8);
      const highBudget = Math.round((area.starter || template.starter || 8000) * 1.3);

      return {
        areaName: area.name,
        confidenceScore: area.confidence,
        likelyFunction: `Main function appears to be ${area.name.toLowerCase()} planning and renovation.`,
        renovationPriority:
          area.priority === "Must Do First"
            ? "High"
            : area.priority === "Before Move-In"
            ? "Medium"
            : "Low",
        phase: area.priority,
        suggestedWorks: area.needs,
        estimatedBudgetRangeMYR: `${RM.format(lowBudget)} to ${RM.format(highBudget)}`,
        keyReminders: [
          "Confirm actual site measurement before ordering.",
          "Confirm electrical and plumbing points before closing ceiling or walls.",
          "Keep quotation, receipt, payment proof and warranty documents.",
        ],
        buyNowItems: template.must.slice(0, 5),
        buyLaterItems: template.later.slice(0, 5),
        risksOrWarnings: getAreaWarnings(area.name),
      };
    }),
    priorityTasks: [
      "Do full house measurement.",
      "Check developer defects before renovation starts.",
      "Confirm electrical socket and lighting plan.",
      "Confirm aircond piping and aircond points.",
      "Confirm plumbing and water points.",
      "Confirm kitchen layout and appliance dimensions.",
      "Check waterproofing before tiling.",
      "Take photos of hidden wiring and piping.",
      "Compare quotations by scope, not only price.",
      "Do final defect checking before final payment.",
    ],
    reminders: [
      "Electrical and aircond points should be confirmed before plaster ceiling.",
      "Kitchen appliances should be selected before cabinet final measurement.",
      "Sink, hob, hood, fridge and oven dimensions should be confirmed before kitchen fabrication.",
      "Waterproofing should be checked before tiling.",
      "Take photos of hidden wiring and piping before closing ceiling or walls.",
      "Do not make final payment before defect checking.",
      "Check whether hacking, disposal, wiring, delivery and installation are included in quotations.",
      "Avoid paying too much upfront.",
      "Keep all receipts, warranties and payment proofs.",
      "Schedule deep cleaning before move-in.",
    ],
    contingencyBudgetSuggestion: `Set aside around ${RM.format(
      contingencyLow
    )} to ${RM.format(
      contingencyHigh
    )}, which is approximately 10% to 15% of your renovation budget, for unexpected items.`,
    disclaimer:
      "AI suggestions are for planning guidance only. Confirm measurements, hacking, electrical works, plumbing, waterproofing, structural matters and quotations with qualified contractors or professionals.",
  };
}

function FloorScan({ project, areas, setAreas, rooms, setRooms }) {
  const [file, setFile] = useState("developer-floor-plan.jpg");
  const [loading, setLoading] = useState(false);
  const [aiJson, setAiJson] = useState(() =>
    createMockAiVisionJson(project, areas)
  );
  const [showPrompt, setShowPrompt] = useState(false);

  function runScan() {
    setLoading(true);

    setTimeout(() => {
      const scanned = scanAreas(project);
      const jsonResult = createMockAiVisionJson(project, scanned);

      setAreas(scanned);
      setAiJson(jsonResult);
      setLoading(false);
    }, 700);
  }

  function add(area) {
    if (rooms.some((r) => r.name === area.name)) return;
    setRooms([...rooms, makeRoom(area)]);
  }

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(aiJson, null, 2));
    alert("JSON copied");
  }

  function copyPrompt() {
    navigator.clipboard.writeText(FLOOR_PLAN_AI_JSON_PROMPT);
    alert("AI prompt copied");
  }

  return (
    <div className="space-y-4 pb-28">
      <Section
        icon={ScanLine}
        title="Floor Plan Scan"
        subtitle="Upload a floor plan, developer brochure, layout image or room photo. Prototype uses mock AI scan and returns structured JSON."
      />

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-black">Upload floor plan</h3>
            <p className="text-sm leading-6 text-slate-500">
              For now, scanning is simulated based on house type. Later, this can connect to a real AI vision API.
            </p>
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            <Upload className="h-4 w-4" />
            Choose image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setFile(e.target.files?.[0]?.name || "Uploaded image")
              }
            />
          </label>
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 p-4">
          <div className="grid aspect-[4/3] grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-400">
            <div className="col-span-2 rounded-xl bg-slate-100 p-2">
              Living
            </div>
            <div className="rounded-xl bg-slate-100 p-2">Room</div>
            <div className="rounded-xl bg-slate-100 p-2">Dining</div>
            <div className="rounded-xl bg-slate-100 p-2">Kitchen</div>
            <div className="rounded-xl bg-slate-100 p-2">Bath</div>
            <div className="rounded-xl bg-slate-100 p-2">Master</div>
            <div className="rounded-xl bg-slate-100 p-2">Yard</div>
          </div>

          <p className="mt-3 truncate text-xs text-slate-500">
            Selected: {file}
          </p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            onClick={runScan}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
          >
            <ScanLine className="h-4 w-4" />
            {loading ? "Scanning..." : "Scan Floor Plan"}
          </button>

          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
          >
            <Bot className="h-4 w-4" />
            {showPrompt ? "Hide AI prompt" : "View AI prompt"}
          </button>
        </div>
      </Card>

      {showPrompt && (
        <Card>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-black">Future AI Vision Prompt</h3>
              <p className="text-sm leading-6 text-slate-500">
                Use this prompt later when connecting RenoGuide to a real AI vision API.
              </p>
            </div>

            <button
              onClick={copyPrompt}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"
            >
              Copy prompt
            </button>
          </div>

          <pre className="max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
            {FLOOR_PLAN_AI_JSON_PROMPT}
          </pre>
        </Card>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        {areas.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{a.name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  AI confidence: {a.confidence}%
                </p>
              </div>

              <Badge className={clsPriority(a.priority)}>{a.priority}</Badge>
            </div>

            <div className="mt-3">
              <Progress value={a.confidence} />
            </div>

            <div className="mt-3 rounded-2xl bg-slate-50 p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">
                Suggested renovation needs
              </p>

              {a.needs.map((n) => (
                <div key={n} className="flex gap-2 text-xs leading-5 text-slate-600">
                  <ClipboardCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {n}
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-slate-500">Starter budget</span>
              <span className="font-black">{RM.format(a.starter)}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => add(a)}
                className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"
              >
                {rooms.some((r) => r.name === a.name) ? "Added" : "Add area"}
              </button>

              <button
                onClick={() => add(a)}
                className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold"
              >
                Generate template
              </button>
            </div>
          </Card>
        ))}
      </div>

      {aiJson && (
        <Card>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black">Structured AI Scan JSON</h3>
              <p className="text-sm leading-6 text-slate-500">
                This is the mock JSON output format that the real AI floor plan scan should return later.
              </p>
            </div>

            <button
              onClick={copyJson}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"
            >
              Copy JSON
            </button>
          </div>

          <pre className="max-h-96 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
            {JSON.stringify(aiJson, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
function StylePlanner({ project, selectedStyle, setSelectedStyle }) {
  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={Palette} title="Style Planner" subtitle="RenoGuide recommends styles based on whether your budget can realistically support them." />
      <Card>
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-slate-700" />
          <div>
            <h3 className="font-bold text-slate-950">Your budget: {RM.format(project.budget || 0)}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">Choose a style that matches your budget. A stretch style can still work if you reduce carpentry, choose fewer premium materials or buy loose items later.</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-3 lg:grid-cols-2">
        {styles.map((style) => {
          const fit = getStyleFit(style, project.budget || 0);
          const selected = selectedStyle === style.name;
          return (
            <Card key={style.name} className={selected ? "ring-2 ring-slate-900" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">{style.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{style.description}</p>
                </div>
                <Badge className={fitClass(fit)}>{fit}</Badge>
              </div>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                <span className="font-bold text-slate-900">Sample room: </span>{style.sample}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <MiniList title="What can be done" items={style.can} good />
                <MiniList title="What to avoid" items={style.avoid} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">Suitable budget range</span>
                <span className="font-bold text-slate-950">{RM.format(style.min)}+</span>
              </div>
              <button
                onClick={() => setSelectedStyle(style.name)}
                className={`mt-3 w-full rounded-2xl px-4 py-3 text-sm font-bold ${selected ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"}`}
              >
                {selected ? "Selected" : "Select style"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Timeline({ timeline, setTimeline }) {
  const doneCount = timeline.filter((t) => t.done).length;
  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={CalendarCheck} title="Renovation Timeline" subtitle="A beginner-friendly sequence so you know what must happen before move-in." />
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-950">Overall sequence progress</h3>
            <p className="text-sm text-slate-500">{doneCount} of {timeline.length} phases completed</p>
          </div>
          <Badge>{Math.round((doneCount / timeline.length) * 100)}%</Badge>
        </div>
        <div className="mt-3"><ProgressBar value={(doneCount / timeline.length) * 100} /></div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-950">Important renovation warnings</h3>
        <div className="space-y-2">
          {importantWarnings.map((warning) => <AlertRow key={warning} text={warning} />)}
        </div>
      </Card>

      <div className="space-y-3">
        {timeline.map((phase, index) => (
          <Card key={phase.id}>
            <div className="flex gap-3">
              <button
                onClick={() => setTimeline(timeline.map((x) => (x.id === phase.id ? { ...x, done: !x.done } : x)))}
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${phase.done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                <CheckCircle2 className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{index + 1}</Badge>
                  <Badge className={priorityClasses[phase.priority]}>{phase.priority}</Badge>
                </div>
                <h3 className="mt-2 font-bold text-slate-950">{phase.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{phase.explanation}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Areas({ rooms, setRooms }) {
  const updateRoom = (id, patch) => setRooms(rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={DoorOpen} title="Areas / Rooms" subtitle="Each room has must-do-first items, can-buy-later items, budget, actual spending and status." />
      {!rooms.length && (
        <Card>
          <p className="text-sm text-slate-600">No room added yet. Go to Floor Plan Scan and add detected areas into your project.</p>
        </Card>
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        {rooms.map((room) => (
          <Card key={room.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950">{room.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{room.contractor}</p>
              </div>
              <Badge>{room.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <NumberInput label="Budget allocated" prefix="RM" value={room.allocated} onChange={(v) => updateRoom(room.id, { allocated: v })} />
              <NumberInput label="Actual spent" prefix="RM" value={room.spent} onChange={(v) => updateRoom(room.id, { spent: v })} />
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">Completion</span>
                <span className="font-bold text-slate-950">{room.completion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={room.completion}
                onChange={(e) => updateRoom(room.id, { completion: Number(e.target.value) })}
                className="w-full accent-slate-900"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniList title="Must do first" items={room.must} good />
              <MiniList title="Can buy later" items={room.later} />
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Room reminders</p>
              <div className="space-y-1.5">
                {room.reminders.map((item) => <div key={item} className="text-xs leading-5 text-slate-600">• {item}</div>)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BudgetTracker({ project, budgetItems, setBudgetItems }) {
  const [newItem, setNewItem] = useState({ category: "Electrical", room: "Whole House", planned: 0, actual: 0, quote: 0, paid: 0 });
  const totalPlanned = budgetItems.reduce((s, x) => s + Number(x.planned || 0), 0);
  const actual = budgetItems.reduce((s, x) => s + Number(x.actual || 0), 0);
  const quote = budgetItems.reduce((s, x) => s + Number(x.quote || 0), 0);
  const paid = budgetItems.reduce((s, x) => s + Number(x.paid || 0), 0);
  const unpaid = Math.max(0, quote - paid);
  const contingency = budgetItems.filter((x) => x.category === "Miscellaneous" || x.room === "Contingency").reduce((s, x) => s + Number(x.planned || 0), 0);
  const over = totalPlanned > Number(project.budget || 0);

  const add = () => {
    setBudgetItems([...budgetItems, { ...newItem, id: `b-${Date.now()}` }]);
    setNewItem({ category: "Electrical", room: "Whole House", planned: 0, actual: 0, quote: 0, paid: 0 });
  };

  const byCategory = categoryList.map((category) => ({ category, total: budgetItems.filter((x) => x.category === category).reduce((s, x) => s + Number(x.planned || 0), 0) })).filter((x) => x.total > 0);

  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={Wallet} title="Budget Tracker" subtitle="Track target budget, planned budget, quotations, actual spend, payments and over-budget warnings." />
      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard label="Target" value={RM.format(project.budget || 0)} note="Total budget" />
        <MetricCard label="Planned" value={RM.format(totalPlanned)} note={over ? "Over target" : "Within target"} />
        <MetricCard label="Actual" value={RM.format(actual)} note={`${RM.format((project.budget || 0) - actual)} remaining`} />
        <MetricCard label="Unpaid" value={RM.format(unpaid)} note={`${RM.format(paid)} paid`} />
      </div>
      {over && <AlertRow text="Your planned budget is higher than your target budget. Reduce scope, move loose items to later, or increase contingency." />}
      {contingency <= 0 && <AlertRow text="No contingency budget is included. Consider setting aside 10% to 15% for surprises." />}

      <Card>
        <h3 className="mb-3 font-bold text-slate-950">Budget by category</h3>
        <div className="space-y-3">
          {byCategory.map((x) => (
            <div key={x.category}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">{x.category}</span>
                <span className="font-bold text-slate-950">{RM.format(x.total)}</span>
              </div>
              <ProgressBar value={(x.total / Math.max(project.budget || 1, 1)) * 100} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-950">Add budget item</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectInput label="Category" value={newItem.category} onChange={(v) => setNewItem({ ...newItem, category: v })} options={categoryList} />
          <TextInput label="Room" value={newItem.room} onChange={(v) => setNewItem({ ...newItem, room: v })} />
          <NumberInput label="Planned" prefix="RM" value={newItem.planned} onChange={(v) => setNewItem({ ...newItem, planned: v })} />
          <NumberInput label="Actual spent" prefix="RM" value={newItem.actual} onChange={(v) => setNewItem({ ...newItem, actual: v })} />
          <NumberInput label="Quotation amount" prefix="RM" value={newItem.quote} onChange={(v) => setNewItem({ ...newItem, quote: v })} />
          <NumberInput label="Paid amount" prefix="RM" value={newItem.paid} onChange={(v) => setNewItem({ ...newItem, paid: v })} />
        </div>
        <button onClick={add} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add item</button>
      </Card>

      <div className="space-y-3">
        {budgetItems.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-950">{item.category}</h3>
                <p className="text-sm text-slate-500">{item.room}</p>
              </div>
              <Badge>{item.actual > item.planned ? "Over" : "OK"}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <SummaryBox label="Planned" value={RM.format(item.planned || 0)} />
              <SummaryBox label="Actual" value={RM.format(item.actual || 0)} />
              <SummaryBox label="Quote" value={RM.format(item.quote || 0)} />
              <SummaryBox label="Paid" value={RM.format(item.paid || 0)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
  );
}

function Quotations({ quotes, setQuotes }) {
  const [draft, setDraft] = useState({ contractor: "", amount: 0, scopeIncluded: "", scopeExcluded: "", material: "", warranty: "", timeline: "", payment: "", notes: "", rating: 3, deposit: 0, progress: 0, final: 0, retention: 0, dueDate: "", upfrontPercent: 30 });
  const addQuote = () => {
    if (!draft.contractor) return;
    setQuotes([...quotes, { ...draft, id: `q-${Date.now()}` }]);
    setDraft({ contractor: "", amount: 0, scopeIncluded: "", scopeExcluded: "", material: "", warranty: "", timeline: "", payment: "", notes: "", rating: 3, deposit: 0, progress: 0, final: 0, retention: 0, dueDate: "", upfrontPercent: 30 });
  };

  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={FileText} title="Quotations" subtitle="Compare contractors beyond price: scope, exclusions, material type, warranty, timeline and payment terms." />
      <Card>
        <h3 className="mb-3 font-bold text-slate-950">Quotation warnings</h3>
        <div className="space-y-2">
          {["Cheapest quote may exclude important items.", "Check whether hacking, disposal, wiring, installation and delivery are included.", "Check material brand and thickness.", "Check warranty.", "Do not pay too much upfront."].map((x) => <AlertRow key={x} text={x} />)}
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-950">Add quotation</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput label="Contractor name" value={draft.contractor} onChange={(v) => setDraft({ ...draft, contractor: v })} />
          <NumberInput label="Quotation amount" prefix="RM" value={draft.amount} onChange={(v) => setDraft({ ...draft, amount: v })} />
          <TextInput label="Scope included" value={draft.scopeIncluded} onChange={(v) => setDraft({ ...draft, scopeIncluded: v })} />
          <TextInput label="Scope excluded" value={draft.scopeExcluded} onChange={(v) => setDraft({ ...draft, scopeExcluded: v })} />
          <TextInput label="Material type" value={draft.material} onChange={(v) => setDraft({ ...draft, material: v })} />
          <TextInput label="Warranty" value={draft.warranty} onChange={(v) => setDraft({ ...draft, warranty: v })} />
          <TextInput label="Timeline" value={draft.timeline} onChange={(v) => setDraft({ ...draft, timeline: v })} />
          <TextInput label="Payment terms" value={draft.payment} onChange={(v) => setDraft({ ...draft, payment: v })} />
          <NumberInput label="Upfront payment %" value={draft.upfrontPercent} onChange={(v) => setDraft({ ...draft, upfrontPercent: v })} />
          <TextInput label="Due date" type="date" value={draft.dueDate} onChange={(v) => setDraft({ ...draft, dueDate: v })} />
        </div>
        <button onClick={addQuote} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add quotation</button>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {quotes.map((q) => (
          <Card key={q.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950">{q.contractor}</h3>
                <p className="mt-1 text-2xl font-black text-slate-950">{RM.format(q.amount || 0)}</p>
              </div>
              <Badge className={q.upfrontPercent > 35 ? "bg-red-50 text-red-700 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}>{q.upfrontPercent}% upfront</Badge>
            </div>
            {q.upfrontPercent > 35 && <div className="mt-3"><AlertRow text="High upfront payment entered. Consider milestone-based payment and avoid paying too much before work starts." /></div>}
            {!q.dueDate && <div className="mt-3"><AlertRow text="No due date is set for this contractor." /></div>}
            <div className="mt-3 space-y-2 text-sm">
              <SummaryLine label="Included" value={q.scopeIncluded || "Not stated"} />
              <SummaryLine label="Excluded" value={q.scopeExcluded || "Not stated"} />
              <SummaryLine label="Material" value={q.material || "Not stated"} />
              <SummaryLine label="Warranty" value={q.warranty || "Not stated"} />
              <SummaryLine label="Timeline" value={q.timeline || "Not stated"} />
              <SummaryLine label="Payment" value={q.payment || "Not stated"} />
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-2 font-bold text-slate-950"><CreditCard className="h-4 w-4" /> Payment milestone tracker</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <SummaryBox label="Deposit" value={RM.format(q.deposit || 0)} />
                <SummaryBox label="Progress" value={RM.format(q.progress || 0)} />
                <SummaryBox label="Final" value={RM.format(q.final || 0)} />
                <SummaryBox label="Retention" value={RM.format(q.retention || 0)} />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {["Payment proof", "Receipt", "Warranty document"].map((x) => <button key={x} className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-500">Upload {x}</button>)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Reminders({ reminders, setReminders, timeline, setTimeline }) {
  const [text, setText] = useState("");
  const [due, setDue] = useState("");
  const addReminder = () => {
    if (!text) return;
    setReminders([...reminders, { id: `r-${Date.now()}`, text, due, done: false, priority: "Before Move-In" }]);
    setText("");
    setDue("");
  };
  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={Bell} title="Reminders" subtitle="Keep track of important renovation checkpoints and defect checklists." />
      <Card>
        <h3 className="mb-3 font-bold text-slate-950">Add reminder</h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
          <TextInput label="Reminder" value={text} onChange={setText} placeholder="e.g. Test all sockets before final payment" />
          <TextInput label="Due date" type="date" value={due} onChange={setDue} />
          <button onClick={addReminder} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Add</button>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold text-slate-950">Renovation reminders</h3>
          <div className="space-y-2">
            {reminders.map((r) => (
              <button key={r.id} onClick={() => setReminders(reminders.map((x) => (x.id === r.id ? { ...x, done: !x.done } : x)))} className="flex w-full gap-3 rounded-2xl border border-slate-200 p-3 text-left hover:bg-slate-50">
                <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${r.done ? "text-emerald-600" : "text-slate-300"}`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${r.done ? "text-slate-400 line-through" : "text-slate-900"}`}>{r.text}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge className={priorityClasses[r.priority]}>{r.priority}</Badge>
                    {r.due && <Badge>{r.due}</Badge>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 font-bold text-slate-950">Defect checklist</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <ChecklistBox title="Before renovation" items={defectBefore} />
            <ChecklistBox title="After renovation" items={defectAfter} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChecklistBox({ title, items }) {
  const [checked, setChecked] = useState([]);
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="mb-2 text-sm font-bold text-slate-950">{title}</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <button key={item} onClick={() => setChecked(checked.includes(item) ? checked.filter((x) => x !== item) : [...checked, item])} className="flex w-full gap-2 text-left text-xs leading-5 text-slate-600">
            <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${checked.includes(item) ? "text-emerald-600" : "text-slate-300"}`} />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ShoppingList({ shopping, setShopping }) {
  const groups = ["Must buy before move-in", "Can buy slowly", "Optional upgrades"];
  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={ShoppingCart} title="Shopping List" subtitle="Separate essential move-in items from items you can buy slowly later." />
      {groups.map((group) => {
        const items = shopping.filter((x) => x.group === group);
        return (
          <Card key={group}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-bold text-slate-950">{group}</h3>
              <Badge>{RM.format(items.reduce((s, x) => s + Number(x.budget || 0), 0))}</Badge>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <button key={item.id} onClick={() => setShopping(shopping.map((x) => (x.id === item.id ? { ...x, bought: !x.bought } : x)))} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3 text-left hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${item.bought ? "text-emerald-600" : "text-slate-300"}`} />
                    <span className={`text-sm font-semibold ${item.bought ? "text-slate-400 line-through" : "text-slate-900"}`}>{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-950">{RM.format(item.budget || 0)}</span>
                </button>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function Documents() {
  const [uploads, setUploads] = useState({});
  return (
    <div className="space-y-4 pb-24">
      <SectionTitle icon={FolderOpen} title="Documents" subtitle="Keep placeholders for renovation documents. Prototype stores file names only." />
      <div className="grid gap-3 lg:grid-cols-2">
        {documentTypes.map((type) => (
          <Card key={type}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-950">{type}</h3>
                <p className="mt-1 truncate text-sm text-slate-500">{uploads[type] || "No file uploaded yet"}</p>
              </div>
              <label className="cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                Upload
                <input type="file" className="hidden" onChange={(e) => setUploads({ ...uploads, [type]: e.target.files?.[0]?.name || "Uploaded file" })} />
              </label>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RenoBuddy({ project, selectedStyle, warnings }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I’m Reno Buddy. Ask me things like: I have RM100k, what should I prioritise?" },
  ]);
  const [input, setInput] = useState("");

  const answer = (q) => {
    const text = q.toLowerCase();
    const budget = project.budget || 0;
    if (text.includes("100k") || text.includes("rm100")) return "With around RM100k, prioritise defects, electrical planning, aircond points, basic kitchen cabinet, essential lights, curtains, appliances and move-in furniture. Keep carpentry controlled and buy decor slowly later.";
    if (text.includes("80k") || text.includes("full-house carpentry")) return "Full-house carpentry is usually not realistic with RM80k unless the house is small and the scope is very limited. Focus on kitchen cabinet first, then selected wardrobes only if budget allows.";
    if (text.includes("plaster")) return "Before plaster ceiling, confirm electrical points, lighting layout, fan points, aircond piping, internet/CCTV wiring and take photos of hidden wiring before closing the ceiling.";
    if (text.includes("paying") || text.includes("final payment") || text.includes("contractor")) return "Before paying contractor, check defects, test sockets, switches, lights, water heater, aircond, drainage and leakage. Keep receipts, warranties and payment proof. Avoid final payment before defect checking.";
    if (text.includes("buy later")) return "You can usually buy sofa, dining table, TV, rugs, decor, side tables, extra storage, plants and smart home devices later. Move-in essentials should come first.";
    if (text.includes("double") || text.includes("200k")) return "For a double-storey terrace with RM200k, Modern Contemporary or Japandi-lite is usually more realistic. Prioritise kitchen, electrical, aircond, curtains, essential furniture and selected built-ins.";
    if (warnings.length) return `Based on your current plan, fix this first: ${warnings[0]} Then review budget allocation and contractor payment milestones.`;
    const profile = getBudgetProfile(budget);
    return `${profile.title}: ${profile.description} Your selected style is ${selectedStyle || "not selected yet"}. Start with defects, electrical, aircond, plumbing and kitchen planning before buying loose furniture.`;
  };

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages([...messages, { role: "user", text: q }, { role: "assistant", text: answer(q) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl sm:bottom-6"
      >
        <Bot className="h-5 w-5" /> Reno Buddy
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="mx-auto flex h-[85vh] max-w-md flex-col rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-2 text-white"><Bot className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-black text-slate-950">Reno Buddy</h3>
                    <p className="text-xs text-slate-500">Renovation planning assistant</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-6 ${m.role === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 p-3">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Ask Reno Buddy..."
                    className="flex-1 rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                  <button onClick={send} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">Send</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function computeWarnings({ project, selectedStyle, budgetItems, quotes, timeline, rooms }) {
  const warnings = [];
  const budget = Number(project.budget || 0);
  const planned = budgetItems.reduce((s, x) => s + Number(x.planned || 0), 0);
  const carpentry = budgetItems.filter((x) => x.category === "Carpentry" || x.category === "Kitchen").reduce((s, x) => s + Number(x.planned || 0), 0);
  const contingency = budgetItems.filter((x) => x.category === "Miscellaneous" || x.room === "Contingency").reduce((s, x) => s + Number(x.planned || 0), 0);
  const hasElectrical = budgetItems.some((x) => x.category === "Electrical" && Number(x.planned || 0) > 0);
  const hasKitchenCabinet = budgetItems.some((x) => x.category === "Kitchen" || (x.category === "Carpentry" && String(x.room).toLowerCase().includes("kitchen")));
  const hasAppliances = budgetItems.some((x) => x.category === "Appliances" && Number(x.planned || 0) > 0);
  const plasterDone = timeline.find((x) => x.title.includes("Plaster"))?.done;
  const wiringDone = timeline.find((x) => x.title.includes("Electrical"))?.done;
  const finalDone = timeline.find((x) => x.title.includes("Final inspection"))?.done;
  const defectDone = timeline.find((x) => x.title.includes("Defects"))?.done;

  if (planned > budget) warnings.push("Planned budget exceeds your target renovation budget.");
  if (selectedStyle) {
    const style = styles.find((x) => x.name === selectedStyle);
    if (style && getStyleFit(style, budget) === "Not Recommended") warnings.push(`Budget is too low for selected style: ${selectedStyle}.`);
  }
  if (budget && carpentry / budget > 0.38) warnings.push("Too much budget is allocated to carpentry / kitchen. Keep buffer for electrical, aircond, appliances and furniture.");
  if (!hasElectrical) warnings.push("Electrical planning budget is missing.");
  if (hasKitchenCabinet && !hasAppliances) warnings.push("Kitchen cabinet is added but appliances are not selected.");
  if (plasterDone && !wiringDone) warnings.push("Plaster ceiling is marked before wiring checklist is completed.");
  if (finalDone && !defectDone) warnings.push("Final payment / final inspection is marked before defect checking.");
  if (contingency <= 0) warnings.push("No contingency budget is included.");
  if (!quotes.length) warnings.push("No quotation is uploaded or recorded.");
  quotes.forEach((q) => {
    if (!q.dueDate) warnings.push(`${q.contractor}: no due date is set.`);
    if (Number(q.upfrontPercent || 0) > 35) warnings.push(`${q.contractor}: high upfront payment entered.`);
  });
  if (!rooms.length) warnings.push("No rooms or areas added yet. Scan and add your floor plan areas.");
  return [...new Set(warnings)];
}

export default function RenoGuideApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [project, setProject] = useState(() => localGet("renoguide.project", defaultProject));
  const [showOnboarding, setShowOnboarding] = useState(() => !localGet("renoguide.onboarded", false));
  const [scannedAreas, setScannedAreas] = useState(() => localGet("renoguide.scannedAreas", mockScanFloorPlan(defaultProject)));
  const [rooms, setRooms] = useState(() => localGet("renoguide.rooms", [makeRoomFromArea({ name: "Living Room", starterBudget: 18000, priority: "Must Do First" }), makeRoomFromArea({ name: "Kitchen", starterBudget: 35000, priority: "Must Do First" }), makeRoomFromArea({ name: "Master Bedroom", starterBudget: 24000, priority: "Before Move-In" })]));
  const [selectedStyle, setSelectedStyle] = useState(() => localGet("renoguide.style", "Modern Contemporary"));
  const [timeline, setTimeline] = useState(() => localGet("renoguide.timeline", baseTimeline));
  const [budgetItems, setBudgetItems] = useState(() => localGet("renoguide.budgetItems", defaultBudgetItems));
  const [quotes, setQuotes] = useState(() => localGet("renoguide.quotes", defaultQuotes));
  const [reminders, setReminders] = useState(() => localGet("renoguide.reminders", defaultReminders));
  const [shopping, setShopping] = useState(() => localGet("renoguide.shopping", defaultShopping));

  useEffect(() => localSet("renoguide.project", project), [project]);
  useEffect(() => localSet("renoguide.scannedAreas", scannedAreas), [scannedAreas]);
  useEffect(() => localSet("renoguide.rooms", rooms), [rooms]);
  useEffect(() => localSet("renoguide.style", selectedStyle), [selectedStyle]);
  useEffect(() => localSet("renoguide.timeline", timeline), [timeline]);
  useEffect(() => localSet("renoguide.budgetItems", budgetItems), [budgetItems]);
  useEffect(() => localSet("renoguide.quotes", quotes), [quotes]);
  useEffect(() => localSet("renoguide.reminders", reminders), [reminders]);
  useEffect(() => localSet("renoguide.shopping", shopping), [shopping]);

  const warnings = useMemo(() => computeWarnings({ project, selectedStyle, budgetItems, quotes, timeline, rooms }), [project, selectedStyle, budgetItems, quotes, timeline, rooms]);
  const CurrentIcon = tabs.find((t) => t.id === activeTab)?.icon || Home;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {showOnboarding && (
        <Onboarding
          project={project}
          setProject={setProject}
          onDone={() => {
            localSet("renoguide.onboarded", true);
            setShowOnboarding(false);
          }}
        />
      )}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-2 text-white shadow-sm"><Home className="h-5 w-5" /></div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">RenoGuide</h1>
                <Badge className="bg-blue-50 text-blue-700 ring-blue-200">PWA prototype</Badge>
              </div>
              <p className="text-xs text-slate-500">Renovation planning assistant · RM default</p>
            </div>
          </div>
          <button onClick={() => localStorage.clear()} className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:block">Reset demo</button>
        </div>
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ring-1 transition ${active ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>
                  <Icon className="h-4 w-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
            {activeTab === "dashboard" && <Dashboard project={project} budgetItems={budgetItems} quotes={quotes} rooms={rooms} reminders={reminders} selectedStyle={selectedStyle} warnings={warnings} setShowOnboarding={setShowOnboarding} setActiveTab={setActiveTab} />}
            {activeTab === "scan" && <FloorPlanScan project={project} scannedAreas={scannedAreas} setScannedAreas={setScannedAreas} rooms={rooms} setRooms={setRooms} />}
            {activeTab === "style" && <StylePlanner project={project} selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />}
            {activeTab === "timeline" && <Timeline timeline={timeline} setTimeline={setTimeline} />}
            {activeTab === "areas" && <Areas rooms={rooms} setRooms={setRooms} />}
            {activeTab === "budget" && <BudgetTracker project={project} budgetItems={budgetItems} setBudgetItems={setBudgetItems} />}
            {activeTab === "quotes" && <Quotations quotes={quotes} setQuotes={setQuotes} />}
            {activeTab === "reminders" && <Reminders reminders={reminders} setReminders={setReminders} timeline={timeline} setTimeline={setTimeline} />}
            {activeTab === "shopping" && <ShoppingList shopping={shopping} setShopping={setShopping} />}
            {activeTab === "documents" && <Documents />}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur sm:hidden">
        <div className="grid grid-cols-5 gap-1">
          {tabs.slice(0, 10).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-bold ${active ? "bg-slate-900 text-white" : "text-slate-500"}`}>
                <Icon className="mb-1 h-4 w-4" />
                <span className="max-w-full truncate">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <RenoBuddy project={project} selectedStyle={selectedStyle} warnings={warnings} />

      <div className="mx-auto max-w-6xl px-4 pb-28 text-xs leading-5 text-slate-500 sm:pb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-1 flex items-center gap-2 font-bold text-slate-700"><ShieldCheck className="h-4 w-4" /> Planning guidance disclaimer</div>
          AI suggestions are for planning guidance only. Confirm measurements, electrical works, plumbing, hacking, waterproofing, structural works and quotations with qualified contractors or professionals.
        </div>
      </div>
    </div>
  );
}
