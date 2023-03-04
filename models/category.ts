export default class Category {
  constructor(id, title, date) {
    this.id = id;
    this.title = title;
    this.date: date;
  }
}

// Type
export interface CategoryType {
  id: string;
  title: string;
  date: Date;
}
