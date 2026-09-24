'use client';

import { useState, useRef, type ReactNode, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

/**
 * Full ARIA tabs pattern (not just visually-tabbed divs): role="tablist"/
 * "tab"/"tabpanel", roving tabindex, and Left/Right/Home/End arrow-key
 * navigation between tabs per the WAI-ARIA Authoring Practices. Used for
 * player profile sections (Bio / Stats / Match History), admin settings
 * pages, and match report sections (Report / Lineups / Stats).
 */
export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultTab ?? tabs[0]?.key);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function focusTab(key: string) {
    setActiveKey(key);
    tabRefs.current[key]?.focus();
  }

  function tabKeyAt(index: number): string | undefined {
    return tabs[index]?.key;
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = tabs.length - 1;
    let nextKey: string | undefined;
    if (e.key === 'ArrowRight') nextKey = tabKeyAt(index === lastIndex ? 0 : index + 1);
    else if (e.key === 'ArrowLeft') nextKey = tabKeyAt(index === 0 ? lastIndex : index - 1);
    else if (e.key === 'Home') nextKey = tabKeyAt(0);
    else if (e.key === 'End') nextKey = tabKeyAt(lastIndex);
    if (nextKey) focusTab(nextKey);
  }

  const activeTab = tabs.find((t) => t.key === activeKey);

  return (
    <div className={className}>
      <div role="tablist" aria-label="Tabs" className="flex gap-1 border-b border-border">
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveKey(tab.key)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                '-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div role="tabpanel" id={`tabpanel-${activeTab.key}`} aria-labelledby={`tab-${activeTab.key}`} className="py-4">
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
