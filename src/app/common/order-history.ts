export class OrderHistory {

    constructor(public id: string,
                public orderTrackingNumbber: string,
                public totalPrice: number,
                public totalQuantity: number,
                public dateCreated: Date
    ) {}
}
