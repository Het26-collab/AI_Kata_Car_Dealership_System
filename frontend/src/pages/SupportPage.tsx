import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { useToast } from "../hooks/useToast";

const FAQ_ITEMS = [
  {
    q: "How do I add a new vehicle to the Global Motors inventory?",
    a: "Admin users can click the '+ Add Vehicle' button in the sidebar or top navigation on the Inventory page. Fill in the vehicle specification details (VIN, Make, Model, Trim, Year, Category, Price, Quantity) and click Save.",
  },
  {
    q: "What happens when a vehicle quantity reaches zero?",
    a: "Vehicles with 0 quantity automatically show an 'Out of Stock' badge and the Purchase button is disabled. Admin users can click 'Restock' on the vehicle card to increase stock.",
  },
  {
    q: "How can I export fleet inventory reports?",
    a: "You can click the 'Export List' button on the Inventory page or 'Export' on the Fleet Overview Dashboard to download a complete CSV spreadsheet.",
  },
  {
    q: "How do user permissions and roles work?",
    a: "Administrators have full access to add, edit, delete, and restock vehicles. Standard users can view inventory, filter vehicles, purchase units, and export reports.",
  },
];

export function SupportPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ticket Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Inventory Management");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast({
        variant: "error",
        title: "Validation Error",
        description: "Please fill in both subject and message before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubject("");
      setMessage("");
      showToast({
        variant: "success",
        title: "Support Ticket Created",
        description: "Your inquiry #SUP-84291 has been sent to AutoFleet Pro support center.",
      });
    }, 600);
  }

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">Help & Enterprise Support</h1>
          <p className="text-body-md text-on-surface-variant">
            Get assistance, browse documentation, or submit a priority support request.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <span className="inline-flex items-center gap-xs rounded-full bg-emerald-500/10 px-md py-xs text-label-sm font-semibold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            24/7 Desk Active
          </span>
        </div>
      </div>

      {/* Support Quick Contact Cards */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-container text-on-primary-container mb-md">
            <span className="material-symbols-outlined">headset_mic</span>
          </div>
          <h3 className="text-title-md font-bold text-on-surface">Direct Phone Hotline</h3>
          <p className="mt-xs text-body-md text-on-surface-variant">Toll-free dedicated fleet support</p>
          <p className="mt-md text-title-md font-semibold text-primary">+1 (800) 555-FLEET</p>
        </div>

        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container text-on-secondary-container mb-md">
            <span className="material-symbols-outlined">mark_email_read</span>
          </div>
          <h3 className="text-title-md font-bold text-on-surface">Priority Email</h3>
          <p className="mt-xs text-body-md text-on-surface-variant">Average response under 15 mins</p>
          <p className="mt-md text-title-md font-semibold text-primary">support@autofleetpro.com</p>
        </div>

        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary-container mb-md">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <h3 className="text-title-md font-bold text-on-surface">SLA Guarantee</h3>
          <p className="mt-xs text-body-md text-on-surface-variant">Enterprise uptime SLA</p>
          <p className="mt-md text-title-md font-semibold text-emerald-600">99.99% Guaranteed</p>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3">
        {/* FAQs */}
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card lg:col-span-2">
          <div className="flex items-center justify-between gap-md mb-md">
            <h3 className="text-title-lg font-bold text-on-surface">Frequently Asked Questions</h3>
          </div>
          <Input
            label=""
            name="searchFaq"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="mb-lg"
          />

          <div className="space-y-sm">
            {filteredFaqs.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-md">No articles found matching "{searchQuery}".</p>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="rounded-lg border border-outline-variant/60 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-md text-left text-title-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                        {isOpen ? "expand_less" : "expand_more"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-md pt-0 text-body-md text-on-surface-variant border-t border-outline-variant/30 bg-surface-container-lowest">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Contact Support Ticket Form */}
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-card">
          <h3 className="text-title-lg font-bold text-on-surface mb-xs">Create Support Ticket</h3>
          <p className="text-body-md text-on-surface-variant mb-md">Submit a request to our engineering team.</p>

          <form onSubmit={handleSubmitTicket} className="space-y-md">
            <Input
              label="Subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Issue with CSV export"
              required
            />

            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Inventory Management">Inventory Management</option>
              <option value="Account Permissions">Account Permissions</option>
              <option value="Database Sync">Database Sync</option>
              <option value="Billing & License">Billing & License</option>
            </Select>

            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Issue</option>
            </Select>

            <div className="flex flex-col gap-xs">
              <label className="text-body-md font-medium text-on-surface">Message / Description</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or feedback in detail..."
                rows={4}
                required
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center" isLoading={isSubmitting}>
              <span className="material-symbols-outlined text-[18px]">send</span>
              Submit Ticket
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
