<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Struk Pembelian {{ $order_ref }}</title>
    <style>
        @page {
            margin: 15mm 10mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: #000000;
            background: #ffffff;
            line-height: 1.6;
            width: 100%;
        }

        .receipt-container {
            width: 100%;
            max-width: 550px;
            margin: 0 auto;
            padding: 10px 0;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }

        .divider {
            border-top: 1px dashed #000000;
            margin: 14px 0;
        }

        .double-divider {
            border-top: 2px dashed #000000;
            margin: 16px 0;
        }

        .brand-title {
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 4px;
        }

        .company-subtitle {
            font-size: 10px;
            line-height: 1.4;
        }

        .receipt-table {
            width: 100%;
            border-collapse: collapse;
        }

        .receipt-table td {
            vertical-align: top;
            padding: 4px 0;
            font-size: 11px;
        }

        .item-table {
            width: 100%;
            border-collapse: collapse;
        }

        .item-table th {
            font-weight: bold;
            font-size: 11px;
            padding: 6px 0;
            text-align: left;
        }

        .item-table td {
            padding: 8px 0;
            font-size: 11px;
            vertical-align: top;
        }

        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 4px 0;
            font-size: 11px;
        }

        .summary-table .total-row td {
            padding-top: 8px;
            font-weight: bold;
            font-size: 12px;
        }

        .token-box {
            background-color: #f9f9f9;
            border: 1px dashed #000000;
            padding: 14px 10px;
            margin: 18px 0;
            text-align: center;
        }

        .token-header {
            font-size: 9px;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .token-key {
            font-size: 11px;
            font-weight: bold;
            word-break: break-all;
            letter-spacing: 0.5px;
        }

        .footer {
            font-size: 9px;
            text-align: center;
            margin-top: 18px;
            line-height: 1.6;
        }

        .footer p {
            margin-bottom: 6px;
        }
    </style>
</head>
<body>

    <div class="receipt-container">

        <!-- Header Perusahaan -->
        <div class="text-center">
            <div class="brand-title">DIGIMARKET</div>
            <div class="company-subtitle">PT DIGITAL MARKET INDONESIA</div>
            <div class="company-subtitle">Bukti Pembelian Resmi</div>
        </div>

        <div class="divider"></div>

        <!-- Metadata Transaksi -->
        <table class="receipt-table">
            <tr>
                <td style="width: 25%;">No. Ref</td>
                <td style="width: 75%;">: {{ $order_ref }}</td>
            </tr>
            <tr>
                <td>Tanggal</td>
                <td>: {{ $date }}</td>
            </tr>
            <tr>
                <td>Pelanggan</td>
                <td>: {{ $user_name }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>: {{ $user_email }}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td>: <span class="bold">[LUNAS]</span></td>
            </tr>
        </table>

        <div class="divider"></div>

        <!-- Tabel Barang -->
        <table class="item-table">
            <thead>
                <tr>
                    <th style="width: 55%;">ITEM</th>
                    <th style="width: 15%;">UKURAN</th>
                    <th class="text-right" style="width: 30%;">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="3" style="padding: 0;"><div class="divider" style="margin: 4px 0;"></div></td>
                </tr>
                <tr>
                    <td>{{ $product_name }}</td>
                    <td>{{ $variant ?? '-' }}</td>
                    <td class="text-right">Rp {{ number_format($price, 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>

        <div class="divider"></div>

        <!-- Ringkasan Total Pembayaran -->
        <table class="summary-table">
            <tr>
                <td>Subtotal</td>
                <td class="text-right">Rp {{ number_format($price, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td>Pajak (0%)</td>
                <td class="text-right">Rp 0</td>
            </tr>
            <tr class="total-row">
                <td>TOTAL BAYAR</td>
                <td class="text-right">Rp {{ number_format($price, 0, ',', '.') }}</td>
            </tr>
        </table>

        <div class="double-divider"></div>

        <!-- Kunci Otentikasi Access Token -->
        <div class="token-box">
            <div class="token-header">TOKEN AKSES DOWNLOAD</div>
            <div class="token-key">{{ $download_token }}</div>
        </div>

        <div class="divider"></div>

        <!-- Footer Standar Kasir -->
        <div class="footer">
            <p>Struk ini merupakan bukti pembayaran resmi yang sah dari <strong>DIGIMARKET System</strong>.</p>
            <p>Kendala transaksi? Hubungi support@digimarket.id dengan menyertakan Nomor Invoice di atas.</p>
        </div>

    </div>

</body>
</html>