import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface LinkModalProps {
  isOpen: boolean;
  initialUrl?: string;
  initialText?: string;
  onClose: () => void;
  onConfirm: (url: string, text: string) => void;
}

export const LinkModal: FC<LinkModalProps> = ({ isOpen, initialUrl = '', initialText = '', onClose, onConfirm }) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      // defer state updates to avoid synchronous setState in effect
      setTimeout(() => {
        setUrl(initialUrl || 'https://');
        setText(initialText || '');
      }, 0);
    }
  }, [isOpen, initialUrl, initialText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={() => { onClose(); }} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Inserir link</h3>
        </div>
        <div className="p-4" onClick={(e) => e.stopPropagation()}>
          <div className="mb-3">
            <label htmlFor="link-url" className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input id="link-url" value={url} onChange={(e) => setUrl(e.target.value)} type="url" required placeholder="https://example.com" className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3]" />
          </div>
          <div className="mb-3">
            <label htmlFor="link-text" className="block text-sm font-medium text-gray-700 mb-1">Texto do link</label>
            <input id="link-text" value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder="Texto visível" className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#195CE3]" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { onClose(); }} className="cursor-pointer px-4 py-2 border rounded-md text-sm">Cancelar</button>
            <button type="button" onClick={() => { if (url && url.trim()) onConfirm(url.trim(), text.trim()); }} className="cursor-pointer px-4 py-2 bg-[#0C2856] text-white rounded-md text-sm">Inserir</button>
          </div>
        </div>
      </div>
    </div>
  );
};
