import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddDonation, useMembers } from "../hooks/useQueries";
import { todayISO } from "../utils/formatters";

export function RecordDonationPage() {
  const { data: members, isLoading: loadingMembers } = useMembers();
  const addDonation = useAddDonation();

  const [memberId, setMemberId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [success, setSuccess] = useState(false);

  const sortedMembers = [...(members ?? [])].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !amount || !date) return;
    const parsedAmount = Number.parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Ingrese un monto válido");
      return;
    }
    try {
      await addDonation.mutateAsync({
        memberId: BigInt(memberId),
        amount: parsedAmount,
        date,
      });
      toast.success("Ofrenda registrada exitosamente");
      setSuccess(true);
      setMemberId("");
      setAmount("");
      setDate(todayISO());
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      toast.error("Error al registrar la ofrenda");
    }
  };

  return (
    <div className="max-w-md">
      <Card className="shadow-card border-cream-dark">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-navy">
            Registrar Nueva Ofrenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Member select */}
            <div className="space-y-1.5">
              <Label htmlFor="donation-member">Miembro *</Label>
              <Select
                value={memberId}
                onValueChange={setMemberId}
                disabled={loadingMembers}
              >
                <SelectTrigger
                  data-ocid="record.member.select"
                  id="donation-member"
                  className="h-10"
                >
                  <SelectValue
                    placeholder={
                      loadingMembers ? "Cargando..." : "Seleccionar miembro"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {sortedMembers.map((m) => (
                    <SelectItem key={m.id.toString()} value={m.id.toString()}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="donation-amount">Monto *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  $
                </span>
                <Input
                  data-ocid="record.amount.input"
                  id="donation-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 h-10"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="donation-date">Fecha *</Label>
              <Input
                data-ocid="record.date.input"
                id="donation-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10"
                required
              />
            </div>

            {/* Submit */}
            <Button
              data-ocid="record.submit_button"
              type="submit"
              disabled={addDonation.isPending || !memberId || !amount || !date}
              className="w-full bg-gold hover:bg-gold-dark text-foreground font-semibold h-10"
            >
              {addDonation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  ¡Registrado!
                </>
              ) : (
                "Registrar Ofrenda"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
