export enum STATUS {
    COMPLETED = 'COMPLETED',
    TO_DO = 'TO_DO',
    DOING = 'DOING',
}
export type ListItem = {
    id: number,
    text: string,
    status: STATUS
}