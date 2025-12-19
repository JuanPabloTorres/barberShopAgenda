import React from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Icons } from "@/ui/icons";

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search",
  dateValue,
  onDateChange,
  onClear,
  children,
}: {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  dateValue?: string;
  onDateChange?: (value: string) => void;
  onClear?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-cream-200 bg-cream-100 px-6 py-5 my-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
        {onSearchChange && (
          <div className="w-full md:max-w-xs relative">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue || ""}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slatewood-400 pointer-events-none">
              <Icons.search className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>
        )}
        {onDateChange && (
          <div className="w-full md:max-w-[180px]">
            <Input
              type="date"
              value={dateValue || ""}
              onChange={(event) => onDateChange(event.target.value)}
            />
          </div>
        )}
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
      {onClear && (
        <Button type="button" className="bg-chrome-600 hover:bg-chrome-700 flex items-center gap-2" onClick={onClear}>
          <Icons.filter className="w-4 h-4" aria-hidden="true" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
