"use client";

import { motion } from "framer-motion";
import { Search, Plus, Trash2, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onToggle?: (row: T) => void;
  searchKey?: keyof T;
  isActiveKey?: keyof T;
}

export function DataTable<T extends { id: string }>({
  title, data, columns, onAdd, onEdit, onDelete, onToggle, searchKey, isActiveKey
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = search && searchKey
    ? data.filter((row) => String(row[searchKey]).toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-white">{title}</h1>
        <div className="flex items-center gap-3">
          {searchKey && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 h-9 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50 w-48"
              />
            </div>
          )}
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="gap-2 text-xs">
              <Plus size={14} /> Add New
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {columns.map((col) => (
                  <th key={String(col.key)} className="text-left px-5 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="text-right px-5 py-4 text-white/40 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-12 text-white/30 text-sm">
                    No items found
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-5 py-4 text-sm text-white/70">
                        {col.render
                          ? col.render(row[col.key as keyof T], row)
                          : String(row[col.key as keyof T] ?? "—")}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {isActiveKey && onToggle && (
                          <button
                            onClick={() => onToggle(row)}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              row[isActiveKey] ? "text-green-400 hover:bg-green-400/10" : "text-white/30 hover:bg-white/5"
                            )}
                            title={row[isActiveKey] ? "Deactivate" : "Activate"}
                          >
                            {row[isActiveKey] ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-[#FFD400] hover:bg-[#FFD400]/10 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.06] text-white/30 text-xs">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}{search ? ` matching "${search}"` : ""}
        </div>
      </div>
    </div>
  );
}
