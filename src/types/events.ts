export interface Event {
  EventID: number;
  EventName: string;
  Description: string;
  ImageURL: string | null;
  DiscountValue: number;
  DiscountTypeID: number;
  MinimumValue: number;
  TimeStart: string;
  TimeEnd: string;
  CreatedAt: string;
  UpdatedAt: string;
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
