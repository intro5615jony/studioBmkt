export interface ProjectItem {
  id?: string;
  client: string;
  title: string;
  slug: string;
  category: string;
  segment?: string;
  imageUrl: string;
  gallery?: string[];
  shortDescription: string;
  fullDescription?: string;
  challenge?: string;
  solution?: string;
  services?: string[];
  tags?: string[];
  externalLink?: string;
  results?: string;
  status: 'Publicado' | 'Rascunho';
  highlightHome: boolean;
  order: number;
  createdAt?: any;
  updatedAt?: any;
}
