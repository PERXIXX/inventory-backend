// ต้องแน่ใจว่าได้ตั้งค่า VITE_API_URL ในไฟล์ .env ของคุณแล้ว
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'; 

export const fetchInventory = async (retailerId) => {
  const response = await fetch(`${API_BASE_URL}/get_inventory.php?retailer_id=${retailerId}`);
  if (!response.ok) {
    // โยน Error หาก HTTP Status ไม่ใช่ 200s
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const submitTransaction = async (data) => {
  const response = await fetch(`${API_BASE_URL}/inventory_update.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Transaction failed on the server.');
  }
  return response.json();
};