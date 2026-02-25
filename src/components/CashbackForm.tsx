import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle, DollarSign } from "lucide-react";
import { cashbackService } from "@/lib/mockData";

const cashbackSchema = z.object({
  customerName: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(10, "Telefone obrigatório").max(20),
  cpf: z.string().trim().min(11, "CPF obrigatório").max(14),
  purchaseValue: z.coerce.number().min(1, "Valor da compra deve ser maior que 0"),
  store: z.string().trim().min(1, "Selecione uma loja"),
  category: z.string().trim().min(1, "Selecione uma categoria"),
});

type CashbackFormData = z.infer<typeof cashbackSchema>;

const stores = [
  "Shopping Del Rey",
  "BH Shopping",
  "Pátio Savassi",
  "Diamond Mall",
  "Shopping Estação",
  "Shopping Boulevard",
  "Shopping Cidade",
  "Via Shopping"
];

const categories = [
  "Eletrônicos",
  "Moda",
  "Alimentação",
  "Beleza",
  "Livros",
  "Casa & Decoração",
  "Farmácia",
  "Esportes"
];

export default function CashbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<CashbackFormData>({
    resolver: zodResolver(cashbackSchema),
  });

  const getCashbackPercent = (value: number, category: string): number => {
    // Mock cashback percentages based on category and value
    const categoryRates: Record<string, number> = {
      "Eletrônicos": value >= 500 ? 10 : 5,
      "Moda": value >= 300 ? 8 : 6,
      "Alimentação": 3,
      "Beleza": 6,
      "Livros": 4,
      "Casa & Decoração": 7,
      "Farmácia": 2,
      "Esportes": 5
    };
    return categoryRates[category] || 5;
  };

  const onSubmit = async (data: CashbackFormData) => {
    try {
      const cashbackPercent = getCashbackPercent(data.purchaseValue, data.category);
      const cashbackValue = (data.purchaseValue * cashbackPercent) / 100;

      await cashbackService.addEntry({
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        purchaseValue: data.purchaseValue,
        store: data.store,
        category: data.category,
        cashbackPercent,
        cashbackValue,
        status: 'pending',
        approvedAt: undefined
      });

      toast.success(`Solicitação enviada! Cashback de ${cashbackPercent}% = R$ ${cashbackValue.toFixed(2)}`);
      setSubmitted(true);
      reset();
      setSelectedStore("");
      setSelectedCategory("");
    } catch (error) {
      toast.error("Erro ao enviar solicitação");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle className="mx-auto h-16 w-16 text-primary animate-pulse" />
        <h3 className="font-heading text-2xl font-bold text-foreground">Solicitação Enviada!</h3>
        <p className="text-muted-foreground">Seu cashback será processado em breve.</p>
        <Button onClick={() => setSubmitted(false)} className="mt-4">
          Solicitar Outro Cashback
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-xl font-bold text-foreground">Solicitar Cashback</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nome Completo *</Label>
          <Input
            id="customerName"
            {...register("customerName")}
            placeholder="Seu nome completo"
            className="bg-muted border-border focus:border-primary"
          />
          {errors.customerName && <p className="text-destructive text-sm">{errors.customerName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="email@exemplo.com"
            className="bg-muted border-border focus:border-primary"
          />
          {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="(31) 99999-9999"
            className="bg-muted border-border focus:border-primary"
          />
          {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            {...register("cpf")}
            placeholder="000.000.000-00"
            className="bg-muted border-border focus:border-primary"
          />
          {errors.cpf && <p className="text-destructive text-sm">{errors.cpf.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="store">Loja *</Label>
          <Select
            value={selectedStore}
            onValueChange={(value) => {
              setSelectedStore(value);
              setValue("store", value);
            }}
          >
            <SelectTrigger className="bg-muted border-border focus:border-primary">
              <SelectValue placeholder="Selecione a loja" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store} value={store}>{store}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.store && <p className="text-destructive text-sm">{errors.store.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setValue("category", value);
            }}
          >
            <SelectTrigger className="bg-muted border-border focus:border-primary">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchaseValue">Valor da Compra (R$) *</Label>
        <Input
          id="purchaseValue"
          type="number"
          step="0.01"
          {...register("purchaseValue")}
          placeholder="0.00"
          className="bg-muted border-border focus:border-primary"
        />
        {errors.purchaseValue && <p className="text-destructive text-sm">{errors.purchaseValue.message}</p>}
      </div>

      {selectedCategory && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            🎉 <strong>{selectedCategory}</strong> tem cashback de até {' '}
            <span className="font-bold">
              {selectedCategory === "Eletrônicos" ? "10%" :
                selectedCategory === "Moda" ? "8%" :
                  selectedCategory === "Casa & Decoração" ? "7%" :
                    selectedCategory === "Beleza" ? "6%" :
                      selectedCategory === "Esportes" ? "5%" :
                        selectedCategory === "Livros" ? "4%" :
                          selectedCategory === "Alimentação" ? "3%" : "2%"}
            </span>
          </p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full font-heading text-lg font-bold tracking-wider uppercase h-12">
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Solicitar Cashback"}
      </Button>
    </form>
  );
}
