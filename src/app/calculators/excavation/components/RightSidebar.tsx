'use client';

import type { AuditEntry } from '../types';
import { AuditTrail } from './audit';

interface RightSidebarProps {
  auditEntries: AuditEntry[];
}

export function RightSidebar({ auditEntries }: RightSidebarProps) {
  return (
    <aside className="w-[320px] h-full bg-white border-l border-[#E2E8F0] flex flex-col overflow-hidden">
      <AuditTrail entries={auditEntries} />
    </aside>
  );
}

export default RightSidebar;
