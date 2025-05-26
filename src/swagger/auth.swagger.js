/**
 * @swagger
 * tags:
 *   - name: Master COA
 *     description: Manajemen data Certificate of Analysis (COA)
 */

/**
 * @swagger
 * /api/coa:
 *   post:
 *     summary: Buat data COA baru
 *     tags: [Master COA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterCOA'
 *     responses:
 *       201:
 *         description: COA berhasil dibuat
 *       500:
 *         description: Terjadi kesalahan saat membuat COA
 *
 *   get:
 *     summary: Ambil semua data COA
 *     tags: [Master COA]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah item per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Urutan sorting
 *     responses:
 *       200:
 *         description: Berhasil mengambil data COA
 *       500:
 *         description: Terjadi kesalahan saat mengambil data COA
 */

/**
 * @swagger
 * /api/coa/{id}:
 *   get:
 *     summary: Ambil data COA berdasarkan ID
 *     tags: [Master COA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID COA
 *     responses:
 *       200:
 *         description: Berhasil mengambil data COA
 *       404:
 *         description: COA tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil data COA
 *
 *   put:
 *     summary: Perbarui data COA berdasarkan ID
 *     tags: [Master COA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID COA
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterCOA'
 *     responses:
 *       200:
 *         description: COA berhasil diperbarui
 *       404:
 *         description: COA tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat memperbarui COA
 *
 *   delete:
 *     summary: Hapus data COA berdasarkan ID
 *     tags: [Master COA]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID COA
 *     responses:
 *       200:
 *         description: COA berhasil dihapus
 *       404:
 *         description: COA tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat menghapus COA
 */

/**
 * @swagger
 * /api/master-coa/{id}/approve:
 *   post:
 *     summary: Approve COA
 *     tags: [Master COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID COA yang akan diapprove
 *     responses:
 *       200:
 *         description: COA berhasil diapprove
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: COA berhasil diapprove
 *                 data:
 *                   $ref: '#/components/schemas/MasterCOA'
 *       400:
 *         description: COA sudah diapprove sebelumnya
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: COA tidak ditemukan
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MasterCOA:
 *       type: object
 *       required:
 *         - costumerName
 *         - productName
 *         - lotNumber
 *       properties:
 *         costumerName:
 *           type: string
 *         productName:
 *           type: string
 *         letDownResin:
 *           type: string
 *         lotNumber:
 *           type: string
 *         quantity:
 *           type: string
 *         pelletSize:
 *           type: string
 *         pelletVisual:
 *           type: string
 *         color:
 *           type: string
 *         dispersibility:
 *           type: string
 *         mfr:
 *           type: string
 *         density:
 *           type: string
 *         moisture:
 *           type: string
 *         carbonConten:
 *           type: string
 *         mfgDate:
 *           type: string
 *           format: date
 *         expiryDate:
 *           type: string
 *           format: date
 *         anaysisDate:
 *           type: string
 *           format: date
 *         printedDate:
 *           type: string
 *           format: date
 *         forignMater:
 *           type: string
 *         weightOfChips:
 *           type: string
 *         intrinsicViscosity:
 *           type: string
 *         ashContent:
 *           type: string
 *         issueBy:
 *           type: string
 *         approvedBy:
 *           type: integer
 *         approvedDate:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creator:
 *           type: object
 */
