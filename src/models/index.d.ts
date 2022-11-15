import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem } from "@aws-amplify/datastore";

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BackupKeyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerUser = {
  readonly id: string;
  readonly name?: string | null;
  readonly BackupKey?: BackupKey | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userBackupKeyId?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name?: string | null;
  readonly BackupKey: AsyncItem<BackupKey | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userBackupKeyId?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
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