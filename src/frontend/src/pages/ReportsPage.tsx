import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer } from "lucide-react";
import { useMemo, useState } from "react";
import type { Donation, Member } from "../backend";
import { useAllDonations, useMembers } from "../hooks/useQueries";
import {
  formatCurrency,
  formatYearMonth,
  getCurrentYear,
  getCurrentYearMonth,
} from "../utils/formatters";
import { printMemberReceipt, printSummaryReport } from "../utils/print";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const MONTH_NAMES: Record<string, string> = {
  "01": "Enero",
  "02": "Febrero",
  "03": "Marzo",
  "04": "Abril",
  "05": "Mayo",
  "06": "Junio",
  "07": "Julio",
  "08": "Agosto",
  "09": "Septiembre",
  "10": "Octubre",
  "11": "Noviembre",
  "12": "Diciembre",
};

function buildYears(): string[] {
  const current = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => String(current - i));
}

interface ReportRow {
  member: Member;
  donations: Donation[];
  total: number;
}

function buildReportRows(
  members: Member[],
  donations: Donation[],
): ReportRow[] {
  const grouped = new Map<string, Donation[]>();
  for (const d of donations) {
    const key = d.memberId.toString();
    const arr = grouped.get(key) ?? [];
    arr.push(d);
    grouped.set(key, arr);
  }
  return members
    .map((m) => {
      const ds = grouped.get(m.id.toString()) ?? [];
      return {
        member: m,
        donations: ds,
        total: ds.reduce((s, d) => s + d.amount, 0),
      };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);
}

function ReportTable({
  rows,
  period,
  isLoading,
}: {
  rows: ReportRow[];
  period: string;
  isLoading: boolean;
}) {
  const grandTotal = useMemo(
    () => rows.reduce((s, r) => s + r.total, 0),
    [rows],
  );

  const handlePrintMember = (row: ReportRow) => {
    printMemberReceipt({
      memberName: row.member.name,
      period,
      donations: row.donations.map((d) => ({ date: d.date, amount: d.amount })),
      total: row.total,
    });
  };

  const handlePrintSummary = () => {
    printSummaryReport({
      period,
      rows: rows.map((r) => ({ name: r.member.name, total: r.total })),
      grandTotal,
    });
  };

  if (isLoading) {
    return (
      <div data-ocid="reports.table.loading_state" className="space-y-3">
        {SKELETON_ROWS.map((k) => (
          <Skeleton key={k} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div
        data-ocid="reports.table.empty_state"
        className="text-center py-10 text-sm text-muted-foreground"
      >
        No hay donaciones para este período.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          data-ocid="reports.print_summary.button"
          onClick={handlePrintSummary}
          size="sm"
          className="bg-gold hover:bg-gold-dark text-foreground font-semibold"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Imprimir Resumen
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-cream/60 hover:bg-cream/60">
            <TableHead className="text-xs font-semibold text-navy">#</TableHead>
            <TableHead className="text-xs font-semibold text-navy">
              Miembro
            </TableHead>
            <TableHead className="text-xs font-semibold text-navy text-right">
              Total
            </TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={row.member.id.toString()}
              data-ocid={`reports.row.item.${i + 1}`}
              className="text-[13px]"
            >
              <TableCell className="text-muted-foreground text-xs">
                {i + 1}
              </TableCell>
              <TableCell className="font-medium">{row.member.name}</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(row.total)}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  data-ocid={`reports.print_receipt.button.${i + 1}`}
                  onClick={() => handlePrintMember(row)}
                  title="Imprimir recibo"
                  className="text-muted-foreground hover:text-navy transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-cream/50 font-bold">
            <TableCell />
            <TableCell>Gran Total</TableCell>
            <TableCell className="text-right">
              {formatCurrency(grandTotal)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function MonthlyReport({
  members,
  allDonations,
  isLoading,
}: {
  members: Member[];
  allDonations: Donation[];
  isLoading: boolean;
}) {
  const currentYM = getCurrentYearMonth();
  const [yearMonth, setYearMonth] = useState(currentYM);
  const [selectedYear, selectedMonth] = yearMonth.split("-");
  const years = buildYears();

  const filteredDonations = useMemo(
    () => allDonations.filter((d) => d.date.startsWith(yearMonth)),
    [allDonations, yearMonth],
  );

  const rows = useMemo(
    () => buildReportRows(members, filteredDonations),
    [members, filteredDonations],
  );

  const periodLabel = formatYearMonth(yearMonth);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          value={selectedMonth}
          onValueChange={(m) => setYearMonth(`${selectedYear}-${m}`)}
        >
          <SelectTrigger data-ocid="reports.month.select" className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m} value={m}>
                {MONTH_NAMES[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedYear}
          onValueChange={(y) => setYearMonth(`${y}-${selectedMonth}`)}
        >
          <SelectTrigger
            data-ocid="reports.month_year.select"
            className="w-28 h-9"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ReportTable rows={rows} period={periodLabel} isLoading={isLoading} />
    </div>
  );
}

function AnnualReport({
  members,
  allDonations,
  isLoading,
}: {
  members: Member[];
  allDonations: Donation[];
  isLoading: boolean;
}) {
  const [year, setYear] = useState(getCurrentYear());
  const years = buildYears();

  const filteredDonations = useMemo(
    () => allDonations.filter((d) => d.date.startsWith(year)),
    [allDonations, year],
  );

  const rows = useMemo(
    () => buildReportRows(members, filteredDonations),
    [members, filteredDonations],
  );

  return (
    <div className="space-y-4">
      <Select value={year} onValueChange={setYear}>
        <SelectTrigger data-ocid="reports.year.select" className="w-28 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ReportTable rows={rows} period={`Año ${year}`} isLoading={isLoading} />
    </div>
  );
}

export function ReportsPage() {
  const { data: members = [], isLoading: loadingMembers } = useMembers();
  const { data: allDonations = [], isLoading: loadingDonations } =
    useAllDonations();
  const isLoading = loadingMembers || loadingDonations;

  if (isLoading && members.length === 0) {
    return (
      <div data-ocid="reports.loading_state" className="space-y-3">
        {SKELETON_ROWS.map((k) => (
          <Skeleton key={k} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="shadow-card border-cream-dark">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-navy">
          Reportes de Ofrendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="mb-5">
            <TabsTrigger data-ocid="reports.monthly.tab" value="monthly">
              Reporte Mensual
            </TabsTrigger>
            <TabsTrigger data-ocid="reports.annual.tab" value="annual">
              Reporte Anual
            </TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <MonthlyReport
              members={members}
              allDonations={allDonations}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="annual">
            <AnnualReport
              members={members}
              allDonations={allDonations}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
