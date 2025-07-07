/**
 * @swagger
 * components:
 *   schemas:
 *     ColorTrendData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Planning detail ID
 *         date:
 *           type: string
 *           format: date-time
 *           description: Analysis date or creation date
 *         lotNumber:
 *           type: string
 *           description: Lot number
 *         colorDeltaL:
 *           type: number
 *           description: Color Delta L value
 *         colorDeltaA:
 *           type: number
 *           description: Color Delta A value
 *         colorDeltaB:
 *           type: number
 *           description: Color Delta B value
 *         colorDeltaE:
 *           type: number
 *           description: Color Delta E value
 *         tintDeltaL:
 *           type: number
 *           description: Tint Delta L value
 *         tintDeltaA:
 *           type: number
 *           description: Tint Delta A value
 *         tintDeltaB:
 *           type: number
 *           description: Tint Delta B value
 *         tintDeltaE:
 *           type: number
 *           description: Tint Delta E value
 *         density:
 *           type: number
 *           description: Density value
 *         mfr:
 *           type: number
 *           description: MFR (Melt Flow Rate) value
 *         pelletDiameter:
 *           type: number
 *           description: Pellet diameter value
 *         pelletLength:
 *           type: number
 *           description: Pellet length value
 *
 *     ColorTrendStatistics:
 *       type: object
 *       properties:
 *         averages:
 *           type: object
 *           properties:
 *             colorDeltaL:
 *               type: number
 *               description: Average Color Delta L
 *             colorDeltaA:
 *               type: number
 *               description: Average Color Delta A
 *             colorDeltaB:
 *               type: number
 *               description: Average Color Delta B
 *             colorDeltaE:
 *               type: number
 *               description: Average Color Delta E
 *             tintDeltaL:
 *               type: number
 *               description: Average Tint Delta L
 *             tintDeltaA:
 *               type: number
 *               description: Average Tint Delta A
 *             tintDeltaB:
 *               type: number
 *               description: Average Tint Delta B
 *             tintDeltaE:
 *               type: number
 *               description: Average Tint Delta E
 *             density:
 *               type: number
 *               description: Average density
 *             mfr:
 *               type: number
 *               description: Average MFR
 *             pelletDiameter:
 *               type: number
 *               description: Average pellet diameter
 *             pelletLength:
 *               type: number
 *               description: Average pellet length
 *         minMax:
 *           type: object
 *           properties:
 *             colorDeltaL:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Color Delta L
 *                 max:
 *                   type: number
 *                   description: Maximum Color Delta L
 *             colorDeltaA:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Color Delta A
 *                 max:
 *                   type: number
 *                   description: Maximum Color Delta A
 *             colorDeltaB:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Color Delta B
 *                 max:
 *                   type: number
 *                   description: Maximum Color Delta B
 *             colorDeltaE:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Color Delta E
 *                 max:
 *                   type: number
 *                   description: Maximum Color Delta E
 *             tintDeltaL:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Tint Delta L
 *                 max:
 *                   type: number
 *                   description: Maximum Tint Delta L
 *             tintDeltaA:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Tint Delta A
 *                 max:
 *                   type: number
 *                   description: Maximum Tint Delta A
 *             tintDeltaB:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Tint Delta B
 *                 max:
 *                   type: number
 *                   description: Maximum Tint Delta B
 *             tintDeltaE:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum Tint Delta E
 *                 max:
 *                   type: number
 *                   description: Maximum Tint Delta E
 *             density:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum density
 *                 max:
 *                   type: number
 *                   description: Maximum density
 *             mfr:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum MFR
 *                 max:
 *                   type: number
 *                   description: Maximum MFR
 *             pelletDiameter:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum pellet diameter
 *                 max:
 *                   type: number
 *                   description: Maximum pellet diameter
 *             pelletLength:
 *               type: object
 *               properties:
 *                 min:
 *                   type: number
 *                   description: Minimum pellet length
 *                 max:
 *                   type: number
 *                   description: Maximum pellet length
 *         totalSamples:
 *           type: integer
 *           description: Total number of samples
 *
 *     ColorTrendProduct:
 *       type: object
 *       properties:
 *         productName:
 *           type: string
 *           description: Product name
 *         customerName:
 *           type: string
 *           description: Customer name
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ColorTrendData'
 *         statistics:
 *           $ref: '#/components/schemas/ColorTrendStatistics'
 *
 *     AvailableProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Product ID
 *         productName:
 *           type: string
 *           description: Product name
 *         lotNumbers:
 *           type: array
 *           items:
 *             type: string
 *           description: Available lot numbers for this product
 *         planningIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: Available planning IDs for this product
 *
 *     ColorTrendResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Request success status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ColorTrendProduct'
 *         filters:
 *           type: object
 *           properties:
 *             productId:
 *               type: integer
 *               description: Applied product ID filter
 *             lotNumber:
 *               type: string
 *               description: Applied lot number filter
 *             planningId:
 *               type: integer
 *               description: Applied planning ID filter
 *             startDate:
 *               type: string
 *               format: date
 *               description: Applied start date filter
 *             endDate:
 *               type: string
 *               format: date
 *               description: Applied end date filter
 *
 *     AvailableProductsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Request success status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AvailableProduct'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: string
 *           description: Detailed error information
 */

module.exports = {
  // This file contains Swagger schema definitions for color trend API
  // The schemas are referenced in the routes/color_trend.js file
};
