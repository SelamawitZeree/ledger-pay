"use client";

import { useState } from "react";
import { X, Users, Building2, CreditCard } from "lucide-react";

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'users' | 'tenants' | 'transactions';
  data: any;
}

export function MetricsModal({ isOpen, onClose, type, data }: MetricsModalProps) {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case 'users':
        return {
          title: 'User Statistics',
          icon: Users,
          items: [
            { label: 'Total Users', value: data.totalUsers.toLocaleString() },
            { label: 'Active Users', value: '1,234' },
            { label: 'New This Month', value: '89' },
            { label: 'Growth Rate', value: '+12.5%' },
          ]
        };
      case 'tenants':
        return {
          title: 'Tenant Statistics',
          icon: Building2,
          items: [
            { label: 'Active Tenants', value: data.activeTenants },
            { label: 'New This Week', value: '3' },
            { label: 'Total Revenue', value: `$${data.totalRevenue}` },
            { label: 'Growth Rate', value: '+8.2%' },
          ]
        };
      case 'transactions':
        return {
          title: 'Transaction Statistics',
          icon: CreditCard,
          items: [
            { label: 'Total Transactions', value: data.totalTransactions.toLocaleString() },
            { label: 'Success Rate', value: '99.8%' },
            { label: 'Total Value', value: `$${data.totalRevenue}` },
            { label: 'Avg per Transaction', value: '$213.50' },
          ]
        };
      default:
        return { title: '', icon: Users, items: [] };
    }
  };

  const content = getModalContent();
  const Icon = content.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{content.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {content.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
