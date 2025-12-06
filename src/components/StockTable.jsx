import React from 'react';

const StockTable = ({ inventory, isLoading, lowStockThreshold }) => {
  if (isLoading) {
    return <div className="text-center py-4">กำลังโหลดข้อมูล...</div>;
  }

  if (!inventory || inventory.length === 0) {
    return <div className="text-center py-4 text-gray-500">ไม่พบข้อมูลสต๊อกในฐานข้อมูล</div>;
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนคงเหลือ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => {
              const isLow = item.current_stock < lowStockThreshold;
              return (
                <tr key={item.sku_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sku_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.current_stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${isLow ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {isLow ? 'เหลือน้อย' : 'ปกติ'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;