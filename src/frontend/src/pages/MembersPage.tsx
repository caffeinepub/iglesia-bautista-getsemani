import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Donation, Member } from "../backend";
import {
  useAddMember,
  useDeleteDonation,
  useDeleteMember,
  useDonationsByMember,
  useMembers,
  useUpdateMember,
} from "../hooks/useQueries";
import { formatCurrency, formatDate } from "../utils/formatters";

const SKELETON_ROWS_4 = ["a", "b", "c", "d"];
const SKELETON_ROWS_6 = ["a", "b", "c", "d", "e", "f"];

// ─── Member Donations Detail Dialog ──────────────────────────────────────────
function MemberDetailDialog({
  member,
  onClose,
}: {
  member: Member | null;
  onClose: () => void;
}) {
  const { data: donations, isLoading } = useDonationsByMember(
    member ? member.id : null,
  );
  const deleteDonation = useDeleteDonation();

  const total = useMemo(
    () => (donations ?? []).reduce((s, d) => s + d.amount, 0),
    [donations],
  );

  const sortedDonations = useMemo(
    () =>
      [...(donations ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [donations],
  );

  const handleDeleteDonation = async (d: Donation) => {
    await deleteDonation.mutateAsync(d.id);
    toast.success("Donación eliminada");
  };

  return (
    <Dialog open={!!member} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="member.detail.dialog"
        className="max-w-2xl max-h-[80vh] flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="text-navy">
            {member?.name} — Historial de Ofrendas
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div
            data-ocid="member.detail.loading_state"
            className="space-y-3 flex-1"
          >
            {SKELETON_ROWS_4.map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {sortedDonations.length === 0 ? (
              <p
                data-ocid="member.detail.empty_state"
                className="text-sm text-muted-foreground text-center py-8"
              >
                No hay donaciones registradas.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-cream/60 hover:bg-cream/60">
                    <TableHead className="text-xs font-semibold text-navy">
                      Fecha
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-navy text-right">
                      Monto
                    </TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDonations.map((d, i) => (
                    <TableRow
                      key={d.id.toString()}
                      data-ocid={`member.donation.item.${i + 1}`}
                      className="text-[13px]"
                    >
                      <TableCell>{formatDate(d.date)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(d.amount)}
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          data-ocid={`member.donation.delete_button.${i + 1}`}
                          onClick={() => handleDeleteDonation(d)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-cream/50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(total)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
        )}
        <DialogFooter>
          <Button
            data-ocid="member.detail.close_button"
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Add/Edit Member Dialog ───────────────────────────────────────────────────
function MemberFormDialog({
  open,
  member,
  onClose,
}: {
  open: boolean;
  member: Member | null;
  onClose: () => void;
}) {
  const addMember = useAddMember();
  const updateMember = useUpdateMember();
  const [name, setName] = useState(member?.name ?? "");

  const isEdit = !!member;
  const isPending = addMember.isPending || updateMember.isPending;

  useEffect(() => {
    setName(member?.name ?? "");
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (isEdit && member) {
        await updateMember.mutateAsync({ id: member.id, name: name.trim() });
        toast.success("Miembro actualizado");
      } else {
        await addMember.mutateAsync({ name: name.trim() });
        toast.success("Miembro agregado");
      }
      onClose();
    } catch {
      toast.error("Error al guardar el miembro");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-ocid="member.form.dialog" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-navy">
            {isEdit ? "Editar Miembro" : "Agregar Miembro"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="member-name">Nombre *</Label>
            <Input
              data-ocid="member.form.input"
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              required
            />
          </div>
          <DialogFooter>
            <Button
              data-ocid="member.form.cancel_button"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              data-ocid="member.form.submit_button"
              type="submit"
              disabled={isPending || !name.trim()}
              className="bg-gold hover:bg-gold-dark text-foreground font-semibold"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Guardar Cambios" : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main MembersPage ─────────────────────────────────────────────────────────
export function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const deleteMember = useDeleteMember();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (members ?? []).filter((m) => m.name.toLowerCase().includes(q));
  }, [members, search]);

  const handleDelete = async () => {
    if (!deletingMember) return;
    await deleteMember.mutateAsync(deletingMember.id);
    toast.success("Miembro eliminado");
    setDeletingMember(null);
  };

  const openAdd = () => {
    setEditMember(null);
    setFormOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditMember(m);
    setFormOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="members.search_input"
            placeholder="Buscar miembro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Button
          data-ocid="members.add.open_modal_button"
          onClick={openAdd}
          className="bg-gold hover:bg-gold-dark text-foreground font-semibold h-9"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Agregar Miembro
        </Button>
      </div>

      {/* Table */}
      <Card className="shadow-card border-cream-dark">
        <CardContent className="p-0">
          {isLoading ? (
            <div data-ocid="members.loading_state" className="p-6 space-y-3">
              {SKELETON_ROWS_6.map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="members.empty_state"
              className="p-8 text-center text-sm text-muted-foreground"
            >
              {search
                ? "No se encontraron miembros."
                : "No hay miembros registrados. Agregue miembros para comenzar."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-cream/60 hover:bg-cream/60">
                  <TableHead className="text-xs font-semibold text-navy">
                    #
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-navy">
                    Nombre
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-navy w-32 text-right">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filtered.map((m, i) => (
                    <motion.tr
                      key={m.id.toString()}
                      data-ocid={`members.item.${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] border-b border-cream-dark hover:bg-cream/30"
                    >
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 font-medium">{m.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            data-ocid={`members.view.button.${i + 1}`}
                            onClick={() => setDetailMember(m)}
                            title="Ver historial"
                            className="p-1.5 rounded hover:bg-navy/10 text-navy transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            data-ocid={`members.edit_button.${i + 1}`}
                            onClick={() => openEdit(m)}
                            title="Editar"
                            className="p-1.5 rounded hover:bg-gold/20 text-gold-dark transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            data-ocid={`members.delete_button.${i + 1}`}
                            onClick={() => setDeletingMember(m)}
                            title="Eliminar"
                            className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MemberFormDialog
        open={formOpen}
        member={editMember}
        onClose={() => setFormOpen(false)}
      />
      <MemberDetailDialog
        member={detailMember}
        onClose={() => setDetailMember(null)}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deletingMember}
        onOpenChange={(o) => !o && setDeletingMember(null)}
      >
        <AlertDialogContent data-ocid="members.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará <strong>{deletingMember?.name}</strong> y todas sus
              donaciones. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="members.delete.cancel_button">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="members.delete.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
