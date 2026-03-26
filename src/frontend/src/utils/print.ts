export function printHTML(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.left = "-9999px";
  document.body.appendChild(iframe);
  const win = iframe.contentWindow;
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 300);
}

const printBaseStyles = `
  body {
    font-family: 'Plus Jakarta Sans', Arial, sans-serif;
    color: #1a1a1a;
    margin: 0;
    padding: 0;
  }
  .receipt {
    max-width: 700px;
    margin: 40px auto;
    padding: 40px;
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #C8A24A;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
  .church-name {
    font-size: 22px;
    font-weight: 700;
    color: #0F2E4F;
    margin: 0 0 4px 0;
  }
  .receipt-title {
    font-size: 16px;
    color: #C8A24A;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  .period {
    font-size: 14px;
    color: #555;
    margin: 0;
  }
  .member-name {
    font-size: 15px;
    font-weight: 600;
    color: #0F2E4F;
    margin-bottom: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th {
    background: #F4E9D9;
    color: #0F2E4F;
    font-weight: 600;
    padding: 10px 12px;
    text-align: left;
    font-size: 13px;
    border-bottom: 1px solid #E7DDCF;
  }
  td {
    padding: 9px 12px;
    font-size: 13px;
    border-bottom: 1px solid #f0e8dc;
  }
  .total-row td {
    font-weight: 700;
    color: #0F2E4F;
    background: #fdf7ef;
    border-top: 2px solid #C8A24A;
    border-bottom: none;
  }
  .amount { text-align: right; }
  .footer {
    text-align: center;
    margin-top: 40px;
    font-size: 12px;
    color: #888;
    border-top: 1px solid #E7DDCF;
    padding-top: 16px;
  }
`;

export interface MemberReceiptData {
  memberName: string;
  period: string;
  donations: Array<{ date: string; amount: number }>;
  total: number;
}

export interface SummaryReportData {
  period: string;
  rows: Array<{ name: string; total: number }>;
  grandTotal: number;
}

export function printMemberReceipt(data: MemberReceiptData) {
  const rows = data.donations
    .map(
      (d) =>
        `<tr><td>${formatDateSpanish(d.date)}</td><td class="amount">${formatCurrency(d.amount)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Recibo</title>
  <style>${printBaseStyles}</style></head><body><div class="receipt">
  <div class="header">
    <p class="church-name">Iglesia Bautista Getsemani</p>
    <p class="receipt-title">Recibo de Ofrendas</p>
    <p class="period">${data.period}</p>
  </div>
  <p class="member-name">Miembro: ${data.memberName}</p>
  <table>
    <thead><tr><th>Fecha</th><th class="amount">Monto</th></tr></thead>
    <tbody>
      ${rows}
      <tr class="total-row"><td>Total</td><td class="amount">${formatCurrency(data.total)}</td></tr>
    </tbody>
  </table>
  <div class="footer">Iglesia Bautista Getsemani &mdash; Gracias por su ofrenda</div>
  </div></body></html>`;

  printHTML(html);
}

export function printSummaryReport(data: SummaryReportData) {
  const rows = data.rows
    .map(
      (r, i) =>
        `<tr><td>${i + 1}</td><td>${r.name}</td><td class="amount">${formatCurrency(r.total)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte</title>
  <style>${printBaseStyles}</style></head><body><div class="receipt">
  <div class="header">
    <p class="church-name">Iglesia Bautista Getsemani</p>
    <p class="receipt-title">Reporte de Ofrendas</p>
    <p class="period">${data.period}</p>
  </div>
  <table>
    <thead><tr><th>#</th><th>Miembro</th><th class="amount">Total</th></tr></thead>
    <tbody>
      ${rows}
      <tr class="total-row"><td colspan="2">Gran Total</td><td class="amount">${formatCurrency(data.grandTotal)}</td></tr>
    </tbody>
  </table>
  <div class="footer">Iglesia Bautista Getsemani &mdash; Reporte Generado ${new Date().toLocaleDateString("es-ES")}</div>
  </div></body></html>`;

  printHTML(html);
}

function formatDateSpanish(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
