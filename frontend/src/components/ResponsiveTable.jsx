/**
 * Tabla responsiva reutilizable.
 * En pantallas pequeñas convierte cada fila en una tarjeta apilada.
 * Props:
 *   headers: [{ key, label }]
 *   rows: array de objetos
 *   renderActions: (row) => JSX — columna de acciones opcional
 */
function ResponsiveTable({ headers, rows, renderActions }) {
  return (
    <>
      {/* Vista escritorio — tabla normal */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {headers.map((h) => (
                <th key={h.key} className="text-left text-gray-400 font-medium pb-3 pr-4">
                  {h.label}
                </th>
              ))}
              {renderActions && (
                <th className="text-center text-gray-400 font-medium pb-3">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                {headers.map((h) => (
                  <td key={h.key} className="py-3 pr-4">{row[h.key]}</td>
                ))}
                {renderActions && (
                  <td className="py-3 text-center">{renderActions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil — tarjetas apiladas */}
      <div className="md:hidden flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            {headers.map((h) => (
              <div key={h.key} className="flex justify-between items-start py-1 text-sm">
                <span className="text-gray-400 font-medium mr-2 shrink-0">{h.label}:</span>
                <span className="text-gray-700 text-right">{row[h.key]}</span>
              </div>
            ))}
            {renderActions && (
              <div className="mt-3 flex justify-end">{renderActions(row)}</div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default ResponsiveTable
