# Contoh Penggunaan API Color Trend

## Prerequisites

Pastikan server berjalan di `http://localhost:3000` dan Anda memiliki token JWT yang valid.

## 1. Get Available Products

```bash
curl -X GET "http://localhost:3000/api/color-trend/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Available products retrieved successfully",
  "data": [
    {
      "id": 1,
      "productName": "Product A",
      "lotNumbers": ["LOT001", "LOT002", "LOT003"],
      "planningIds": [1, 2, 3]
    }
  ]
}
```

## 2. Get Color Trend Data - Basic

```bash
curl -X GET "http://localhost:3000/api/color-trend?productId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 3. Get Color Trend Data - With Lot Number Filter

```bash
curl -X GET "http://localhost:3000/api/color-trend?productId=1&lotNumber=LOT001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 4. Get Color Trend Data - With Date Range

```bash
curl -X GET "http://localhost:3000/api/color-trend?productId=1&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 5. Get Color Trend Data - With Planning ID

```bash
curl -X GET "http://localhost:3000/api/color-trend?productId=1&planningId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 6. Get Color Trend Data - Complete Filter

```bash
curl -X GET "http://localhost:3000/api/color-trend?productId=1&lotNumber=LOT001&planningId=1&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Contoh Response Lengkap

```json
{
  "success": true,
  "message": "Color trend data retrieved successfully",
  "data": [
    {
      "productName": "Product A",
      "customerName": "Customer A",
      "data": [
        {
          "id": 1,
          "date": "2024-01-15T10:30:00Z",
          "lotNumber": "LOT001",
          "colorDeltaL": 0.5,
          "colorDeltaA": -0.2,
          "colorDeltaB": 0.1,
          "colorDeltaE": 0.8,
          "tintDeltaL": 0.3,
          "tintDeltaA": -0.1,
          "tintDeltaB": 0.05,
          "tintDeltaE": 0.6,
          "density": 1.2,
          "mfr": 25.5,
          "pelletDiameter": 2.5,
          "pelletLength": 3.0
        },
        {
          "id": 2,
          "date": "2024-01-16T14:20:00Z",
          "lotNumber": "LOT001",
          "colorDeltaL": 0.4,
          "colorDeltaA": -0.15,
          "colorDeltaB": 0.08,
          "colorDeltaE": 0.7,
          "tintDeltaL": 0.25,
          "tintDeltaA": -0.08,
          "tintDeltaB": 0.03,
          "tintDeltaE": 0.55,
          "density": 1.18,
          "mfr": 24.8,
          "pelletDiameter": 2.45,
          "pelletLength": 2.95
        }
      ],
      "statistics": {
        "averages": {
          "colorDeltaL": 0.45,
          "colorDeltaA": -0.175,
          "colorDeltaB": 0.09,
          "colorDeltaE": 0.75,
          "tintDeltaL": 0.275,
          "tintDeltaA": -0.09,
          "tintDeltaB": 0.04,
          "tintDeltaE": 0.575,
          "density": 1.19,
          "mfr": 25.15,
          "pelletDiameter": 2.475,
          "pelletLength": 2.975
        },
        "minMax": {
          "colorDeltaL": {
            "min": 0.4,
            "max": 0.5
          },
          "colorDeltaA": {
            "min": -0.2,
            "max": -0.15
          },
          "colorDeltaB": {
            "min": 0.08,
            "max": 0.1
          },
          "colorDeltaE": {
            "min": 0.7,
            "max": 0.8
          },
          "tintDeltaL": {
            "min": 0.25,
            "max": 0.3
          },
          "tintDeltaA": {
            "min": -0.1,
            "max": -0.08
          },
          "tintDeltaB": {
            "min": 0.03,
            "max": 0.05
          },
          "tintDeltaE": {
            "min": 0.55,
            "max": 0.6
          },
          "density": {
            "min": 1.18,
            "max": 1.2
          },
          "mfr": {
            "min": 24.8,
            "max": 25.5
          },
          "pelletDiameter": {
            "min": 2.45,
            "max": 2.5
          },
          "pelletLength": {
            "min": 2.95,
            "max": 3.0
          }
        },
        "totalSamples": 2
      }
    }
  ],
  "filters": {
    "productId": 1,
    "lotNumber": "LOT001",
    "planningId": 1,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }
}
```

## Error Examples

### 400 Bad Request - Missing Product ID

```bash
curl -X GET "http://localhost:3000/api/color-trend" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**

```json
{
  "success": false,
  "message": "Product ID is required"
}
```

### 401 Unauthorized - Invalid Token

```bash
curl -X GET "http://localhost:3000/api/color-trend?productId=1" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**

```json
{
  "success": false,
  "message": "Access denied. Invalid token."
}
```

## Testing dengan JavaScript

```javascript
// Fungsi untuk mendapatkan token (implementasi sesuai dengan sistem auth Anda)
async function getAuthToken() {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "your_username",
      password: "your_password",
    }),
  });
  const data = await response.json();
  return data.token;
}

// Fungsi untuk mendapatkan available products
async function getAvailableProducts(token) {
  const response = await fetch(
    "http://localhost:3000/api/color-trend/products",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
}

// Fungsi untuk mendapatkan color trend data
async function getColorTrend(token, productId, filters = {}) {
  const params = new URLSearchParams({
    productId: productId,
    ...filters,
  });

  const response = await fetch(
    `http://localhost:3000/api/color-trend?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
}

// Contoh penggunaan
async function testColorTrendAPI() {
  try {
    const token = await getAuthToken();

    // Get available products
    const products = await getAvailableProducts(token);
    console.log("Available Products:", products);

    if (products.data.length > 0) {
      const productId = products.data[0].id;

      // Get color trend data
      const colorTrend = await getColorTrend(token, productId, {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });
      console.log("Color Trend Data:", colorTrend);
    }
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

// Jalankan test
testColorTrendAPI();
```

## Notes

1. **Authentication**: Semua endpoint memerlukan token JWT yang valid
2. **Product ID**: Wajib disediakan untuk endpoint color trend
3. **Filters**: Semua filter bersifat opsional kecuali productId
4. **Date Format**: Gunakan format YYYY-MM-DD untuk filter tanggal
5. **Response**: Data dikelompokkan berdasarkan product dengan statistik lengkap
6. **Error Handling**: API mengembalikan error message yang jelas untuk setiap kasus
