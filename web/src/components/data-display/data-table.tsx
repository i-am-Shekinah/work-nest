import Link from "next/link";

import { Card } from "@/components/ui/card";

export type DataColumn<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
};

export function DataTable<T extends { id: string }>({
  title,
  rows,
  columns,
  rowHref,
}: {
  title: string;
  rows: T[];
  columns: DataColumn<T>[];
  rowHref?: (row: T) => string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 font-medium">
                  {column.header}
                </th>
              ))}
              {rowHref ? <th className="px-6 py-3" /> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              return (
                <tr key={row.id} className="border-t border-slate-100">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 align-top text-slate-700">
                      {column.render(row)}
                    </td>
                  ))}
                  {rowHref ? (
                    <td className="px-6 py-4 text-right">
                      <Link href={rowHref(row)} className="text-sm font-semibold text-cyan-700">
                        View
                      </Link>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
