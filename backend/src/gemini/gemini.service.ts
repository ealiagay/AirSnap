import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService implements OnModuleInit {
  private model: any;
  private genAI: GoogleGenerativeAI;
  private readonly MODEL_NAME = 'gemini-2.5-flash';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY no configurada en .env');
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
      console.log(`✅ Gemini inicializado correctamente con ${this.MODEL_NAME}`);
    } catch (error) {
      console.error(`❌ Error al inicializar el modelo ${this.MODEL_NAME}:`, error);
      throw error;
    }
  }

  /**
   * Realiza una consulta básica al modelo (modo texto normal)
   */
  async preguntar(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini no está inicializado. Verifica tu GEMINI_API_KEY');
    }

    try {
      const resultado = await this.model.generateContent(prompt);
      const respuesta = await resultado.response;
      return respuesta.text();
    } catch (error: unknown) {
      console.error('❌ Error en Gemini:', error);
      throw error;
    }
  }

  /**
   * Realiza una consulta con streaming (devuelve texto incremental)
   */
  async preguntarStream(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini no está inicializado');
    }

    try {
      const result = await this.model.generateContentStream(prompt);
      let texto = '';

      for await (const chunk of result.stream) {
        texto += chunk.text();
      }

      return texto;
    } catch (error: unknown) {
      console.error('❌ Error en Gemini Stream:', error);
      throw error;
    }
  }

  /**
   * Devuelve el nombre del modelo actual
   */
  obtenerModelo(): string {
    return this.MODEL_NAME;
  }
}
