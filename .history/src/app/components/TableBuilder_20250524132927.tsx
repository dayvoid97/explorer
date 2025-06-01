'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface TableCell {
  id: string
  content: string
}

interface TableRow {
  id: string
  cells: TableCell[]
}

interface TableBuilderProps {
  onTableChange?: (tableData: TableRow[]) => void
  initialRows?: number
  initialCols?: number
}

export default function TableBuilder({
  onTableChange,
  initialRows = 2,
  initialCols = 3,
}: TableBuilderProps) {
  const [tableData, setTableData] = useState<TableRow[]>(() => {
    // Initialize with default table structure
    return Array.from({ length: initialRows }, (_, rowIndex) => ({
      id: `row-${rowIndex}`,
      cells: Array.from({ length: initialCols }, (_, colIndex) => ({
        id: `cell-${rowIndex}-${colIndex}`,
        content: '',
      })),
    }))
  })

  const updateTableData = (newData: TableRow[]) => {
    setTableData(newData)
    onTableChange?.(newData)
  }

  const updateCellContent = (rowId: string, cellId: string, content: string) => {
    const newData = tableData.map((row) =>
      row.id === rowId
        ? {
            ...row,
            cells: row.cells.map((cell) => (cell.id === cellId ? { ...cell, content } : cell)),
          }
        : row
    )
    updateTableData(newData)
  }

  const addRow = () => {
    const newRowId = `row-${Date.now()}`
    const colCount = tableData[0]?.cells.length || 3
    const newRow: TableRow = {
      id: newRowId,
      cells: Array.from({ length: colCount }, (_, colIndex) => ({
        id: `cell-${newRowId}-${colIndex}`,
        content: '',
      })),
    }
    updateTableData([...tableData, newRow])
  }

  const addColumn = () => {
    const newData = tableData.map((row, rowIndex) => ({
      ...row,
      cells: [
        ...row.cells,
        {
          id: `cell-${row.id}-${row.cells.length}`,
          content: '',
        },
      ],
    }))
    updateTableData(newData)
  }

  const deleteRow = (rowId: string) => {
    if (tableData.length <= 1) return // Keep at least one row
    updateTableData(tableData.filter((row) => row.id !== rowId))
  }

  const deleteColumn = (columnIndex: number) => {
    if (tableData[0]?.cells.length <= 1) return // Keep at least one column
    const newData = tableData.map((row) => ({
      ...row,
      cells: row.cells.filter((_, index) => index !== columnIndex),
    }))
    updateTableData(newData)
  }

  const exportTableData = () => {
    return tableData.map((row) => row.cells.map((cell) => cell.content))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg border border-gray-200">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Table Builder</h3>
        <div className="text-sm text-gray-500">
          {tableData.length} rows × {tableData[0]?.cells.length || 0} columns
        </div>
      </div>

      <div className="relative">
        {/* Table Container */}
        <div className="overflow-auto border border-blue-200 rounded-lg bg-blue-50/30">
          <table className="w-full">
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={row.id} className="group">
                  {/* Row drag handle */}
                  <td className="w-8 border-r border-blue-200 bg-blue-100/50 relative">
                    <div className="flex items-center justify-center h-full py-2">
                      <GripVertical size={14} className="text-gray-400" />
                      <button
                        onClick={() => deleteRow(row.id)}
                        className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                        title="Delete row"
                      >
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </td>

                  {/* Table cells */}
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cell.id} className="group/cell border-r border-blue-200 relative">
                      {/* Column delete button */}
                      {rowIndex === 0 && (
                        <button
                          onClick={() => deleteColumn(cellIndex)}
                          className="absolute -top-2 right-1 opacity-0 group-hover/cell:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded z-10"
                          title="Delete column"
                        >
                          <Trash2 size={12} className="text-red-500" />
                        </button>
                      )}

                      <input
                        type="text"
                        value={cell.content}
                        onChange={(e) => updateCellContent(row.id, cell.id, e.target.value)}
                        placeholder={
                          rowIndex === 0
                            ? `Header ${cellIndex + 1}`
                            : `Cell ${rowIndex}-${cellIndex + 1}`
                        }
                        className="w-full p-3 border-0 bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-sm"
                      />
                    </td>
                  ))}

                  {/* Add column button (only on first row) */}
                  {rowIndex === 0 && (
                    <td className="w-12 bg-blue-100/50">
                      <button
                        onClick={addColumn}
                        className="w-full h-full flex items-center justify-center py-3 hover:bg-blue-200/50 transition-colors"
                        title="Add column"
                      >
                        <Plus size={16} className="text-blue-600" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add row button */}
          <div className="border-t border-blue-200 bg-blue-100/50">
            <button
              onClick={addRow}
              className="w-full py-3 flex items-center justify-center hover:bg-blue-200/50 transition-colors"
              title="Add row"
            >
              <Plus size={16} className="text-blue-600 mr-2" />
              <span className="text-sm text-blue-700 font-medium">Add Row</span>
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex gap-2 text-sm">
          <button
            onClick={() => {
              const data = exportTableData()
              console.log('Table data:', data)
              navigator.clipboard.writeText(JSON.stringify(data, null, 2))
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
          >
            Copy Data
          </button>
          <button
            onClick={() => {
              const csvContent = tableData
                .map((row) => row.cells.map((cell) => `"${cell.content}"`).join(','))
                .join('\n')
              navigator.clipboard.writeText(csvContent)
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
          >
            Copy as CSV
          </button>
        </div>
      </div>
    </div>
  )
}
