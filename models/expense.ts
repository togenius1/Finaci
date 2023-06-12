export default class Expense {
  constructor(id, cateId, accountId, amount, note, date) {
    this.id = id;
    this.cateId = cateId;
    this.accountId = accountId;
    this.amount = amount;
    this.note = note;
    this.date = date;
  }
}

// export default Expense;

export interface ExpenseType {
  id: string;
  cateId: string;
  accountId: string;
  amount: number;
  note: string;
  date: Date;
}
