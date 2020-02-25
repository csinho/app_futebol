export interface Note {
    id?: any;
    title: string; // nome
    content: string; //descrição
    createdAt: any; //data de criação
    image: any;
    status_jogador: any;
    meses: {
        mes: {
            nome: any,
            valor: any,
            status: boolean,            
        }
    };
    
}
