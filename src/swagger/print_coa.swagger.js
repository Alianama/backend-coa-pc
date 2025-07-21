/**
 * @swagger
 * components:
 *   schemas:
 *     PrintCoa:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID print COA
 *         status:
 *           type: string
 *           enum: [REQUESTED, APPROVED, REJECTED]
 *           description: Status print COA
 *         planningId:
 *           type: integer
 *           description: ID planning header
 *         costumerName:
 *           type: string
 *           description: Nama customer
 *         productId:
 *           type: integer
 *           description: ID product
 *         productName:
 *           type: string
 *           description: Nama product
 *         lotNumber:
 *           type: string
 *           description: Nomor lot
 *         quantity:
 *           type: number
 *           description: Kuantitas yang di-print
 *         letDownRatio:
 *           type: string
 *           description: Let down ratio
 *         resin:
 *           type: string
 *           description: Resin
 *         pelletLength:
 *           type: number
 *           description: Panjang pellet
 *         pelletDiameter:
 *           type: number
 *           description: Diameter pellet
 *         pelletVisual:
 *           type: string
 *           description: Visual check pellet
 *         dispersibility:
 *           type: string
 *           description: Dispersibility
 *         dispersion:
 *           type: number
 *           format: float
 *         mfr:
 *           type: number
 *           description: MFR
 *         density:
 *           type: number
 *           description: Density
 *         moisture:
 *           type: number
 *           description: Moisture
 *         carbonContent:
 *           type: number
 *           description: Carbon content
 *         mfgDate:
 *           type: string
 *           format: date-time
 *           description: Manufacturing date
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiry date
 *         analysisDate:
 *           type: string
 *           format: date-time
 *           description: Analysis date
 *         printedDate:
 *           type: string
 *           format: date-time
 *           description: Print date
 *         foreignMatter:
 *           type: number
 *           description: Foreign matter
 *         weightOfChips:
 *           type: number
 *           description: Weight of chips
 *         intrinsicViscosity:
 *           type: number
 *           description: Intrinsic viscosity
 *         ashContent:
 *           type: number
 *           description: Ash content
 *         heatStability:
 *           type: number
 *           description: Heat stability
 *         lightFastness:
 *           type: number
 *           description: Light fastness
 *         granule:
 *           type: number
 *           description: Granule
 *         tintDeltaE:
 *           type: number
 *           description: Tint delta E
 *         colorDeltaE:
 *           type: number
 *           description: Color delta E
 *         deltaP:
 *           type: number
 *           description: Delta P
 *         macaroni:
 *           type: number
 *           description: Macaroni
 *         issueBy:
 *           type: string
 *           description: Issued by
 *         approvedBy:
 *           type: integer
 *           description: Approved by user ID
 *         approvedDate:
 *           type: string
 *           format: date-time
 *           description: Approval date
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Created date
 *         printedBy:
 *           type: integer
 *           description: Printed by user ID
 *         creator:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Username creator
 *       required:
 *         - status
 *         - costumerName
 *         - productId
 *         - productName
 *         - lotNumber
 *         - printedDate
 *         - createdAt
 *
 *     PrintCoaRequest:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *           description: Kuantitas yang akan di-print
 *           example: 100.5
 *         planningDetailId:
 *           type: integer
 *           description: ID planning detail yang akan di-print
 *           example: 1
 *       required:
 *         - quantity
 *         - planningDetailId
 *
 *     PrintCoaRejectRequest:
 *       type: object
 *       properties:
 *         reason:
 *           type: string
 *           description: Alasan reject
 *           example: "Data tidak sesuai standar"
 *
 *     PrintCoaResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "COA dari planning berhasil di-print"
 *         data:
 *           $ref: '#/components/schemas/PrintCoa'
 *
 *     PrintCoaListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Data COA yang di-print berhasil diambil"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PrintCoa'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 100
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             totalPages:
 *               type: integer
 *               example: 10
 */

/**
 * @swagger
 * tags:
 *   name: Print COA
 *   description: API untuk mengelola print COA dari planning
 */

/**
 * @swagger
 * /api/print-coa/{planningId}:
 *   post:
 *     summary: Print COA dari planning
 *     tags: [Print COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planningId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID planning header
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrintCoaRequest'
 *     responses:
 *       201:
 *         description: COA berhasil di-print
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrintCoaResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Field 'quantity' harus ada di body request."
 *       404:
 *         description: Planning tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Planning Header tidak ditemukan"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/print-coa:
 *   get:
 *     summary: Ambil semua data print COA
 *     tags: [Print COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REQUESTED, APPROVED, REJECTED]
 *         description: Filter berdasarkan status
 *     responses:
 *       200:
 *         description: Data print COA berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrintCoaListResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/print-coa/{id}:
 *   get:
 *     summary: Ambil data print COA berdasarkan ID
 *     tags: [Print COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID print COA
 *         example: 1
 *     responses:
 *       200:
 *         description: Data print COA berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrintCoaResponse'
 *       404:
 *         description: Print COA tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Data COA yang di-print tidak ditemukan"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/print-coa/planning/{planningId}:
 *   get:
 *     summary: Ambil data print COA berdasarkan planning ID
 *     tags: [Print COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planningId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID planning header
 *         example: 1
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Data print COA berdasarkan planning berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrintCoaListResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/print-coa/{id}:
 *   delete:
 *     summary: Hapus data print COA
 *     tags: [Print COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID print COA
 *         example: 1
 *     responses:
 *       200:
 *         description: Print COA berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Data COA yang di-print berhasil dihapus"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Hanya COA dengan status REQUESTED yang dapat dihapus"
 *       404:
 *         description: Print COA tidak ditemukan
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/print-coa/{id}/approve:
 *   patch:
 *     summary: Approve print COA
 *     tags: [Print COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID print COA
 *         example: 1
 *     responses:
 *       200:
 *         description: Print COA berhasil di-approve
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrintCoaResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Hanya COA dengan status REQUESTED yang dapat di-approve"
 *       404:
 *         description: Print COA tidak ditemukan
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/print-coa/{id}/reject:
 *   patch:
 *     summary: Reject print COA
 *     tags: [Print COA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID print COA
 *         example: 1
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrintCoaRejectRequest'
 *     responses:
 *       200:
 *         description: Print COA berhasil di-reject
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrintCoaResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Hanya COA dengan status REQUESTED yang dapat di-reject"
 *       404:
 *         description: Print COA tidak ditemukan
 *       500:
 *         description: Internal server error
 */
