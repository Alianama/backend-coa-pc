const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Utility function untuk mencatat log aktivitas
 * @param {Object} params - Parameter untuk logging
 * @param {string} params.action - Jenis aksi (CREATE, UPDATE, DELETE)
 * @param {string} params.table - Nama tabel yang dioperasikan
 * @param {number} params.userId - ID user yang melakukan aksi
 * @param {string} params.userName - Username user yang melakukan aksi
 * @param {number} params.recordId - ID record yang dioperasikan (opsional)
 * @param {string} params.description - Deskripsi tambahan (opsional)
 * @param {Object} params.oldData - Data lama sebelum update (opsional)
 * @param {Object} params.newData - Data baru setelah operasi (opsional)
 */
const createLog = async ({
  action,
  table,
  userId,
  userName = "",
  recordId = null,
  description = null,
  oldData = null,
  newData = null,
}) => {
  try {
    let logDescription = "";
    // Format log human readable
    if (action === "CREATE") {
      logDescription = `User ${userName} membuat ${table}`;
      if (recordId) logDescription += ` (ID: ${recordId}`;
      if (newData?.lotNumber) logDescription += `, Lot: ${newData.lotNumber}`;
      if (newData?.costumerName)
        logDescription += `, Customer: ${newData.costumerName}`;
      if (newData?.quantity) logDescription += `, Qty: ${newData.quantity}`;
      if (recordId) logDescription += ")";
    } else if (action === "UPDATE") {
      logDescription = `User ${userName} mengubah ${table}`;
      if (recordId) logDescription += ` (ID: ${recordId}`;
      if (oldData?.lotNumber) logDescription += `, Lot: ${oldData.lotNumber}`;
      if (recordId) logDescription += ")";
      if (
        oldData &&
        newData &&
        oldData.status &&
        newData.status &&
        oldData.status !== newData.status
      ) {
        logDescription += ` dari status ${oldData.status} ke ${newData.status}`;
      }
    } else if (action === "DELETE") {
      logDescription = `User ${userName} menghapus ${table}`;
      if (recordId) logDescription += ` (ID: ${recordId}`;
      if (oldData?.lotNumber) logDescription += `, Lot: ${oldData.lotNumber}`;
      if (recordId) logDescription += ")";
    } else {
      logDescription = `${action} pada tabel ${table}`;
      if (recordId) logDescription += ` dengan ID ${recordId}`;
    }
    if (description) {
      logDescription += ` - ${description}`;
    }
    // Batasi panjang
    const maxDescLength = 2000;
    logDescription = logDescription.substring(0, maxDescLength);

    await prisma.log.create({
      data: {
        action,
        description: logDescription,
        userId,
      },
    });
  } catch (error) {
    console.error("Error creating log:", error);
    // Jangan throw error agar tidak mengganggu operasi utama
  }
};

/**
 * Helper function untuk CREATE operations
 */
const logCreate = async (
  table,
  userId,
  userName,
  recordId,
  data,
  description = null
) => {
  const cleanData = data ? JSON.parse(JSON.stringify(data)) : null;
  await createLog({
    action: "CREATE",
    table,
    userId,
    userName,
    recordId,
    description,
    newData: cleanData,
  });
};

/**
 * Helper function untuk UPDATE operations
 */
const logUpdate = async (
  table,
  userId,
  userName,
  recordId,
  oldData,
  newData,
  description = null
) => {
  const cleanOldData = oldData ? JSON.parse(JSON.stringify(oldData)) : null;
  const cleanNewData = newData ? JSON.parse(JSON.stringify(newData)) : null;
  await createLog({
    action: "UPDATE",
    table,
    userId,
    userName,
    recordId,
    description,
    oldData: cleanOldData,
    newData: cleanNewData,
  });
};

/**
 * Helper function untuk DELETE operations
 */
const logDelete = async (
  table,
  userId,
  userName,
  recordId,
  deletedData,
  description = null
) => {
  const cleanDeletedData = deletedData
    ? JSON.parse(JSON.stringify(deletedData))
    : null;
  await createLog({
    action: "DELETE",
    table,
    userId,
    userName,
    recordId,
    description,
    oldData: cleanDeletedData,
  });
};

module.exports = {
  createLog,
  logCreate,
  logUpdate,
  logDelete,
};
