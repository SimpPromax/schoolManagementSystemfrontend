import React from 'react';
import { CreditCard, Download, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeePayments = () => {
  const feeStructure = [
    { component: 'Tuition Fee', amount: 45000, status: 'paid' },
    { component: 'Laboratory Charges', amount: 8000, status: 'paid' },
    { component: 'Library Fee', amount: 2000, status: 'paid' },
    { component: 'Sports Fee', amount: 3000, status: 'paid' },
    { component: 'Annual Function', amount: 1500, status: 'pending' },
    { component: 'Development Fund', amount: 5000, status: 'pending' },
  ];

  const paymentHistory = [
    { date: '15-Apr-24', amount: 25000, mode: 'Online', receipt: 'RCP00123', status: 'paid' },
    { date: '15-Jul-24', amount: 18000, mode: 'Cheque', receipt: 'RCP00245', status: 'paid' },
    { date: '15-Oct-24', amount: 16000, mode: 'Cash', receipt: 'RCP00367', status: 'paid' },
    { date: '15-Jan-25', amount: 5500, mode: '-', receipt: '-', status: 'due' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Fee Payments - John Smith</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-600">Student ID</p>
            <p className="font-medium">STU20240025</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Father's Name</p>
            <p className="font-medium">Robert Smith</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Contact</p>
            <p className="font-medium">robert.smith@email.com</p>
          </div>
        </div>
      </div>

      {/* Annual Fee Structure */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">ANNUAL FEE STRUCTURE (2024-2025)</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fee Component</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount(₹)</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {feeStructure.map((fee, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{fee.component}</td>
                  <td className="px-6 py-3">₹{fee.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        fee.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {fee.status === 'paid' ? 'PAID ✅' : 'PENDING ⏳'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {fee.status === 'pending' && (
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">TOTAL: ₹64,500</span>
              <p className="text-sm text-gray-600">Annual Fee</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-green-700">PAID: ₹59,000</span>
              <p className="text-sm text-red-600">DUE: ₹5,500</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment History */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Payment History
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All →</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount(₹)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Mode</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Receipt</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentHistory.map((payment, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{payment.date}</td>
                    <td className="px-6 py-3 font-medium">₹{payment.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-3">{payment.mode}</td>
                    <td className="px-6 py-3">
                      {payment.receipt !== '-' ? (
                        <a href="#" className="text-blue-600 hover:text-blue-800">
                          {payment.receipt}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {payment.status === 'paid' ? 'PAID ✅' : 'DUE ⚠️'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Upcoming Payments
            </h2>
            <span className="inline-flex px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-full">
              1 pending
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Next Installment Due</h3>
                  <p className="text-red-700 font-medium text-lg">₹5,500</p>
                  <p className="text-sm text-gray-600">Due by Jan 15, 2025</p>
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Pay Now
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                      Request Extension
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Late Fee Notice</h3>
                  <p className="text-sm text-gray-600">
                    Late fee of ₹550 will be charged after Jan 31, 2025
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Payment Options</h3>
                  <div className="flex gap-3 mt-2">
                    <span className="text-sm bg-white px-3 py-1 rounded-full">Online</span>
                    <span className="text-sm bg-white px-3 py-1 rounded-full">Cheque</span>
                    <span className="text-sm bg-white px-3 py-1 rounded-full">Cash</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">91.5%</div>
            <div className="text-gray-600">Fee Paid</div>
            <p className="text-sm text-gray-500 mt-2">₹59,000 of ₹64,500</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">8.5%</div>
            <div className="text-gray-600">Fee Due</div>
            <p className="text-sm text-gray-500 mt-2">₹5,500 remaining</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">4</div>
            <div className="text-gray-600">Total Payments</div>
            <p className="text-sm text-gray-500 mt-2">3 paid, 1 pending</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/student"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default FeePayments;
