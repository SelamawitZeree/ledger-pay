"use client";

import { useState, useEffect } from "react";

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'users' | 'tenants' | 'transactions';
  data: any;
}

export function MetricsModal({ isOpen, onClose, type, data }: MetricsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        generateMockData();
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, type]);

  const generateMockData = () => {
    switch (type) {
      case 'users':
        setModalData(Array.from({ length: 50 }, (_, i) => ({
          id: `user-${i + 1}`,
          username: `user${i + 1}`,
          email: `user${i + 1}@ledgerpay.com`,
          role: i % 3 === 0 ? 'ADMIN' : i % 3 === 1 ? 'USER' : 'AUDITOR',
          tenantId: `TENANT-${Math.floor(Math.random() * 100) + 1}`,
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: Math.random() > 0.1 ? 'ACTIVE' : 'INACTIVE'
        })));
        break;
      case 'tenants':
        setModalData(Array.from({ length: 45 }, (_, i) => ({
          id: `TENANT-${i + 1}`,
          name: `Company ${i + 1}`,
          description: `Financial services company ${i + 1}`,
          userCount: Math.floor(Math.random() * 50) + 10,
          accountCount: Math.floor(Math.random() * 20) + 5,
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: Math.random() > 0.05 ? 'ACTIVE' : 'SUSPENDED'
        })));
        break;
      case 'transactions':
        setModalData(Array.from({ length: 100 }, (_, i) => ({
          id: `TX-${10000 + i}`,
          reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          amount: (Math.random() * 10000 + 100).toFixed(2),
          currency: i % 3 === 0 ? 'EUR' : i % 3 === 1 ? 'USD' : 'GBP',
          type: i % 4 === 0 ? 'PAYMENT' : i % 4 === 1 ? 'TRANSFER' : i % 4 === 2 ? 'DEPOSIT' : 'WITHDRAWAL',
          status: Math.random() > 0.05 ? 'COMPLETED' : 'PENDING',
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
          accountId: `ACC-${Math.floor(Math.random() * 100) + 1}`
        })));
        break;
    }
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'users': return 'User Management';
      case 'tenants': return 'Tenant Management';
      case 'transactions': return 'Transaction History';
      default: return 'Data View';
    }
  };

  const getColumns = () => {
    switch (type) {
      case 'users':
        return ['Username', 'Email', 'Role', 'Tenant ID', 'Last Login', 'Status'];
      case 'tenants':
        return ['Name', 'Description', 'Users', 'Accounts', 'Created', 'Status'];
      case 'transactions':
        return ['ID', 'Reference', 'Amount', 'Currency', 'Type', 'Status', 'Timestamp'];
      default:
        return [];
    }
  };

  const renderRowData = (item: any) => {
    switch (type) {
      case 'users':
        return [
          item.username,
          item.email,
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
            item.role === 'USER' ? 'bg-blue-100 text-blue-800' :
            'bg-purple-100 text-purple-800'
          }`}>{item.role}</span>,
          item.tenantId,
          item.lastLogin,
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>{item.status}</span>
        ];
      case 'tenants':
        return [
          item.name,
          item.description,
          item.userCount,
          item.accountCount,
          item.createdAt,
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>{item.status}</span>
        ];
      case 'transactions':
        return [
          item.id,
          item.reference,
          `€${item.amount}`,
          item.currency,
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.type === 'PAYMENT' ? 'bg-blue-100 text-blue-800' :
            item.type === 'TRANSFER' ? 'bg-green-100 text-green-800' :
            item.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-800' :
            'bg-orange-100 text-orange-800'
          }`}>{item.type}</span>,
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>{item.status}</span>,
          item.timestamp
        ];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-gradient">{getTitle()}</h2>
            <p className="text-slate-600 mt-1">
              {type === 'users' && 'Manage all system users and their permissions'}
              {type === 'tenants' && 'View and manage all tenant organizations'}
              {type === 'transactions' && 'Complete transaction history and details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading {type} data...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {getColumns().map((column, index) => (
                      <th key={index} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {modalData.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      {renderRowData(item).map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            Showing {modalData.length} {type} • Last updated {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary px-6 py-2"
            >
              Close
            </button>
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  generateMockData();
                  setIsLoading(false);
                }, 500);
              }}
              className="btn-primary px-6 py-2"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
