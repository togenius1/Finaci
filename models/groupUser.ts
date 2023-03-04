export default class GroupUser {
  constructor(id, title, backupId) {
    this.id = id;
    this.title = title;
    this.backupId = backupId;
  }
}

// export default Expense;

export interface GroupUserType {
  id: string;
  title: string;
  backupId: string;
}
