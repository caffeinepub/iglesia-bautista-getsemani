import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import { useAllDonations, useMembers } from "../hooks/useQueries";
import {
  formatCurrency,
  formatDate,
  getCurrentYear,
  getCurrentYearMonth,
} from "../utils/formatters";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

export function DashboardPage() {
  const { data: members, isLoading: loadingMembers } = useMembers();
  const { data: allDonations, isLoading: loadingAll } = useAllDonations();

  const currentYM = getCurrentYearMonth();
  const currentYear = getCurrentYear();

  const monthTotal = useMemo(() => {
    return (allDonations ?? [])
      .filter((d) => d.date.startsWith(currentYM))
      .reduce((s, d) => s + d.amount, 0);
  }, [allDonations, currentYM]);

  const ytdTotal = useMemo(() => {
    return (allDonations ?? [])
      .filter((d) => d.date.startsWith(currentYear))
      .reduce((s, d) => s + d.amount, 0);
  }, [allDonations, currentYear]);

  const recentDonations = useMemo(() => {
    if (!allDonations) return [];
    return [...allDonations]
      .sort((a, b) => Number(b.createdAt - a.createdAt))
      .slice(0, 10);
  }, [allDonations]);

  const memberMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of members ?? []) {
      map.set(m.id.toString(), m.name);
    }
    return map;
  }, [members]);

  const kpis = [
    {
      title: "Total Miembros",
      value: loadingMembers ? null : (members?.length ?? 0).toString(),
      icon: Users,
      color: "text-navy",
      ocid: "dashboard.members.card",
    },
    {
      title: "Total del Mes",
      value: loadingAll ? null : formatCurrency(monthTotal),
      icon: Calendar,
      color: "text-gold-dark",
      ocid: "dashboard.month.card",
    },
    {
      title: "Total del Año",
      value: loadingAll ? null : formatCurrency(ytdTotal),
      icon: TrendingUp,
      color: "text-navy",
      ocid: "dashboard.year.card",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title}>
            <Card
              data-ocid={kpi.ocid}
              className="shadow-card border-cream-dark"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {kpi.value === null ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent donations */}
      <Card className="shadow-card border-cream-dark">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Donaciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingAll ? (
            <div
              data-ocid="dashboard.donations.loading_state"
              className="p-6 space-y-3"
            >
              {SKELETON_ROWS.map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : recentDonations.length === 0 ? (
            <div
              data-ocid="dashboard.donations.empty_state"
              className="p-8 text-center text-sm text-muted-foreground"
            >
              No hay donaciones registradas aún.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-cream/60 hover:bg-cream/60">
                  <TableHead className="text-xs font-semibold text-navy">
                    Miembro
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-navy">
                    Fecha
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-navy text-right">
                    Monto
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDonations.map((d, i) => (
                  <TableRow
                    key={d.id.toString()}
                    data-ocid={`dashboard.donations.item.${i + 1}`}
                    className="text-[13px]"
                  >
                    <TableCell className="font-medium">
                      {memberMap.get(d.memberId.toString()) ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(d.date)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(d.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
