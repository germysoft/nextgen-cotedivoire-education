export interface Book {
  id: string;
  code: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  subcategory: string;
  year: number;
  pages: number;
  language: string;
  location: string;
  shelf: string;
  quantity: number;
  available: number;
  condition: 'Neuf' | 'Bon' | 'Acceptable' | 'Usé';
  cover?: string;
  description: string;
  keywords: string[];
  dateAdded: string;
  lastInventory: string;
  price: number;
}

export interface Borrowing {
  id: string;
  bookId: string;
  bookCode: string;
  bookTitle: string;
  borrowerId: string;
  borrowerName: string;
  borrowerType: 'Élève' | 'Enseignant' | 'Personnel';
  borrowerClass?: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'En cours' | 'En retard' | 'Retourné' | 'Perdu';
  renewals: number;
  notes?: string;
  penaltyAmount?: number;
  penaltyPaid?: boolean;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCode: string;
  userId: string;
  userName: string;
  userClass?: string;
  reservationDate: string;
  status: 'En attente' | 'Disponible' | 'Annulée' | 'Convertie';
  position: number;
  notificationSent: boolean;
  expirationDate?: string;
}

export interface ReaderCard {
  id: string;
  number: string;
  userId: string;
  userName: string;
  userType: 'Élève' | 'Enseignant' | 'Personnel';
  userClass?: string;
  issueDate: string;
  expirationDate: string;
  status: 'Active' | 'Expirée' | 'Suspendue' | 'Perdue';
  borrowLimit: number;
  currentBorrowings: number;
  totalBorrowings: number;
  penalties: number;
  photo?: string;
}

export interface InventoryItem {
  id: string;
  bookId: string;
  bookCode: string;
  bookTitle: string;
  expectedQuantity: number;
  foundQuantity: number;
  difference: number;
  condition: 'Neuf' | 'Bon' | 'Acceptable' | 'Usé' | 'Manquant';
  notes?: string;
  inventoryDate: string;
  inventoryBy: string;
}

export const mockBooks: Book[] = [
  {
    id: "1",
    code: "MAT-6EM-001",
    isbn: "978-2-7531-1234-5",
    title: "Mathématiques 6ème - Collection CIAM",
    author: "CEDA",
    publisher: "CEDA Éditions",
    category: "Manuel scolaire",
    subcategory: "Mathématiques",
    year: 2023,
    pages: 280,
    language: "Français",
    location: "Rayon A",
    shelf: "A-01",
    quantity: 150,
    available: 142,
    condition: "Bon",
    description: "Manuel de mathématiques pour la classe de 6ème, conforme au programme MENA.",
    keywords: ["mathématiques", "6ème", "CIAM", "manuel"],
    dateAdded: "2023-09-01",
    lastInventory: "2024-10-15",
    price: 3500
  },
  {
    id: "2",
    code: "FRA-6EM-001",
    isbn: "978-2-7531-1235-6",
    title: "Français 6ème - Lecture et Expression",
    author: "CEDA",
    publisher: "CEDA Éditions",
    category: "Manuel scolaire",
    subcategory: "Français",
    year: 2023,
    pages: 320,
    language: "Français",
    location: "Rayon A",
    shelf: "A-02",
    quantity: 150,
    available: 138,
    condition: "Bon",
    description: "Manuel de français pour la classe de 6ème avec exercices de lecture et d'expression.",
    keywords: ["français", "6ème", "lecture", "expression"],
    dateAdded: "2023-09-01",
    lastInventory: "2024-10-15",
    price: 3500
  },
  {
    id: "3",
    code: "LIT-AFR-023",
    isbn: "978-2-07-040850-4",
    title: "L'Enfant Noir",
    author: "Camara Laye",
    publisher: "Plon",
    category: "Roman",
    subcategory: "Littérature africaine",
    year: 1953,
    pages: 256,
    language: "Français",
    location: "Rayon C",
    shelf: "C-05",
    quantity: 45,
    available: 32,
    condition: "Acceptable",
    description: "Roman autobiographique de Camara Laye, prix Charles Veillon 1954.",
    keywords: ["roman", "Guinée", "autobiographie", "Afrique"],
    dateAdded: "2020-01-15",
    lastInventory: "2024-10-15",
    price: 5500
  },
  {
    id: "4",
    code: "LIT-AFR-045",
    isbn: "978-2-07-036024-6",
    title: "Une Vie de Boy",
    author: "Ferdinand Oyono",
    publisher: "Julliard",
    category: "Roman",
    subcategory: "Littérature africaine",
    year: 1956,
    pages: 185,
    language: "Français",
    location: "Rayon C",
    shelf: "C-05",
    quantity: 40,
    available: 28,
    condition: "Bon",
    description: "Roman camerounais sur la colonisation française.",
    keywords: ["roman", "Cameroun", "colonisation", "Afrique"],
    dateAdded: "2020-01-15",
    lastInventory: "2024-10-15",
    price: 4500
  },
  {
    id: "5",
    code: "REF-DIC-001",
    isbn: "978-2-03-590100-2",
    title: "Dictionnaire Larousse 2024",
    author: "Larousse",
    publisher: "Larousse",
    category: "Référence",
    subcategory: "Dictionnaire",
    year: 2024,
    pages: 1850,
    language: "Français",
    location: "Rayon R",
    shelf: "R-01",
    quantity: 30,
    available: 25,
    condition: "Neuf",
    description: "Dictionnaire de la langue française, édition 2024.",
    keywords: ["dictionnaire", "français", "référence"],
    dateAdded: "2024-01-10",
    lastInventory: "2024-10-15",
    price: 15000
  },
  {
    id: "6",
    code: "SCI-PHY-012",
    isbn: "978-2-7531-2345-6",
    title: "Physique-Chimie 2nde",
    author: "Collectif",
    publisher: "Hatier",
    category: "Manuel scolaire",
    subcategory: "Sciences",
    year: 2023,
    pages: 340,
    language: "Français",
    location: "Rayon B",
    shelf: "B-03",
    quantity: 80,
    available: 72,
    condition: "Bon",
    description: "Manuel de physique-chimie pour la classe de seconde.",
    keywords: ["physique", "chimie", "2nde", "sciences"],
    dateAdded: "2023-09-01",
    lastInventory: "2024-10-15",
    price: 4000
  },
  {
    id: "7",
    code: "LIT-FRA-089",
    isbn: "978-2-07-040850-5",
    title: "Le Père Goriot",
    author: "Honoré de Balzac",
    publisher: "Gallimard",
    category: "Roman",
    subcategory: "Littérature française",
    year: 1835,
    pages: 380,
    language: "Français",
    location: "Rayon C",
    shelf: "C-02",
    quantity: 35,
    available: 30,
    condition: "Bon",
    description: "Roman de Balzac faisant partie de La Comédie Humaine.",
    keywords: ["Balzac", "roman", "19ème siècle", "Paris"],
    dateAdded: "2019-09-01",
    lastInventory: "2024-10-15",
    price: 4500
  },
  {
    id: "8",
    code: "ENC-GEN-001",
    isbn: "978-2-03-590200-1",
    title: "Encyclopédie Universelle Junior",
    author: "Collectif",
    publisher: "Larousse",
    category: "Référence",
    subcategory: "Encyclopédie",
    year: 2023,
    pages: 650,
    language: "Français",
    location: "Rayon R",
    shelf: "R-02",
    quantity: 15,
    available: 15,
    condition: "Neuf",
    description: "Encyclopédie adaptée aux jeunes lecteurs avec illustrations.",
    keywords: ["encyclopédie", "junior", "référence", "culture générale"],
    dateAdded: "2023-01-15",
    lastInventory: "2024-10-15",
    price: 25000
  }
];

export const mockBorrowings: Borrowing[] = [
  {
    id: "1",
    bookId: "3",
    bookCode: "LIT-AFR-023",
    bookTitle: "L'Enfant Noir",
    borrowerId: "STU001",
    borrowerName: "KOUASSI Jean",
    borrowerType: "Élève",
    borrowerClass: "3ème A",
    borrowDate: "2024-12-01",
    dueDate: "2024-12-15",
    status: "En cours",
    renewals: 0
  },
  {
    id: "2",
    bookId: "4",
    bookCode: "LIT-AFR-045",
    bookTitle: "Une Vie de Boy",
    borrowerId: "STU002",
    borrowerName: "DIALLO Fatou",
    borrowerType: "Élève",
    borrowerClass: "1ère A",
    borrowDate: "2024-11-28",
    dueDate: "2024-12-12",
    status: "En retard",
    renewals: 1,
    penaltyAmount: 500
  },
  {
    id: "3",
    bookId: "1",
    bookCode: "MAT-6EM-001",
    bookTitle: "Mathématiques 6ème - Collection CIAM",
    borrowerId: "STU003",
    borrowerName: "TRAORÉ Yao",
    borrowerType: "Élève",
    borrowerClass: "6ème B",
    borrowDate: "2024-12-05",
    dueDate: "2024-12-19",
    status: "En cours",
    renewals: 0
  },
  {
    id: "4",
    bookId: "7",
    bookCode: "LIT-FRA-089",
    bookTitle: "Le Père Goriot",
    borrowerId: "TEA001",
    borrowerName: "M. KONÉ Bernard",
    borrowerType: "Enseignant",
    borrowDate: "2024-11-15",
    dueDate: "2024-12-15",
    status: "En cours",
    renewals: 1
  },
  {
    id: "5",
    bookId: "3",
    bookCode: "LIT-AFR-023",
    bookTitle: "L'Enfant Noir",
    borrowerId: "STU004",
    borrowerName: "SANOGO Aminata",
    borrowerType: "Élève",
    borrowerClass: "3ème C",
    borrowDate: "2024-11-20",
    dueDate: "2024-12-04",
    status: "En retard",
    renewals: 0,
    penaltyAmount: 850
  },
  {
    id: "6",
    bookId: "6",
    bookCode: "SCI-PHY-012",
    bookTitle: "Physique-Chimie 2nde",
    borrowerId: "STU005",
    borrowerName: "BAMBA Sarah",
    borrowerType: "Élève",
    borrowerClass: "2nde C",
    borrowDate: "2024-11-10",
    dueDate: "2024-11-24",
    returnDate: "2024-11-22",
    status: "Retourné",
    renewals: 0
  }
];

export const mockReservations: Reservation[] = [
  {
    id: "1",
    bookId: "3",
    bookTitle: "L'Enfant Noir",
    bookCode: "LIT-AFR-023",
    userId: "STU010",
    userName: "KONATÉ Moussa",
    userClass: "3ème B",
    reservationDate: "2024-12-10",
    status: "En attente",
    position: 1,
    notificationSent: false
  },
  {
    id: "2",
    bookId: "3",
    bookTitle: "L'Enfant Noir",
    bookCode: "LIT-AFR-023",
    userId: "STU011",
    userName: "YAO Prisca",
    userClass: "3ème A",
    reservationDate: "2024-12-11",
    status: "En attente",
    position: 2,
    notificationSent: false
  },
  {
    id: "3",
    bookId: "4",
    bookTitle: "Une Vie de Boy",
    bookCode: "LIT-AFR-045",
    userId: "STU012",
    userName: "TOURÉ Ibrahim",
    userClass: "1ère C",
    reservationDate: "2024-12-08",
    status: "En attente",
    position: 1,
    notificationSent: false
  },
  {
    id: "4",
    bookId: "7",
    bookTitle: "Le Père Goriot",
    bookCode: "LIT-FRA-089",
    userId: "STU013",
    userName: "DIABATÉ Aïssatou",
    userClass: "Tle A",
    reservationDate: "2024-12-05",
    status: "Disponible",
    position: 1,
    notificationSent: true,
    expirationDate: "2024-12-22"
  }
];

export const mockReaderCards: ReaderCard[] = [
  {
    id: "1",
    number: "LEC-2024-0001",
    userId: "STU001",
    userName: "KOUASSI Jean",
    userType: "Élève",
    userClass: "3ème A",
    issueDate: "2024-09-15",
    expirationDate: "2025-06-30",
    status: "Active",
    borrowLimit: 3,
    currentBorrowings: 1,
    totalBorrowings: 12,
    penalties: 0
  },
  {
    id: "2",
    number: "LEC-2024-0002",
    userId: "STU002",
    userName: "DIALLO Fatou",
    userType: "Élève",
    userClass: "1ère A",
    issueDate: "2024-09-15",
    expirationDate: "2025-06-30",
    status: "Active",
    borrowLimit: 3,
    currentBorrowings: 1,
    totalBorrowings: 8,
    penalties: 500
  },
  {
    id: "3",
    number: "LEC-2024-0003",
    userId: "TEA001",
    userName: "M. KONÉ Bernard",
    userType: "Enseignant",
    issueDate: "2024-09-01",
    expirationDate: "2025-08-31",
    status: "Active",
    borrowLimit: 10,
    currentBorrowings: 1,
    totalBorrowings: 25,
    penalties: 0
  },
  {
    id: "4",
    number: "LEC-2024-0045",
    userId: "STU045",
    userName: "SANOGO Aminata",
    userType: "Élève",
    userClass: "3ème C",
    issueDate: "2024-09-15",
    expirationDate: "2025-06-30",
    status: "Suspendue",
    borrowLimit: 3,
    currentBorrowings: 1,
    totalBorrowings: 5,
    penalties: 850
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: "1",
    bookId: "1",
    bookCode: "MAT-6EM-001",
    bookTitle: "Mathématiques 6ème - Collection CIAM",
    expectedQuantity: 150,
    foundQuantity: 150,
    difference: 0,
    condition: "Bon",
    inventoryDate: "2024-10-15",
    inventoryBy: "Mme KOUADIO"
  },
  {
    id: "2",
    bookId: "3",
    bookCode: "LIT-AFR-023",
    bookTitle: "L'Enfant Noir",
    expectedQuantity: 45,
    foundQuantity: 43,
    difference: -2,
    condition: "Acceptable",
    notes: "2 exemplaires manquants, probablement perdus",
    inventoryDate: "2024-10-15",
    inventoryBy: "Mme KOUADIO"
  },
  {
    id: "3",
    bookId: "5",
    bookCode: "REF-DIC-001",
    bookTitle: "Dictionnaire Larousse 2024",
    expectedQuantity: 30,
    foundQuantity: 30,
    difference: 0,
    condition: "Neuf",
    inventoryDate: "2024-10-15",
    inventoryBy: "Mme KOUADIO"
  }
];

export const bookCategories = [
  "Manuel scolaire",
  "Roman",
  "Référence",
  "Sciences",
  "Histoire",
  "Géographie",
  "Poésie",
  "Théâtre",
  "Bande dessinée",
  "Périodique",
  "Documentaire"
];

export const bookSubcategories: Record<string, string[]> = {
  "Manuel scolaire": ["Mathématiques", "Français", "Sciences", "Histoire-Géo", "Anglais", "Philosophie"],
  "Roman": ["Littérature africaine", "Littérature française", "Littérature anglaise", "Science-fiction", "Policier"],
  "Référence": ["Dictionnaire", "Encyclopédie", "Atlas", "Annuaire"],
  "Sciences": ["Physique", "Chimie", "Biologie", "SVT", "Informatique"],
  "Histoire": ["Histoire africaine", "Histoire mondiale", "Préhistoire"],
  "Géographie": ["Afrique", "Monde", "Cartes"],
  "Poésie": ["Classique", "Contemporaine", "Africaine"],
  "Théâtre": ["Classique", "Moderne", "Africain"],
  "Bande dessinée": ["Aventure", "Humour", "Éducatif"],
  "Périodique": ["Magazine", "Journal", "Revue scientifique"],
  "Documentaire": ["Nature", "Sciences", "Arts", "Sport"]
};

export const locations = [
  { code: "A", name: "Rayon A - Manuels Scolaires" },
  { code: "B", name: "Rayon B - Sciences" },
  { code: "C", name: "Rayon C - Littérature" },
  { code: "D", name: "Rayon D - Histoire & Géographie" },
  { code: "R", name: "Rayon R - Références" },
  { code: "P", name: "Rayon P - Périodiques" },
  { code: "E", name: "Espace Enfants" }
];
