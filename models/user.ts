export default class User {
  constructor(id, name, groupUserId) {
    this.id = id;
    this.name = name;
    this.groupUserId = groupUserId;
  }
}

// export default Expense;

export interface UserType {
  id: string;
  name: string;
  groupUserId: string;
}
