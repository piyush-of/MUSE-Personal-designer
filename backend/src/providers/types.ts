export interface AIProviderConfig {
  name: string;
  enabled: boolean;
}

export interface AIGenerateOptions {
  task?: string;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIProvider {
  readonly name: string;
  isEnabled(): boolean;
  generateJson(prompt: string, options?: AIGenerateOptions): Promise<Record<string, unknown> | null>;
}
