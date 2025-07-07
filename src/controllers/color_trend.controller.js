const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getParameterLabel = (parameter) => {
  const labels = {
    colorDeltaL: "Color Delta L*",
    colorDeltaA: "Color Delta a*",
    colorDeltaB: "Color Delta b*",
    colorDeltaE: "Color Delta E*",
    tintDeltaL: "Tint Delta L*",
    tintDeltaA: "Tint Delta a*",
    tintDeltaB: "Tint Delta b*",
    tintDeltaE: "Tint Delta E*",
    density: "Density",
    mfr: "MFR (Melt Flow Rate)",
    pelletDiameter: "Pellet Diameter",
    pelletLength: "Pellet Length",
  };
  return labels[parameter] || parameter;
};

const getEChartsData = async (req, res) => {
  try {
    const { productId, lotNumber, planningId, startDate, endDate, parameter } =
      req.query;

    // Validasi parameter wajib
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    if (!parameter) {
      return res.status(400).json({
        success: false,
        message:
          "Parameter is required (colorDeltaL, colorDeltaA, colorDeltaB, colorDeltaE, tintDeltaL, tintDeltaA, tintDeltaB, tintDeltaE, density, mfr, pelletDiameter, pelletLength)",
      });
    }
    // Daftar parameter valid
    const validParameters = [
      "colorDeltaL",
      "colorDeltaA",
      "colorDeltaB",
      "colorDeltaE",
      "tintDeltaL",
      "tintDeltaA",
      "tintDeltaB",
      "tintDeltaE",
      "density",
      "mfr",
      "pelletDiameter",
      "pelletLength",
    ];
    if (!validParameters.includes(parameter)) {
      return res.status(400).json({
        success: false,
        message: `Invalid parameter. Valid parameters are: ${validParameters.join(
          ", "
        )}`,
      });
    }

    // Build where clause
    let whereClause = {
      isDeleted: false,
      planningHeader: {
        isDeleted: false,
        idProduct: parseInt(productId),
      },
    };
    if (lotNumber) {
      whereClause.planningHeader.lotNumber = lotNumber;
    }
    if (planningId) {
      whereClause.idPlanning = parseInt(planningId);
    }
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Query data
    const colorTrendData = await prisma.planning_detail.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        createdAt: true,
        analysisDate: true,
        [parameter]: true,
        planningHeader: {
          select: {
            lotNumber: true,
            product: {
              select: {
                id: true,
                productName: true,
              },
            },
          },
        },
      },
    });

    // Filter data valid
    const validData = colorTrendData.filter(
      (item) =>
        item[parameter] !== null &&
        item.planningHeader &&
        item.planningHeader.product
    );

    // xAxis dan series: setiap baris planning_detail satu entry (boleh duplikat lot number)
    const xAxis = validData.map((item) => item.planningHeader.lotNumber);
    const productMap = new Map();
    validData.forEach((item) => {
      const productName = item.planningHeader.product.productName;
      const value = item[parameter];
      if (!productMap.has(productName)) {
        productMap.set(productName, []);
      }
      productMap.get(productName).push(value);
    });
    const series = Array.from(productMap.entries()).map(([name, data]) => ({
      name,
      data,
    }));

    // Label Y
    const yAxisLabel = getParameterLabel(parameter);

    res.json({
      success: true,
      message: "ECharts data retrieved successfully",
      data: {
        xAxis,
        series,
        yAxisLabel,
      },
    });
  } catch (error) {
    console.error("Error getting ECharts data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getEChartsData,
};
