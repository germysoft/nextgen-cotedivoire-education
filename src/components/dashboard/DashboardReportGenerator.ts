import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
}

export interface DashboardAlert {
  type: string;
  message: string;
}

export interface DashboardChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface DashboardReportData {
  title: string;
  subtitle?: string;
  establishment?: string;
  period?: string;
  kpis?: DashboardKPI[];
  alerts?: DashboardAlert[];
  tables?: {
    title: string;
    headers: string[];
    rows: (string | number)[][];
  }[];
  chartData?: {
    title: string;
    type: "bar" | "pie" | "line";
    data: DashboardChartData[];
    dataKey?: string;
    colors?: string[];
  }[];
  additionalInfo?: { label: string; value: string }[];
}

const COLORS = {
  primary: [59, 130, 246] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  warning: [234, 179, 8] as [number, number, number],
  danger: [239, 68, 68] as [number, number, number],
  muted: [107, 114, 128] as [number, number, number],
  dark: [31, 41, 55] as [number, number, number],
  light: [249, 250, 251] as [number, number, number],
};

function drawPieChart(
  doc: jsPDF,
  x: number,
  y: number,
  radius: number,
  data: { name: string; value: number; color?: string }[]
) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = -Math.PI / 2;

  const chartColors = [
    [59, 130, 246],
    [34, 197, 94],
    [234, 179, 8],
    [139, 92, 246],
    [236, 72, 153],
    [107, 114, 128],
  ];

  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    const color = chartColors[index % chartColors.length];
    doc.setFillColor(color[0], color[1], color[2]);

    // Draw pie slice
    const segments = Math.ceil(sliceAngle / 0.1);
    const points: [number, number][] = [[x, y]];
    
    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (sliceAngle * i) / segments;
      points.push([x + radius * Math.cos(angle), y + radius * Math.sin(angle)]);
    }
    points.push([x, y]);

    // Draw filled polygon
    doc.setDrawColor(255, 255, 255);
    const xCoords = points.map(p => p[0]);
    const yCoords = points.map(p => p[1]);
    
    // Simplified pie drawing with arcs
    doc.setFillColor(color[0], color[1], color[2]);
    const midAngle = startAngle + sliceAngle / 2;
    const labelX = x + (radius + 15) * Math.cos(midAngle);
    const labelY = y + (radius + 15) * Math.sin(midAngle);
    
    doc.setFontSize(7);
    doc.setTextColor(color[0], color[1], color[2]);
    const percentage = ((item.value / total) * 100).toFixed(0);
    doc.text(`${item.name}: ${percentage}%`, labelX, labelY, {
      align: midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? "right" : "left",
    });

    startAngle = endAngle;
  });

  // Draw colored squares for legend
  let legendY = y + radius + 25;
  data.forEach((item, index) => {
    const color = chartColors[index % chartColors.length];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(x - 30, legendY - 3, 8, 8, "F");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`${item.name}: ${item.value}`, x - 18, legendY + 3);
    legendY += 12;
  });
}

function drawBarChart(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  data: { name: string; value: number }[],
  dataKey: string = "value"
) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = (width - 20) / data.length - 5;
  const chartColors = [
    [59, 130, 246],
    [34, 197, 94],
    [234, 179, 8],
    [139, 92, 246],
  ];

  // Draw axes
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(x, y + height, x + width, y + height); // X axis
  doc.line(x, y, x, y + height); // Y axis

  // Draw bars
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * (height - 10);
    const barX = x + 10 + index * (barWidth + 5);
    const barY = y + height - barHeight;

    const color = chartColors[index % chartColors.length];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(barX, barY, barWidth, barHeight, 2, 2, "F");

    // Label
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(item.name, barX + barWidth / 2, y + height + 8, { align: "center" });

    // Value on top
    doc.setFontSize(8);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(String(item.value), barX + barWidth / 2, barY - 3, { align: "center" });
  });
}

export function generateDashboardReport(data: DashboardReportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 15;

  // Header background
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.title, 14, 18);

  // Subtitle & period
  if (data.subtitle) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(data.subtitle, 14, 27);
  }

  // Date & establishment
  doc.setFontSize(9);
  const dateText = `Généré le ${new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  doc.text(dateText, pageWidth - 14, 18, { align: "right" });
  
  if (data.establishment) {
    doc.text(data.establishment, pageWidth - 14, 27, { align: "right" });
  }

  if (data.period) {
    doc.text(`Période: ${data.period}`, pageWidth - 14, 35, { align: "right" });
  }

  yPos = 50;

  // KPIs Section
  if (data.kpis && data.kpis.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Indicateurs Clés de Performance", 14, yPos);
    yPos += 8;

    const kpiWidth = (pageWidth - 28) / Math.min(data.kpis.length, 4);
    let kpiX = 14;
    let kpiRow = 0;

    data.kpis.forEach((kpi, index) => {
      if (index > 0 && index % 4 === 0) {
        kpiRow++;
        kpiX = 14;
        yPos += 35;
      }

      // KPI Card background
      doc.setFillColor(COLORS.light[0], COLORS.light[1], COLORS.light[2]);
      doc.roundedRect(kpiX, yPos, kpiWidth - 4, 30, 3, 3, "F");

      // KPI Value
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const valueColor = kpi.trend === "up" ? COLORS.success : kpi.trend === "down" ? COLORS.danger : COLORS.dark;
      doc.setTextColor(valueColor[0], valueColor[1], valueColor[2]);
      doc.text(String(kpi.value), kpiX + (kpiWidth - 4) / 2, yPos + 12, { align: "center" });

      // KPI Label
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
      doc.text(kpi.label, kpiX + (kpiWidth - 4) / 2, yPos + 20, { align: "center" });

      // Change indicator
      if (kpi.change) {
        const changeColor = kpi.trend === "up" ? COLORS.success : kpi.trend === "down" ? COLORS.danger : COLORS.muted;
        doc.setTextColor(changeColor[0], changeColor[1], changeColor[2]);
        doc.setFontSize(7);
        const arrow = kpi.trend === "up" ? "↑" : kpi.trend === "down" ? "↓" : "";
        doc.text(`${arrow} ${kpi.change}`, kpiX + (kpiWidth - 4) / 2, yPos + 26, { align: "center" });
      }

      kpiX += kpiWidth;
    });

    yPos += 40;
  }

  // Alerts Section
  if (data.alerts && data.alerts.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Alertes et Notifications", 14, yPos);
    yPos += 8;

    data.alerts.forEach((alert) => {
      const alertColor =
        alert.type === "urgent" ? COLORS.danger :
        alert.type === "warning" ? COLORS.warning :
        alert.type === "success" ? COLORS.success : COLORS.primary;

      doc.setFillColor(alertColor[0], alertColor[1], alertColor[2]);
      doc.circle(19, yPos + 3, 3, "F");

      doc.setFontSize(9);
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
      doc.text(alert.message, 26, yPos + 5);
      
      yPos += 10;
    });

    yPos += 5;
  }

  // Tables Section
  if (data.tables && data.tables.length > 0) {
    data.tables.forEach((table) => {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
      doc.setFont("helvetica", "bold");
      doc.text(table.title, 14, yPos);
      yPos += 5;

      autoTable(doc, {
        startY: yPos,
        head: [table.headers],
        body: table.rows,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [COLORS.light[0], COLORS.light[1], COLORS.light[2]],
        },
        margin: { left: 14, right: 14 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    });
  }

  // Charts Section
  if (data.chartData && data.chartData.length > 0) {
    data.chartData.forEach((chart) => {
      if (yPos > 180) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
      doc.setFont("helvetica", "bold");
      doc.text(chart.title, 14, yPos);
      yPos += 10;

      if (chart.type === "pie") {
        drawPieChart(doc, pageWidth / 2, yPos + 40, 35, chart.data as any);
        yPos += 100;
      } else if (chart.type === "bar") {
        drawBarChart(doc, 20, yPos, pageWidth - 40, 60, chart.data as any, chart.dataKey);
        yPos += 80;
      }
    });
  }

  // Additional Info
  if (data.additionalInfo && data.additionalInfo.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Informations Complémentaires", 14, yPos);
    yPos += 8;

    data.additionalInfo.forEach((info) => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
      doc.text(`${info.label}:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
      doc.text(info.value, 60, yPos);
      yPos += 6;
    });
  }

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
    doc.text(
      `Page ${i} / ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      "NextGen Éducation - Rapport généré automatiquement",
      14,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save
  const fileName = `${data.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
