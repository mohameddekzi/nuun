"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus, Trash2, GripVertical, CheckCircle, Eye, Download,
  ArrowLeft, Save, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quotation, QuotationItem } from "@/lib/types/database";
import { QuotationPreview } from "./quotation-preview";

type ItemDraft = Omit<QuotationItem, "created_at"> & { _new?: boolean };

interface QuotationBuilderProps {
  quotation?: Quotation;
  items?: QuotationItem[];
  userId: string;
}

const CURRENCIES = ["USD", "EUR", "GBP", "SOS", "KES", "ETB", "SAR", "AED"];
const STATUSES = [
  { value: "draft", label: "Draft", color: "text-white/50" },
  { value: "sent", label: "Sent", color: "text-blue-400" },
  { value: "accepted", label: "Accepted", color: "text-green-400" },
  { value: "declined", label: "Declined", color: "text-red-400" },
  { value: "invoiced", label: "Invoiced", color: "text-[#FFD400]" },
];

function SortableItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: ItemDraft;
  onUpdate: (id: string, field: keyof ItemDraft, value: string | number) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const total = item.quantity * item.unit_price;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2.5 group">
      <button {...attributes} {...listeners} className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripVertical size={16} />
      </button>
      <input
        value={item.description}
        onChange={(e) => onUpdate(item.id, "description", e.target.value)}
        placeholder="Item description..."
        className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 focus:outline-none"
      />
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => onUpdate(item.id, "quantity", parseFloat(e.target.value) || 0)}
        min="0"
        step="0.5"
        className="w-16 bg-transparent text-white text-sm text-center focus:outline-none border border-white/10 rounded-lg px-2 py-1"
        title="Quantity"
      />
      <input
        type="number"
        value={item.unit_price}
        onChange={(e) => onUpdate(item.id, "unit_price", parseFloat(e.target.value) || 0)}
        min="0"
        step="0.01"
        className="w-24 bg-transparent text-white text-sm text-right focus:outline-none border border-white/10 rounded-lg px-2 py-1"
        title="Unit price"
      />
      <span className="w-24 text-right text-[#FFD400] text-sm font-semibold flex-shrink-0">
        {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <button onClick={() => onRemove(item.id)} className="flex-shrink-0 p-1 text-white/20 hover:text-red-400 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function QuotationBuilder({ quotation, items: initialItems = [], userId }: QuotationBuilderProps) {
  const router = useRouter();
  const isNew = !quotation;

  const [form, setForm] = useState({
    type: quotation?.type ?? "quotation",
    status: quotation?.status ?? "draft",
    client_name: quotation?.client_name ?? "",
    client_email: quotation?.client_email ?? "",
    client_phone: quotation?.client_phone ?? "",
    client_company: quotation?.client_company ?? "",
    client_address: quotation?.client_address ?? "",
    issue_date: quotation?.issue_date?.split("T")[0] ?? new Date().toISOString().split("T")[0],
    due_date: quotation?.due_date?.split("T")[0] ?? "",
    currency: quotation?.currency ?? "USD",
    discount_type: quotation?.discount_type ?? "percentage",
    discount_value: quotation?.discount_value ?? 0,
    tax_rate: quotation?.tax_rate ?? 0,
    notes: quotation?.notes ?? "",
    terms: quotation?.terms ?? "Payment due within 30 days of invoice date.",
    footer_text: quotation?.footer_text ?? "Thank you for your business!",
  });

  const [lineItems, setLineItems] = useState<ItemDraft[]>(
    initialItems.length > 0
      ? initialItems.map((i) => ({ ...i }))
      : [{ id: crypto.randomUUID(), quotation_id: quotation?.id ?? "", order_index: 0, description: "", quantity: 1, unit_price: 0, _new: true }]
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [quoteId, setQuoteId] = useState(quotation?.id ?? "");
  const [quoteNumber, setQuoteNumber] = useState(quotation?.quote_number ?? "");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLineItems((items) => {
      const from = items.findIndex((i) => i.id === active.id);
      const to = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, from, to).map((item, idx) => ({ ...item, order_index: idx }));
    });
  };

  const addItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), quotation_id: quoteId, order_index: prev.length, description: "", quantity: 1, unit_price: 0, _new: true },
    ]);
  };

  const updateItem = useCallback((id: string, field: keyof ItemDraft, value: string | number) => {
    setLineItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i));
  }, []);

  const removeItem = useCallback((id: string) => {
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateForm = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Totals
  const subtotal = lineItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const discountAmt = form.discount_type === "percentage" ? subtotal * (form.discount_value / 100) : form.discount_value;
  const afterDiscount = subtotal - discountAmt;
  const taxAmt = afterDiscount * (form.tax_rate / 100);
  const total = afterDiscount + taxAmt;

  const handleSave = async (newStatus?: string) => {
    setSaving(true);
    const supabase = createClient();
    const data = { ...form, status: newStatus ?? form.status, created_by: userId };

    let qId = quoteId;
    let qNum = quoteNumber;

    if (isNew || !qId) {
      const { data: created, error } = await supabase.from("quotations").insert(data).select().single();
      if (error || !created) { setSaving(false); return; }
      qId = created.id;
      qNum = created.quote_number;
      setQuoteId(qId);
      setQuoteNumber(qNum);
    } else {
      await supabase.from("quotations").update(data).eq("id", qId);
    }

    // Save line items: delete all and re-insert
    await supabase.from("quotation_items").delete().eq("quotation_id", qId);
    if (lineItems.length > 0) {
      await supabase.from("quotation_items").insert(
        lineItems.map((item, idx) => ({
          quotation_id: qId,
          order_index: idx,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      );
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    if (isNew) {
      router.replace(`/studio/quotations/${qId}`);
    }
  };

  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/studio/quotations")} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">
              {isNew ? `New ${form.type === "invoice" ? "Invoice" : "Quotation"}` : `${form.type === "invoice" ? "Invoice" : "Quotation"} ${quoteNumber}`}
            </h1>
            {!isNew && (
              <p className="text-white/40 text-xs mt-0.5">
                {STATUSES.find((s) => s.value === form.status)?.label}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {saved && <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle size={14} /> Saved</span>}
          <Button variant="secondary" size="sm" className="gap-2 text-xs" onClick={() => setShowPreview(true)}>
            <Eye size={14} /> Preview
          </Button>
          <Button size="sm" className="gap-2 text-xs" onClick={() => handleSave()} loading={saving}>
            <Save size={14} /> Save
          </Button>
          {form.status === "draft" && (
            <Button size="sm" className="gap-2 text-xs bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleSave("sent")} loading={saving}>
              <Send size={14} /> Mark as Sent
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Type & Status */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/50 text-xs mb-2 block">Document Type</label>
                <div className="flex gap-2">
                  {["quotation", "invoice"].map((t) => (
                    <button
                      key={t}
                      onClick={() => updateForm("type", t)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${form.type === t ? "bg-[#FFD400]/10 border-[#FFD400]/40 text-[#FFD400]" : "border-white/10 text-white/50 hover:border-white/20"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-2 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50"
                >
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-white/50 text-xs mb-2 block">Currency</label>
                <select value={form.currency} onChange={(e) => updateForm("currency", e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50">
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-2 block">Issue Date</label>
                <input type="date" value={form.issue_date} onChange={(e) => updateForm("issue_date", e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50" />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-2 block">Due Date</label>
                <input type="date" value={form.due_date} onChange={(e) => updateForm("due_date", e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50" />
              </div>
            </div>
          </div>

          {/* Client info */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
            <h3 className="text-white/70 text-xs font-bold tracking-wider uppercase">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { field: "client_name" as const, label: "Name *", placeholder: "Full name" },
                { field: "client_company" as const, label: "Company", placeholder: "Company name" },
                { field: "client_email" as const, label: "Email", placeholder: "email@example.com" },
                { field: "client_phone" as const, label: "Phone", placeholder: "+252 61 ..." },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="text-white/50 text-xs mb-2 block">{label}</label>
                  <input
                    value={form[field] as string}
                    onChange={(e) => updateForm(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50 placeholder:text-white/20"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-white/50 text-xs mb-2 block">Address</label>
              <textarea
                value={form.client_address}
                onChange={(e) => updateForm("client_address", e.target.value)}
                placeholder="Client address..."
                rows={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50 resize-none placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white/70 text-xs font-bold tracking-wider uppercase">Line Items</h3>
              <span className="text-white/30 text-xs">Drag to reorder</span>
            </div>

            {/* Column headers */}
            <div className="flex items-center gap-2 px-7 text-white/30 text-xs">
              <span className="flex-1">Description</span>
              <span className="w-16 text-center">Qty</span>
              <span className="w-24 text-right">Unit Price</span>
              <span className="w-24 text-right">Total</span>
              <span className="w-6" />
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={lineItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {lineItems.map((item) => (
                    <SortableItem key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              onClick={addItem}
              className="w-full py-2.5 border border-dashed border-white/15 rounded-xl text-white/40 text-sm hover:border-[#FFD400]/30 hover:text-[#FFD400]/60 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          {/* Notes & Terms */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs mb-2 block">Notes</label>
              <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} placeholder="Internal notes or notes for client..." rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50 resize-none placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-2 block">Terms & Conditions</label>
              <textarea value={form.terms} onChange={(e) => updateForm("terms", e.target.value)} placeholder="Payment terms..." rows={3} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50 resize-none placeholder:text-white/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/50 text-xs mb-2 block">Footer Text</label>
              <input value={form.footer_text} onChange={(e) => updateForm("footer_text", e.target.value)} placeholder="Thank you for your business!" className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50 placeholder:text-white/20" />
            </div>
          </div>
        </div>

        {/* Right: totals */}
        <div className="space-y-5">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4 sticky top-6">
            <h3 className="text-white/70 text-xs font-bold tracking-wider uppercase">Summary</h3>

            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="text-white">{form.currency} {fmt(subtotal)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm flex-shrink-0">Discount</span>
                <select value={form.discount_type} onChange={(e) => updateForm("discount_type", e.target.value)} className="ml-auto bg-white/5 border border-white/10 rounded-lg text-white/60 text-xs px-2 py-1 focus:outline-none">
                  <option value="percentage">%</option>
                  <option value="fixed">Fixed</option>
                </select>
                <input type="number" value={form.discount_value} onChange={(e) => updateForm("discount_value", parseFloat(e.target.value) || 0)} min="0" className="w-20 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-right px-2 py-1 focus:outline-none" />
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/30">Discount amount</span>
                  <span className="text-red-400">-{form.currency} {fmt(discountAmt)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm">Tax (%)</span>
                <input type="number" value={form.tax_rate} onChange={(e) => updateForm("tax_rate", parseFloat(e.target.value) || 0)} min="0" max="100" className="ml-auto w-20 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-right px-2 py-1 focus:outline-none" />
              </div>
              {taxAmt > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/30">Tax amount</span>
                  <span className="text-white/60">+{form.currency} {fmt(taxAmt)}</span>
                </div>
              )}

              <div className="border-t border-white/[0.08] pt-3 flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#FFD400] font-black text-lg">{form.currency} {fmt(total)}</span>
              </div>
            </div>

            <Button onClick={() => handleSave()} loading={saving} className="w-full gap-2">
              <Save size={15} /> Save {form.type === "invoice" ? "Invoice" : "Quotation"}
            </Button>
            <Button variant="secondary" onClick={() => setShowPreview(true)} className="w-full gap-2">
              <Eye size={15} /> Preview / Print
            </Button>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <QuotationPreview
          form={form}
          lineItems={lineItems}
          quoteNumber={quoteNumber}
          subtotal={subtotal}
          discountAmt={discountAmt}
          taxAmt={taxAmt}
          total={total}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
