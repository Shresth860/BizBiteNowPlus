import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CircleHelp, Play, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const DEMO_STEPS = {
  dashboard: [
    ["Overview", "Review today's sales, orders, revenue, and store health here."],
    ["Quick actions", "Use the quick action cards to jump directly to products, orders, or delivery."],
  ],
  orders: [
    ["Orders table", "Use status tabs and search to find customer orders."],
    ["Order actions", "Open an order to update its status, assign delivery, or view details."],
  ],
  products: [
    ["Product tabs", "Choose All, Active, or Out of Stock to filter the menu."],
    ["Add product", "Click Add Product to create a new menu item."],
    ["Availability", "Use the toggle on a product card to mark it available or out of stock."],
  ],
  billing: [
    ["Billing overview", "Review revenue, tax, payment method, and order totals here."],
    ["Filters", "Use payment, order type, and date filters to narrow the billing list."],
    ["Print bills", "Select orders and use the print actions to generate customer bills."],
  ],
  analytics: [
    ["Performance charts", "Compare revenue trends, orders, and product performance here."],
    ["Date range", "Change the range controls to inspect a different reporting period."],
  ],
  settings: [
    ["Store settings", "Update store profile, contact details, timings, and branding here."],
    ["Save changes", "Edit a setting and use its Save button to keep the local demo update."],
  ],
  delivery: [
    ["Delivery board", "See active orders and their delivery progress on this page."],
    ["Assign rider", "Open an order and choose a delivery partner to assign it."],
  ],
  dinein: [
    ["Tables", "View your tables and their current availability here."],
    ["Table actions", "Use the table actions to create, activate, or manage table QR codes."],
  ],
  staff: [
    ["Staff list", "Review staff members, roles, and their current status here."],
    ["Add staff", "Use Add Staff or New Staff to create a team member."],
  ],
  specialoffers: [
    ["Offers", "Review your active discount campaigns and customer offers here."],
    ["Create offer", "Use the create button to add a new discount for customers."],
  ],
  festivemenu: [
    ["Festive menus", "Browse active, scheduled, draft, and expired festive menus here."],
    ["Create menu", "Use Create Menu to build a seasonal menu from your products."],
  ],
  landingpage: [
    ["Landing sections", "Edit each storefront section by clicking its text or image."],
    ["Visibility", "Use the toggle on a section to show or hide it on the storefront."],
    ["Publish", "Click Publish Page when the storefront content is ready."],
  ],
  categories: [
    ["Categories", "Review the menu categories used to organize your products."],
    ["Manage categories", "Use Add Category, edit, or delete actions to maintain your menu."],
  ],
  customers: [
    ["Regular customers", "Review repeat customers, order counts, tiers, and estimated spend."],
    ["Search and sort", "Search by name or phone, then sort by orders or spending."],
  ],
  earnings: [
    ["Earnings", "Review revenue, payouts, and earning trends for your store."],
    ["Range controls", "Change the available range controls to compare performance."],
  ],
  profile: [
    ["Seller profile", "Review and update the store owner profile details here."],
    ["Save profile", "Edit a field and use the save action to keep the demo change."],
  ],
};

function getPageKey(pathname) {
  if (pathname.includes("landing-page")) return "landingpage";
  if (pathname.includes("special-offers")) return "specialoffers";
  if (pathname.includes("festivemenu")) return "festivemenu";
  if (pathname.includes("categories")) return "categories";
  if (pathname.includes("customers")) return "customers";
  if (pathname.includes("staff")) return "staff";
  if (pathname.includes("delivery")) return "delivery";
  if (pathname.includes("dine-in")) return "dinein";
  if (pathname.includes("billing")) return "billing";
  if (pathname.includes("analytics")) return "analytics";
  if (pathname.includes("earnings")) return "earnings";
  if (pathname.includes("products")) return "products";
  if (pathname.includes("orders")) return "orders";
  if (pathname.includes("settings")) return "settings";
  if (pathname.includes("profile")) return "profile";
  return "dashboard";
}

function getButtonLabel(button, index) {
  const label = button.getAttribute("aria-label") || button.getAttribute("title") || button.textContent;
  const cleanLabel = label?.replace(/\s+/g, " ").trim();
  return cleanLabel || `Action ${index + 1}`;
}

const PAGE_BUTTON_HINTS = {
  dashboard: "Use this dashboard control to inspect store performance or jump to a seller workspace.",
  orders: "Use this order control to inspect the customer order and move it through preparation or delivery.",
  products: "Use this product control to manage menu items, pricing, or availability.",
  billing: "Use this billing control to review payments, invoices, or order receipts.",
  analytics: "Use this analytics control to change the report view or inspect business performance.",
  settings: "Use this settings control to customize your store configuration.",
  delivery: "Use this delivery control to assign riders and monitor order movement.",
  dinein: "Use this table control to manage dine-in tables and QR ordering.",
  staff: "Use this staff control to manage team members and their access.",
  specialoffers: "Use this offer control to manage discounts shown to customers.",
  festivemenu: "Use this festive menu control to build and manage seasonal menus.",
  landingpage: "Use this storefront control to edit, arrange, or publish your public landing page.",
  categories: "Use this category control to organize the sections of your food menu.",
  customers: "Use this customer control to review repeat-customer activity and spending.",
  earnings: "Use this earnings control to review payouts and revenue performance.",
  profile: "Use this profile control to manage seller or store-owner information.",
};

const PAGE_ROLE_HINTS = {
  delivery: {
    add: "Add a delivery partner with their name and phone number.",
    edit: "Update this rider's contact details.",
    assign: "Assign the selected order to this delivery partner.",
    present: "Mark this delivery partner present or absent for today's shift.",
    remove: "Remove this delivery partner from the active team.",
  },
  products: {
    add: "Create a new food item with its price, category, image, and stock.",
    edit: "Open this food item to change its menu details.",
    delete: "Remove this food item from the seller catalog.",
    active: "Filter the catalog to show items currently available to customers.",
    stock: "Filter the catalog to show items that are out of stock.",
  },
  billing: {
    print: "Generate and print the selected customer bill.",
    export: "Download the filtered billing records for accounting.",
    filter: "Narrow billing records by payment, order type, or date.",
  },
  landingpage: {
    publish: "Publish the edited sections so customers can see the storefront changes.",
    visible: "Show or hide this section on the public storefront.",
    edit: "Change the text or image content in this storefront section.",
  },
  staff: {
    add: "Create a staff account and assign its role.",
    edit: "Update this staff member's profile or permissions.",
    delete: "Remove this staff member from the store team.",
  },
  orders: {
    status: "Move this order to its next preparation or delivery status.",
    assign: "Choose a delivery partner for this customer order.",
    view: "Open the full order details, items, customer, and payment information.",
  },
  categories: {
    add: "Create a new menu category for organizing products.",
    edit: "Rename or update this menu category.",
    delete: "Remove this category from the menu organization.",
  },
  festivemenu: {
    add: "Create a seasonal menu with festive products and dates.",
    edit: "Update this festive menu's products, dates, or visibility.",
    delete: "Remove this festive menu from the seller workspace.",
  },
};

const PAGE_NAMES = {
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
  billing: "Billing",
  analytics: "Analytics",
  settings: "Settings",
  delivery: "Delivery Team",
  dinein: "Dine-in Tables",
  staff: "Staff Management",
  specialoffers: "Special Offers",
  festivemenu: "Festive Menus",
  landingpage: "Landing Page Editor",
  categories: "Menu Categories",
  customers: "Regular Customers",
  earnings: "Earnings",
  profile: "Seller Profile",
};

function getButtonDescription(label, pageKey, index) {
  const normalized = label.toLowerCase();
  const pageHint = PAGE_BUTTON_HINTS[pageKey] || "This page control helps you continue the seller workflow.";
  const roleHints = PAGE_ROLE_HINTS[pageKey] || {};
  const buttonContext = `${PAGE_NAMES[pageKey] || "Seller page"} button ${index + 1}, "${label}".`;
  const roleMatch = Object.keys(roleHints).find((role) => normalized.includes(role));
  if (roleMatch) return `${buttonContext} ${pageHint} ${roleHints[roleMatch]}`;
  if (normalized.includes("add") || normalized.includes("create") || normalized.includes("new")) return `${buttonContext} ${pageHint} Click here to add a new record.`;
  if (normalized.includes("edit") || normalized.includes("pencil")) return `${buttonContext} ${pageHint} Click here to edit the selected record.`;
  if (normalized.includes("delete") || normalized.includes("remove")) return `${buttonContext} ${pageHint} Click here to remove the selected record.`;
  if (normalized.includes("save")) return `${buttonContext} ${pageHint} Click here to save the changes made on this page.`;
  if (normalized.includes("publish")) return `${buttonContext} ${pageHint} Click here to publish the latest storefront changes.`;
  if (normalized.includes("filter")) return `${buttonContext} ${pageHint} Click here to narrow the visible records.`;
  if (normalized.includes("sort")) return `${buttonContext} ${pageHint} Click here to change the order of the records.`;
  if (normalized.includes("search")) return `${buttonContext} ${pageHint} Click here to search the page records.`;
  if (normalized.includes("export") || normalized.includes("download")) return `${buttonContext} ${pageHint} Click here to download the current page data.`;
  if (normalized.includes("print")) return `${buttonContext} ${pageHint} Click here to print the selected bill or report.`;
  if (normalized.includes("status") || normalized.includes("toggle") || normalized.includes("active")) return `${buttonContext} ${pageHint} Use this control to change whether the selected item is active.`;
  if (normalized.includes("view") || normalized.includes("details") || normalized.includes("open")) return `${buttonContext} ${pageHint} Click here to open the full details for this record.`;
  if (normalized.includes("cancel") || normalized.includes("close")) return `${buttonContext} ${pageHint} Click here to close this panel without continuing the current action.`;
  if (normalized.includes("next") || normalized.includes("continue")) return `${buttonContext} ${pageHint} Click here to continue to the next step in this workflow.`;
  if (normalized.includes("back") || normalized.includes("previous")) return `${buttonContext} ${pageHint} Click here to return to the previous step or page.`;
  return `${buttonContext} ${pageHint} Click this control to continue the seller workflow shown here.`;
}

export default function DemoGuide() {
  const { pathname } = useLocation();
  const pageKey = getPageKey(pathname);
  const [steps, setSteps] = useState(DEMO_STEPS[pageKey] || DEMO_STEPS.dashboard);
  const [isOpen, setIsOpen] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const focusedButtonRef = useRef(null);

  useEffect(() => {
    let lastSignature = "";
    const scanButtons = () => {
      const buttons = [...document.querySelectorAll("main button:not([data-demo-exclude])")].filter(
        (button) => !button.disabled && button.offsetParent !== null,
      );
      const signature = buttons.map((button) => getButtonLabel(button, 0)).join("|");
      if (!buttons.length || signature === lastSignature) return;
      lastSignature = signature;
      const buttonSteps = buttons.map((button, index) => {
        const label = getButtonLabel(button, index);
        return [label, getButtonDescription(label, pageKey, index), button];
      });

      setSteps(buttonSteps);
    };

    const initialTimer = window.setTimeout(scanButtons, 120);
    const retryTimer = window.setTimeout(scanButtons, 700);
    const observer = document.querySelector("main")
      ? new MutationObserver(scanButtons)
      : null;
    observer?.observe(document.querySelector("main"), { childList: true, subtree: true });

    setIsOpen(true);
    setStepIndex(0);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearTimeout(retryTimer);
      observer?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const button = steps[stepIndex]?.[2];
    const previousButton = focusedButtonRef.current;

    if (previousButton && previousButton !== button) {
      previousButton.style.removeProperty("box-shadow");
      previousButton.style.removeProperty("outline");
      previousButton.style.removeProperty("position");
      previousButton.style.removeProperty("z-index");
      focusedButtonRef.current = null;
    }

    if (!isOpen || !button || !document.body.contains(button)) return undefined;

    button.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    button.style.setProperty("position", "relative");
    button.style.setProperty("z-index", "70");
    button.style.setProperty("outline", "3px solid #F4A300");
    button.style.setProperty("box-shadow", "0 0 0 9999px rgba(15, 23, 42, 0.48)");
    focusedButtonRef.current = button;

    return () => {
      button.style.removeProperty("box-shadow");
      button.style.removeProperty("outline");
      button.style.removeProperty("position");
      button.style.removeProperty("z-index");
    };
  }, [isOpen, stepIndex, steps]);

  const closeDemo = () => setIsOpen(false);
  const step = steps[stepIndex] || DEMO_STEPS.dashboard[0];

  return (
    <>
      <button
        type="button"
        data-demo-exclude="true"
        onClick={() => {
          setStepIndex(0);
          setIsOpen(true);
        }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#16522D] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#103d21]"
        title="Open page demo"
      >
        <CircleHelp size={17} />
        Demo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#16522D]">
                  <Play size={16} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-widest">Page demo</span>
                </div>
                <h2 className="mt-2 text-xl font-black text-slate-900">{step[0]}</h2>
              </div>
              <button type="button" data-demo-exclude="true" onClick={closeDemo} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" title="Skip demo">
                <X size={18} />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">{step[1]}</p>
            <div className="mt-5 flex items-center gap-1.5">
              {steps.map((_, index) => (
                <span key={index} className={`h-1.5 rounded-full transition-all ${index === stepIndex ? "w-7 bg-[#16522D]" : "w-1.5 bg-slate-200"}`} />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button type="button" data-demo-exclude="true" onClick={closeDemo} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
                Skip demo
              </button>
              <div className="flex items-center gap-2">
                <button type="button" data-demo-exclude="true" disabled={stepIndex === 0} onClick={() => setStepIndex((index) => index - 1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" title="Previous step">
                  <ChevronLeft size={17} />
                </button>
                <button type="button" data-demo-exclude="true" onClick={() => (stepIndex === steps.length - 1 ? closeDemo() : setStepIndex((index) => index + 1))} className="flex items-center gap-2 rounded-xl bg-[#16522D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#103d21]">
                  {stepIndex === steps.length - 1 ? "Done" : "Next"}
                  {stepIndex < steps.length - 1 && <ChevronRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
