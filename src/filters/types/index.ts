export interface Filter {
    id: string;
    name: string;
    criteria: string;
    threshold?: number;
    strictness?: number;
    category: string;
    created_at: string;
    updated_at?: string;
    is_custom?: boolean;
}
