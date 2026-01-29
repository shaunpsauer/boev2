'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

interface NavigationProps {
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
}

export function Navigation({ onSave, onLoad, onExport, onSettings }: NavigationProps) {
  return (
    <nav className="flex items-center justify-between h-16 px-6 bg-white border-b border-[#E2E8F0]">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-semibold text-[#1E293B] hover:text-[#3B82F6] transition-colors">
          BOE Tools
        </Link>
        <div className="w-px h-6 bg-[#E2E8F0]"></div>
        <span className="text-base font-medium text-[#64748B]">Excavation Calculator</span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {onSave && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            }
          >
            Save
          </Button>
        )}
        {onLoad && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onLoad}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
          >
            Load
          </Button>
        )}
        {onExport && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            Export
          </Button>
        )}
        {onSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
