import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, Crosshair } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  steam_id: z.string().trim().min(3, "Steam ID obrigatório").max(50),
  game_nickname: z.string().trim().min(2, "Nickname obrigatório").max(50),
  phone: z.string().trim().max(20).optional(),
  pix_key: z.string().trim().min(3, "Chave PIX obrigatória").max(100),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que 0"),
  notes: z.string().trim().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

export default function CashbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
  
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle className="mx-auto h-16 w-16 text-primary animate-pulse-neon" />
        <h3 className="font-heading text-2xl font-bold text-foreground">Solicitação Enviada!</h3>
        <p className="text-muted-foreground">Seu cashback será processado em breve.</p>
        <Button onClick={() => setSubmitted(false)} className="mt-4">
          Enviar Outro
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-2 mb-6">
        <Crosshair className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-xl font-bold text-foreground">Solicitar Cashback</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome Completo *</Label>
          <Input id="full_name" {...register("full_name")} placeholder="Seu nome completo" className="bg-muted border-border focus:border-primary" />
          {errors.full_name && <p className="text-destructive text-sm">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="email@exemplo.com" className="bg-muted border-border focus:border-primary" />
          {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="steam_id">Steam ID *</Label>
          <Input id="steam_id" {...register("steam_id")} placeholder="STEAM_0:1:12345678" className="bg-muted border-border focus:border-primary" />
          {errors.steam_id && <p className="text-destructive text-sm">{errors.steam_id.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="game_nickname">Nickname no Jogo *</Label>
          <Input id="game_nickname" {...register("game_nickname")} placeholder="Seu nick in-game" className="bg-muted border-border focus:border-primary" />
          {errors.game_nickname && <p className="text-destructive text-sm">{errors.game_nickname.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...register("phone")} placeholder="(11) 99999-9999" className="bg-muted border-border focus:border-primary" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pix_key">Chave PIX *</Label>
          <Input id="pix_key" {...register("pix_key")} placeholder="CPF, email ou chave aleatória" className="bg-muted border-border focus:border-primary" />
          {errors.pix_key && <p className="text-destructive text-sm">{errors.pix_key.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor do Cashback (R$) *</Label>
        <Input id="amount" type="number" step="0.01" {...register("amount")} placeholder="0.00" className="bg-muted border-border focus:border-primary" />
        {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" {...register("notes")} placeholder="Informações adicionais..." className="bg-muted border-border focus:border-primary min-h-[80px]" />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full font-heading text-lg font-bold tracking-wider uppercase h-12">
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar Solicitação"}
      </Button>
    </form>
  );
}
