export interface System {
  run(): void;
  name: string;
  getActiveFile(): string | null;
  setActiveFileState(content: string): string;
  onFileChange(fn: () => void): void;
}

