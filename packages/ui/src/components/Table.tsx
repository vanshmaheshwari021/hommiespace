import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto border border-brand-sand-dark/20 bg-white">
      <table className={`w-full text-left border-collapse text-xs ${className}`} {...props}>
        <thead>
          <tr className="bg-brand-sand-light border-b border-brand-sand-dark/25 text-brand-walnut/70 uppercase font-semibold tracking-wider">
            {headers.map((header, idx) => (
              <th key={idx} className="p-4 font-serif text-[10px]">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-sand-dark/15 text-brand-walnut">
          {children}
        </tbody>
      </table>
    </div>
  );
};
