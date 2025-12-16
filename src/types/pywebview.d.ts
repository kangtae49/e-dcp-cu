export {};
type IntStr = number | string;

type SheetName = string | number | IntStr[] | null;

declare global {
  interface Window {
    pywebview: {
      api: {
        write_file(fullpath: string, content: string): Promise<void>,
        start_script(job_id: string, subpath: string, args: string[]): Promise<void>,
        stop_script(job_id: string): Promise<void>,
        start_data_file(subpath: string): Promise<void>,
        start_file(filepath: string): Promise<void>,
        // read_data_excel(subpath: string, sheet_name: SheetName): Promise<ConfigTable>,
        // read_config(subpath: string): Promise<string>,
        read_data_excel(subpath: string): Promise<string>,
        re_send_events(): Promise<void>,
        app_read_file(subpath: string): Promise<string>,
      },
    },

  }
}
