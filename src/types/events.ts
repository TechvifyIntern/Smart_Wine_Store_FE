export interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    category: 'tasting' | 'workshop' | 'dinner' | 'festival';
    price: number;
    availableSeats: number;
    featured?: boolean;
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    authorImage: string;
    date: string;
    readTime: string;
    image: string;
    category: string;
    tags: string[];
    featured?: boolean;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}
