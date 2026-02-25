export interface CashbackEntry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  cpf: string;
  purchaseValue: number;
  cashbackPercent: number;
  cashbackValue: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
  store: string;
  category: string;
}

export const mockCashbackData: CashbackEntry[] = [
  {
    id: '1',
    customerName: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(31) 99999-1234',
    cpf: '123.456.789-00',
    purchaseValue: 250.00,
    cashbackPercent: 5,
    cashbackValue: 12.50,
    status: 'approved',
    createdAt: new Date('2024-01-15'),
    approvedAt: new Date('2024-01-16'),
    store: 'Shopping Del Rey',
    category: 'Eletrônicos'
  },
  {
    id: '2',
    customerName: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(31) 88888-5678',
    cpf: '987.654.321-00',
    purchaseValue: 450.00,
    cashbackPercent: 8,
    cashbackValue: 36.00,
    status: 'pending',
    createdAt: new Date('2024-01-20'),
    store: 'BH Shopping',
    category: 'Moda'
  },
  {
    id: '3',
    customerName: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(31) 77777-9999',
    cpf: '456.789.123-00',
    purchaseValue: 180.00,
    cashbackPercent: 3,
    cashbackValue: 5.40,
    status: 'approved',
    createdAt: new Date('2024-01-25'),
    approvedAt: new Date('2024-01-25'),
    store: 'Pátio Savassi',
    category: 'Alimentação'
  },
  {
    id: '4',
    customerName: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(31) 66666-1111',
    cpf: '789.123.456-00',
    purchaseValue: 350.00,
    cashbackPercent: 6,
    cashbackValue: 21.00,
    status: 'rejected',
    createdAt: new Date('2024-01-28'),
    store: 'Diamond Mall',
    category: 'Beleza'
  },
  {
    id: '5',
    customerName: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    phone: '(31) 55555-2222',
    cpf: '321.654.987-00',
    purchaseValue: 120.00,
    cashbackPercent: 4,
    cashbackValue: 4.80,
    status: 'pending',
    createdAt: new Date('2024-02-01'),
    store: 'Shopping Estação',
    category: 'Livros'
  },
  {
    id: '6',
    customerName: 'Lucia Mendes',
    email: 'lucia.mendes@email.com',
    phone: '(31) 44444-3333',
    cpf: '654.987.321-00',
    purchaseValue: 890.00,
    cashbackPercent: 10,
    cashbackValue: 89.00,
    status: 'approved',
    createdAt: new Date('2024-02-05'),
    approvedAt: new Date('2024-02-06'),
    store: 'Shopping Boulevard',
    category: 'Eletrônicos'
  },
  {
    id: '7',
    customerName: 'Roberto Lima',
    email: 'roberto.lima@email.com',
    phone: '(31) 33333-4444',
    cpf: '147.258.369-00',
    purchaseValue: 75.00,
    cashbackPercent: 2,
    cashbackValue: 1.50,
    status: 'approved',
    createdAt: new Date('2024-02-10'),
    approvedAt: new Date('2024-02-10'),
    store: 'Shopping Cidade',
    category: 'Farmácia'
  },
  {
    id: '8',
    customerName: 'Fernanda Rocha',
    email: 'fernanda.rocha@email.com',
    phone: '(31) 22222-5555',
    cpf: '258.369.147-00',
    purchaseValue: 520.00,
    cashbackPercent: 7,
    cashbackValue: 36.40,
    status: 'pending',
    createdAt: new Date('2024-02-15'),
    store: 'Via Shopping',
    category: 'Casa & Decoração'
  }
];

// Mock service functions
export const cashbackService = {
  getAllEntries: async (): Promise<CashbackEntry[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockCashbackData;
  },

  updateStatus: async (id: string, status: CashbackEntry['status']): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const entry = mockCashbackData.find(item => item.id === id);
    if (entry) {
      entry.status = status;
      if (status === 'approved') {
        entry.approvedAt = new Date();
      }
    }
  },

  addEntry: async (entry: Omit<CashbackEntry, 'id' | 'createdAt'>): Promise<CashbackEntry> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newEntry: CashbackEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    mockCashbackData.unshift(newEntry);
    return newEntry;
  }
};