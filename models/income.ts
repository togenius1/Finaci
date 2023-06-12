export default class Income {
  constructor(id, cateId, accountId, amount, note, date) {
    this.id = id;
    this.cateId = cateId;
    this.accountId = accountId;
    this.amount = amount;
    this.note = note;
    this.date = date;
  }
}

export interface IncomeType {
  id: string;
  cateId: string;
  accountId: string;
  amount: number;
  note: string;
  date: Date;
}
