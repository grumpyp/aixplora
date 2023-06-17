export interface FileFormat{
    name: string,
    type: string,
    size: number
}

export type RootState = {
    files: FileFormat[];
  };

export interface FileSpliceState {
  files: FileFormat[];
}



export interface TableScrollAreaProps {
    data: FileFormat[];
  }
  