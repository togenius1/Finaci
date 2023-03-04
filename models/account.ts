export class Cash {
  constructor(id, title, budget, date) {
    this.id = id;
    this.title = title;
    this.budget: budget;
    this.date: date;
  }
}

export class Account {
  constructor(id, title, budget, date) {
    this.id = id;
    this.title = title;
    this.budget: budget;
    this.date: date;
  }
}

// export class Credit {
//   constructor(id, title) {
//     this.id = id;
//     this.title = title;
//   }
// }

// Type
export interface CashType {
  id: string;
  title: string;
  budget: number;
  date:Date
}

export interface AccountType {
  id: string;
  title: string;
  budget: number;
  date:Date
}
