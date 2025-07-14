# Sistem Log Terpusat

## Overview

Sistem log terpusat ini menyimpan semua aktivitas aplikasi di database `logs` dengan satu handler untuk mengelola semua log.

## Struktur Database

```sql
model log {
  id          Int         @id @default(autoincrement())
  action      String      -- CREATE, UPDATE, DELETE
  description String      -- Deskripsi aktivitas
  userId      Int         @map("user_id")
  createdAt   DateTime    @default(now()) @map("created_at")
  user        user        @relation(fields: [userId], references: [id])
}
```

## API Endpoints

### 1. Get All Logs

```
GET /api/logs
```

**Query Parameters:**

- `page` (default: 1) - Halaman
- `limit` (default: 50) - Jumlah data per halaman
- `table` - Filter berdasarkan nama tabel
- `action` - Filter berdasarkan aksi (CREATE, UPDATE, DELETE)
- `userId` - Filter berdasarkan ID user
- `startDate` - Filter tanggal mulai (YYYY-MM-DD)
- `endDate` - Filter tanggal akhir (YYYY-MM-DD)
- `search` - Pencarian di description

**Response:**

```json
{
  "status": "success",
  "message": "Data log berhasil diambil",
  "data": [
    {
      "id": 1,
      "action": "CREATE",
      "description": "CREATE pada tabel print_coa dengan ID 123 - Print COA baru dibuat: LOT001",
      "userId": 1,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "user": {
        "id": 1,
        "username": "admin",
        "fullName": "Administrator",
        "email": "admin@example.com"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "totalPages": 2
  },
  "filters": {
    "table": "print_coa",
    "action": "CREATE",
    "userId": "1",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "search": "COA"
  }
}
```

### 2. Get Log by ID

```
GET /api/logs/:id
```

### 3. Get Logs by User ID

```
GET /api/logs/user/:userId
```

### 4. Get Logs by Table

```
GET /api/logs/table/:table
```

### 5. Get Log Statistics

```
GET /api/logs/stats/statistics
```

**Query Parameters:**

- `startDate` - Filter tanggal mulai
- `endDate` - Filter tanggal akhir

**Response:**

```json
{
  "status": "success",
  "message": "Statistik log berhasil diambil",
  "data": {
    "totalLogs": 1000,
    "logsByAction": [
      { "action": "CREATE", "count": 500 },
      { "action": "UPDATE", "count": 300 },
      { "action": "DELETE", "count": 200 }
    ],
    "logsByTable": [
      { "table": "print_coa", "count": 400 },
      { "table": "users", "count": 300 },
      { "table": "planning_header", "count": 300 }
    ],
    "topUsers": [
      {
        "userId": 1,
        "count": 150,
        "user": {
          "id": 1,
          "username": "admin",
          "fullName": "Administrator"
        }
      }
    ],
    "recentActivity": {
      "last7Days": 50
    }
  }
}
```

### 6. Delete Old Logs (Cleanup)

```
DELETE /api/logs/cleanup
```

**Query Parameters:**

- `days` (default: 90) - Hapus log yang lebih lama dari X hari

## Implementasi di Controller

### Print COA Controller

```javascript
// Log aktivitas create print COA
try {
  if (req.user && req.user.id) {
    await logCreate(
      "print_coa",
      req.user.id,
      newPrintedCoa.id,
      printData,
      `Print COA baru dibuat: ${planningHeader.lotNumber}`
    );
    console.log("Log berhasil dibuat untuk print COA:", newPrintedCoa.id);
  } else {
    console.warn("User ID tidak tersedia untuk logging");
  }
} catch (logError) {
  console.error("Error saat membuat log:", logError);
  // Jangan throw error agar tidak mengganggu operasi utama
}
```

## Permissions

- `READ_LOG` - Untuk membaca log
- `DELETE_LOG` - Untuk menghapus log lama

## Fitur Utama

1. **Terpusat** - Semua log disimpan di satu tabel
2. **Filterable** - Bisa filter berdasarkan tabel, aksi, user, tanggal
3. **Searchable** - Pencarian di description
4. **Statistics** - Statistik aktivitas
5. **Cleanup** - Otomatis hapus log lama
6. **Error Handling** - Log error tidak mengganggu operasi utama
7. **Data Sanitization** - Membersihkan data dari circular references

## Contoh Penggunaan

### Filter log print COA hari ini

```
GET /api/logs?table=print_coa&startDate=2024-01-01&endDate=2024-01-01
```

### Cari log yang mengandung kata "COA"

```
GET /api/logs?search=COA
```

### Lihat aktivitas user tertentu

```
GET /api/logs/user/1
```

### Lihat statistik aktivitas

```
GET /api/logs/stats/statistics?startDate=2024-01-01&endDate=2024-01-31
```

### Hapus log yang lebih lama dari 30 hari

```
DELETE /api/logs/cleanup?days=30
```
