/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type DialogType = "OPEN" | "FOLDER" | "SAVE";
export type JobStatus = "RUNNING" | "STOPPED" | "DONE";
export type StreamType = "STDOUT" | "STDERR";
export type PyAction = "PY_JOB_STREAM" | "PY_JOB_STATUS" | "PY_JOB_ERROR" | "PY_WATCH_FILE";
export type WatchStatus = "CREATED" | "MODIFIED" | "DELETED";

export interface DialogOptions {
  dialog_type?: DialogType;
  directory?: string;
  allow_multiple?: boolean;
  save_filename?: string;
  file_types?: string[];
}
export interface DropFile {
  name: string;
  last_modified: number;
  last_modified_date: {
    [k: string]: unknown;
  };
  webkit_relative_path: string;
  size: number;
  type: string;
  pywebview_full_path: string;
}
export interface JobDataError {
  message?: string;
}
export interface JobDataStatus {
  status: JobStatus;
}
export interface JobDataStream {
  message?: string;
  message_type: StreamType;
}
export interface PyJobEvent {
  job_id?: string;
  action: PyAction;
  data: JobDataStream | JobDataStatus | JobDataError;
  timestamp?: number;
}
export interface PyWatchEvent {
  action: PyAction;
  data: WatchFile;
}
export interface WatchFile {
  status: WatchStatus;
  path: string;
  key: string;
  mtime: number;
}
export interface Sub {
  fullpath: string;
  subtype: string;
  lang: string;
  priority: number;
  src: string;
}
