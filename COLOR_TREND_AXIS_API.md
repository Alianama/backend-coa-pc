# Color Trend Axis API Documentation

## Overview

API untuk mendapatkan data axis X dan Y yang siap digunakan untuk chart line chart. Data dikembalikan dalam format yang mudah digunakan untuk library chart seperti Chart.js, ApexCharts, atau D3.js.

## Endpoint

### Get Chart Axis Data

**GET** `/api/color-trend/axis`

Mendapatkan data axis X (tanggal) dan Y (parameter value) untuk chart.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `productId` (required): ID product
- `parameter` (required): Parameter yang akan ditampilkan di Y-axis
- `lotNumber` (optional): Filter berdasarkan lot number
- `planningId` (optional): Filter berdasarkan planning header ID
- `startDate` (optional): Filter tanggal mulai (format: YYYY-MM-DD)
- `endDate` (optional): Filter tanggal akhir (format: YYYY-MM-DD)

**Valid Parameters:**

- `colorDeltaL` - Color Delta L\*
- `colorDeltaA` - Color Delta a\*
- `colorDeltaB` - Color Delta b\*
- `colorDeltaE` - Color Delta E\*
- `tintDeltaL` - Tint Delta L\*
- `tintDeltaA` - Tint Delta a\*
- `tintDeltaB` - Tint Delta b\*
- `tintDeltaE` - Tint Delta E\*
- `density` - Density (g/cm³)
- `mfr` - MFR (g/10min)
- `pelletDiameter` - Pellet Diameter (mm)
- `pelletLength` - Pellet Length (mm)

## Contoh Request

### 1. Basic Request - Color Delta E

```bash
curl -X GET "http://localhost:3000/api/color-trend/axis?productId=1&parameter=colorDeltaE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 2. With Lot Number Filter

```bash
curl -X GET "http://localhost:3000/api/color-trend/axis?productId=1&parameter=density&lotNumber=LOT001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. With Date Range

```bash
curl -X GET "http://localhost:3000/api/color-trend/axis?productId=1&parameter=mfr&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Complete Filter

```bash
curl -X GET "http://localhost:3000/api/color-trend/axis?productId=1&parameter=pelletDiameter&lotNumber=LOT001&planningId=1&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Response Format

```json
{
  "success": true,
  "message": "Chart axis data retrieved successfully",
  "data": {
    "parameter": "colorDeltaE",
    "chartData": [
      {
        "x": "2024-01-15T10:30:00Z",
        "y": 0.8,
        "lotNumber": "LOT001",
        "productName": "Product A",
        "customerName": "Customer A",
        "id": 1
      },
      {
        "x": "2024-01-16T14:20:00Z",
        "y": 0.7,
        "lotNumber": "LOT001",
        "productName": "Product A",
        "customerName": "Customer A",
        "id": 2
      }
    ],
    "statistics": {
      "average": 0.75,
      "min": 0.7,
      "max": 0.8,
      "count": 2,
      "standardDeviation": 0.05
    },
    "axis": {
      "x": {
        "type": "date",
        "label": "Date",
        "values": ["2024-01-15T10:30:00Z", "2024-01-16T14:20:00Z"]
      },
      "y": {
        "type": "number",
        "label": "Color Delta E*",
        "values": [0.8, 0.7],
        "unit": ""
      }
    }
  },
  "filters": {
    "productId": 1,
    "lotNumber": "LOT001",
    "planningId": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "parameter": "colorDeltaE"
  }
}
```

## Penggunaan untuk Chart Libraries

### Chart.js

```javascript
const response = await fetch(
  "/api/color-trend/axis?productId=1&parameter=colorDeltaE"
);
const data = await response.json();

const chartData = {
  labels: data.data.chartData.map((item) =>
    new Date(item.x).toLocaleDateString()
  ),
  datasets: [
    {
      label: data.data.axis.y.label,
      data: data.data.chartData.map((item) => item.y),
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const ctx = document.getElementById("myChart").getContext("2d");
new Chart(ctx, {
  type: "line",
  data: chartData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `${data.data.axis.y.label} ${data.data.axis.y.unit}`,
        },
      },
      x: {
        title: {
          display: true,
          text: data.data.axis.x.label,
        },
      },
    },
  },
});
```

### ApexCharts

```javascript
const response = await fetch(
  "/api/color-trend/axis?productId=1&parameter=density"
);
const data = await response.json();

const options = {
  chart: {
    type: "line",
  },
  series: [
    {
      name: data.data.axis.y.label,
      data: data.data.chartData.map((item) => ({
        x: new Date(item.x).getTime(),
        y: item.y,
      })),
    },
  ],
  xaxis: {
    type: "datetime",
    title: {
      text: data.data.axis.x.label,
    },
  },
  yaxis: {
    title: {
      text: `${data.data.axis.y.label} ${data.data.axis.y.unit}`,
    },
  },
};

new ApexCharts(document.querySelector("#chart"), options).render();
```

### D3.js

```javascript
const response = await fetch("/api/color-trend/axis?productId=1&parameter=mfr");
const data = await response.json();

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3
  .scaleTime()
  .domain(d3.extent(data.data.chartData, (d) => new Date(d.x)))
  .range([0, width]);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(data.data.chartData, (d) => d.y)])
  .range([height, 0]);

const line = d3
  .line()
  .x((d) => x(new Date(d.x)))
  .y((d) => y(d.y));

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

svg
  .append("path")
  .datum(data.data.chartData)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", line);
```

## Error Responses

### 400 Bad Request - Missing Product ID

```json
{
  "success": false,
  "message": "Product ID is required"
}
```

### 400 Bad Request - Missing Parameter

```json
{
  "success": false,
  "message": "Parameter is required (colorDeltaL, colorDeltaA, colorDeltaB, colorDeltaE, tintDeltaL, tintDeltaA, tintDeltaB, tintDeltaE, density, mfr, pelletDiameter, pelletLength)"
}
```

### 400 Bad Request - Invalid Parameter

```json
{
  "success": false,
  "message": "Invalid parameter. Valid parameters are: colorDeltaL, colorDeltaA, colorDeltaB, colorDeltaE, tintDeltaL, tintDeltaA, tintDeltaB, tintDeltaE, density, mfr, pelletDiameter, pelletLength"
}
```

## Fitur Utama

1. **Data Siap Chart**: Data dikembalikan dalam format `{x, y}` yang siap untuk chart
2. **Statistik Lengkap**: Rata-rata, min, max, count, dan standard deviation
3. **Axis Information**: Informasi lengkap tentang axis X dan Y
4. **Filter Fleksibel**: Bisa difilter berdasarkan lot number, planning ID, dan date range
5. **Parameter Validation**: Validasi parameter yang diizinkan
6. **Null Value Filtering**: Otomatis memfilter data null
7. **Date Sorting**: Data diurutkan berdasarkan tanggal

## Notes

- **X-axis**: Selalu berupa tanggal (analysisDate atau createdAt)
- **Y-axis**: Nilai parameter yang dipilih
- **Data Filtering**: Otomatis memfilter data null untuk parameter yang dipilih
- **Date Format**: Menggunakan ISO 8601 format
- **Statistics**: Dihitung hanya dari data yang valid (non-null)
