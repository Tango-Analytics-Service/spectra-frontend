export interface FilterCreateRequest {
    name: string;
    criteria: string;
    threshold: number;
    strictness: number;
    category?: string;
    template?: string;
}
