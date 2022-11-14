import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GroupUserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BackupKeyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerUser = {
  readonly id: string;
  readonly name: string;
  readonly groupuserID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name: string;
  readonly groupuserID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

type EagerGroupUser = {
  readonly id: string;
  readonly title?: string | null;
  readonly GroupUsers?: (User | null)[] | null;
  readonly GroupBackupKey?: BackupKey | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly groupUserGroupBackupKeyId?: string | null;
}

type LazyGroupUser = {
  readonly id: string;
  readonly title?: string | null;
  readonly GroupUsers: AsyncCollection<User>;
  readonly GroupBackupKey: AsyncItem<BackupKey | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly groupUserGroupBackupKeyId?: string | null;
}

export declare type GroupUser = LazyLoading extends LazyLoadingDisabled ? EagerGroupUser : LazyGroupUser

export declare const GroupUser: (new (init: ModelInit<GroupUser, GroupUserMetaData>) => GroupUser) & {
  copyOf(source: GroupUser, mutator: (draft: MutableModel<GroupUser, GroupUserMetaData>) => MutableModel<GroupUser, GroupUserMetaData> | void): GroupUser;
}

type EagerBackupKey = {
  readonly id: string;
  readonly key?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBackupKey = {
  readonly id: string;
  readonly key?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BackupKey = LazyLoading extends LazyLoadingDisabled ? EagerBackupKey : LazyBackupKey

export declare const BackupKey: (new (init: ModelInit<BackupKey, BackupKeyMetaData>) => BackupKey) & {
  copyOf(source: BackupKey, mutator: (draft: MutableModel<BackupKey, BackupKeyMetaData>) => MutableModel<BackupKey, BackupKeyMetaData> | void): BackupKey;
}