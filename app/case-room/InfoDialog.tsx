"use client";

import { useEffect, useId, useRef } from "react";

interface InfoDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function InfoDialog({ open, title, onClose, children }: InfoDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const titleId = "info-dialog-title-" + generatedId;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="info-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="dialog-panel">
        <div className="dialog-heading">
          <h2 id={titleId}>{title}</h2>
          <button
            ref={closeButtonRef}
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label={`${title} 닫기`}
          >
            ×
          </button>
        </div>
        <div className="dialog-content">{children}</div>
      </div>
    </dialog>
  );
}
