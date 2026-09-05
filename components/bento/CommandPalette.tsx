'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BENTO, RESUME_URL } from './data';
import type { Mode, Page } from './prefs';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  page: Page;
  onNavigate: (page: Page) => void;
  onToggleTheme: () => void;
  onOpenContact: () => void;
}

interface Command {
  id: string;
  label: string;
  group: string;
  run: () => void;
  external?: boolean;
}

export default function CommandPalette({
  open,
  onOpenChange,
  mode,
  page,
  onNavigate,
  onToggleTheme,
  onOpenContact,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const canPortal = typeof document !== 'undefined';

  // Global shortcut works from anywhere on the page, not just while the
  // palette is already open — this is the only entry point besides the
  // visible ⌘K hint button in the top bar.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange]);

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = [];
    const otherPage: Page = page === 'work' ? 'personal' : 'work';
    list.push({
      id: 'nav',
      label: otherPage === 'work' ? 'Go to Work' : 'Go to Personal',
      group: 'Navigate',
      run: () => onNavigate(otherPage),
    });
    list.push({
      id: 'theme',
      label: mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
      group: 'Appearance',
      run: onToggleTheme,
    });
    list.push({
      id: 'contact',
      label: 'Send correspondence',
      group: 'Connect',
      run: onOpenContact,
    });
    list.push({
      id: 'email',
      label: `Email ${BENTO.contact.email}`,
      group: 'Connect',
      run: () => {
        window.location.href = `mailto:${BENTO.contact.email}`;
      },
    });
    list.push({
      id: 'github',
      label: 'Open GitHub',
      group: 'Connect',
      external: true,
      run: () => window.open(BENTO.contact.github, '_blank', 'noopener,noreferrer'),
    });
    list.push({
      id: 'linkedin',
      label: 'Open LinkedIn',
      group: 'Connect',
      external: true,
      run: () => window.open(BENTO.contact.linkedin, '_blank', 'noopener,noreferrer'),
    });
    list.push({
      id: 'resume',
      label: 'Download resume (PDF)',
      group: 'Connect',
      external: true,
      run: () => window.open(RESUME_URL, '_blank', 'noopener,noreferrer'),
    });
    list.push({
      id: 'feed',
      label: 'Subscribe to chronology (RSS)',
      group: 'Connect',
      external: true,
      run: () => window.open('/feed.xml', '_blank', 'noopener,noreferrer'),
    });
    for (const proj of [BENTO.projects.mapster, BENTO.projects.headcount]) {
      if (!proj.url) continue;
      list.push({
        id: `proj-${proj.host}`,
        label: `Open ${proj.name}`,
        group: 'Projects',
        external: true,
        run: () => window.open(proj.url, '_blank', 'noopener,noreferrer'),
      });
    }
    return list;
  }, [page, mode, onNavigate, onToggleTheme, onOpenContact]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  // Resetting query/selection when `open` flips is "adjusting state when a
  // prop changes" — React's own docs (and this project's set-state-in-effect
  // lint rule) call for doing this during render, not in a useEffect, so it
  // takes effect in the same render pass instead of causing an extra one.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    setQuery('');
    setSelected(0);
  }

  useEffect(() => {
    if (!open || !canPortal) return;
    const opener = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [open, canPortal]);

  const runCommand = (cmd: Command) => {
    cmd.run();
    onOpenChange(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[selected];
      if (cmd) runCommand(cmd);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [selected]);

  if (!open || !canPortal) return null;

  let lastGroup = '';

  return createPortal(
    <div className="cmdk-overlay" role="presentation" onClick={() => onOpenChange(false)}>
      <div
        className="cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          className="cmdk-input mono"
          placeholder="Jump to a page, a project, or say hello..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          aria-label="Command"
          aria-controls="cmdk-list"
          aria-activedescendant={filtered[selected] ? `cmdk-opt-${filtered[selected].id}` : undefined}
          role="combobox"
          aria-expanded="true"
        />
        <div className="cmdk-list" ref={listRef} id="cmdk-list" role="listbox">
          {filtered.length === 0 && <div className="cmdk-empty mono">No matches.</div>}
          {filtered.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            return (
              <div key={cmd.id}>
                {showGroup && <div className="cmdk-group mono">{cmd.group}</div>}
                <div
                  id={`cmdk-opt-${cmd.id}`}
                  role="option"
                  aria-selected={i === selected}
                  data-selected={i === selected}
                  className={`cmdk-item${i === selected ? ' on' : ''}`}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => runCommand(cmd)}
                >
                  {cmd.label}
                  {cmd.external && <span className="cmdk-external">&#8599;</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="cmdk-footer mono">
          <span>&uarr;&darr; navigate</span>
          <span>&crarr; select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
