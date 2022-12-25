export class RecoveryClosingDto {
    txId:string;
	clientId:string;
	clientName:string;
	product:string;
	loanId:string;
	paymentMode:string;
	instrument:number;
	amount:string;
    status:string;
	paymentDate:Date;
	recoveryTypeSeq:number;
	recoveryTypeName:string;
    constructor()
    {}
}
