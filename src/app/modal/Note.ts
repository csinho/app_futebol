export interface Note {
    id?: any;
    title: string; // nome
    content: string; //descrição
    createdAt: any; //data de criação
    image: {
        name: string,
        filepath: string,
        size: number
    };
    status_jogador: Number;
    meses: {};    
}



export interface IMAGE {
    id?: any;
    title: string; // nome
    content: string; //descrição
    createdAt: any; //data de criação
    image: {
        name: string;
        filepath: string;
        size: number;
    };
    status_jogador: Number;
    meses: {}; 
}