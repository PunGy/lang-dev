export interface System {
  run(): void;
  name: string;
  getActiveFile(): string | null;
  setActiveFileState(content: string): void;
  onFileChange(fn: () => void): void;
}

