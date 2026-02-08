import React, { useState } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

function DataTable({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onAdd, 
  title, 
  loading = false,
  filterOptions = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterValue, setFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = !filterOptions || !filterValue || item[filterOptions.key] === filterValue;
    return matchesSearch && matchesFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-semibold mb-0">{title}</h5>
          {onAdd && (
            <button className="btn btn-primary btn-sm" onClick={onAdd}>
              <PlusIcon style={{width: '16px', height: '16px'}} className="me-1" />
              Add New
            </button>
          )}
        </div>
        <div className="mt-3">
          <div className="row g-2">
            <div className={filterOptions ? 'col-md-8' : 'col-12'}>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filterOptions && (
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">{filterOptions.label}</option>
                  {filterOptions.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    className="border-0 fw-semibold"
                    style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    {column.label}
                    {sortField === column.key && (
                      <span className="ms-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
                <th className="border-0 fw-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td key={column.key} className="py-3">
                      {column.render ? column.render(item[column.key], item) : item[column.key]}
                    </td>
                  ))}
                  <td className="py-3 text-center">
                    <div className="d-flex justify-content-center gap-1">
                      {onEdit && (
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit(item)}
                          title="Edit"
                        >
                          <PencilIcon style={{width: '16px', height: '16px'}} />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(item.id)}
                          title="Delete"
                        >
                          <TrashIcon style={{width: '16px', height: '16px'}} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="card-footer bg-transparent border-0">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} entries
            </small>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;