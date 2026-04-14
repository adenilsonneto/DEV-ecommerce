export interface Avaliacao {
    id_avaliacao: string // Obrigatorio
    id_pedido: string // Obrigatorio
    avaliacao: number // Obrigatorio
    titulo_comentario: string | null // Obrigatorio
    comentario: string | null // Obrigatorio 
    data_comentario: Date | null // Obrigatorio

}