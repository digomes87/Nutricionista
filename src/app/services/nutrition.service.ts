import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface UserData {
  weight: number;
  bodyFat?: number;
  height: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health_improvement';
}

export interface DietPlan {
  name: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
}

export interface NutritionAnalysis {
  imc: string;
  imcClassification: string;
  tmb: number;
  dailyCaloricNeeds: number;
}

export interface NutritionResult {
  analysis: NutritionAnalysis;
  diets: DietPlan[];
  recommendations: string;
}

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  private readonly DEEPSEEK_API_URL = environment.deepseekApiUrl;
  private readonly API_KEY = environment.deepseekApiKey;

  constructor(private http: HttpClient) { }

  calculateIMC(weight: number, height: number): { imc: number; classification: string } {
    const heightInMeters = height / 100;
    const imc = weight / (heightInMeters * heightInMeters);
    
    let classification = '';
    if (imc < 18.5) {
      classification = 'Abaixo do peso';
    } else if (imc < 25) {
      classification = 'Peso normal';
    } else if (imc < 30) {
      classification = 'Sobrepeso';
    } else {
      classification = 'Obesidade';
    }
    
    return { imc, classification };
  }

  calculateTMB(weight: number, height: number, age: number = 30): number {
    // Fórmula de Mifflin-St Jeor para homens (simplificada)
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }

  calculateDailyCaloricNeeds(tmb: number, goal: string): number {
    switch(goal) {
      case 'weight_loss':
        return tmb * 1.2 - 500; // Déficit calórico
      case 'muscle_gain':
        return tmb * 1.4 + 300; // Superávit calórico
      case 'maintenance':
        return tmb * 1.3; // Manutenção
      case 'health_improvement':
        return tmb * 1.35; // Leve superávit
      default:
        return tmb * 1.3;
    }
  }

  generateDiets(goal: string): DietPlan[] {
    switch(goal) {
      case 'weight_loss':
        return [
          {
            name: "Dieta Low Carb",
            meals: {
              breakfast: "Omelete de 2 ovos com espinafre e queijo cottage + 1 xícara de chá verde",
              lunch: "Salada de folhas verdes com 150g de frango grelhado + legumes cozidos",
              dinner: "Salmão assado com aspargos e brócolis no vapor",
              snacks: "1 maçã + 10 amêndoas | Iogurte natural com sementes de chia"
            }
          },
          {
            name: "Dieta Mediterrânea",
            meals: {
              breakfast: "Iogurte natural com aveia, nozes e frutas vermelhas",
              lunch: "100g de macarrão integral com atum, tomate cereja e azeitonas + salada verde",
              dinner: "Sopa de legumes com grão-de-bico e uma fatia de pão integral",
              snacks: "Hummus com palitos de cenoura | Queijo branco com mel"
            }
          },
          {
            name: "Dieta Equilibrada",
            meals: {
              breakfast: "2 fatias de pão integral com abacate e ovo poché + suco verde",
              lunch: "Arroz integral, feijão, filé de frango grelhado e salada de folhas",
              dinner: "Omelete de claras com quinoa e legumes salteados",
              snacks: "Iogurte natural | Mix de castanhas"
            }
          }
        ];
      
      case 'muscle_gain':
        return [
          {
            name: "Dieta Hiperproteica",
            meals: {
              breakfast: "3 ovos mexidos com aveia + 1 banana + whey protein",
              lunch: "200g de carne magra + batata-doce + feijão + salada",
              dinner: "200g de peixe + quinoa + legumes assados",
              snacks: "Shake proteico | Frango desfiado com abacate"
            }
          },
          {
            name: "Dieta de Volume",
            meals: {
              breakfast: "Panquecas de aveia com ovos e banana + mel",
              lunch: "Massa integral com frango e molho de tomate natural + salada",
              dinner: "Omelete com 4 claras, queijo e legumes + arroz integral",
              snacks: "Pasta de amendoim com pão integral | Barras proteicas caseiras"
            }
          },
          {
            name: "Dieta para Definição",
            meals: {
              breakfast: "Omelete de 3 ovos com espinafre + abacate + torradas integrais",
              lunch: "Arroz integral, lentilha, frango grelhado e brócolis",
              dinner: "Filé de tilápia + purê de batata-doce + salada verde",
              snacks: "Iogurte grego com granola | Shake de whey protein"
            }
          }
        ];
      
      default:
        return [
          {
            name: "Dieta Balanceada",
            meals: {
              breakfast: "2 ovos cozidos + 1 fatia de pão integral + 1 fruta",
              lunch: "Arroz integral, feijão, filé de frango e salada",
              dinner: "Sopa de legumes com frango desfiado",
              snacks: "Iogurte natural | Mix de castanhas"
            }
          },
          {
            name: "Dieta Vegetariana",
            meals: {
              breakfast: "Smoothie de banana, aveia e leite vegetal",
              lunch: "Quinoa com grão-de-bico, abobrinha e tomate + salada",
              dinner: "Lentilha com arroz integral e legumes refogados",
              snacks: "Hummus com palitos de legumes | Frutas secas"
            }
          },
          {
            name: "Dieta Low Carb",
            meals: {
              breakfast: "Omelete de 2 ovos com espinafre e queijo cottage",
              lunch: "Salada de folhas com 150g de frango grelhado + abacate",
              dinner: "Salmão assado com aspargos e brócolis",
              snacks: "1 maçã + 10 amêndoas | Iogurte natural com chia"
            }
          }
        ];
    }
  }

  generateRecommendations(goal: string): string {
    switch(goal) {
      case 'weight_loss':
        return "Para perder peso de forma saudável, recomendamos um déficit calórico de aproximadamente 500 calorias por dia. Mantenha-se hidratado, priorize proteínas magras e fibras, e pratique exercícios físicos regularmente. Evite alimentos ultraprocessados e bebidas açucaradas.";
      
      case 'muscle_gain':
        return "Para ganho de massa muscular, é importante consumir proteínas em todas as refeições e manter um superávit calórico moderado. Combine sua dieta com treinamento de força adequado e descanse o suficiente para permitir a recuperação muscular.";
      
      case 'maintenance':
        return "Para manter seu peso atual, foque em uma alimentação balanceada e na prática regular de atividade física. Monitore seu peso regularmente e faça ajustes conforme necessário. Inclua variedade de alimentos para garantir todos os nutrientes necessários.";
      
      case 'health_improvement':
        return "Para melhorar sua saúde geral, priorize alimentos integrais, frutas, legumes e verduras. Reduza o consumo de alimentos processados, açúcar e gordura saturada. Mantenha-se ativo e hidratado, e considere gerenciar o estresse com técnicas como meditação.";
      
      default:
        return "Mantenha uma alimentação balanceada com variedade de nutrientes. Hidrate-se adequadamente e pratique atividades físicas regularmente. Consulte um nutricionista para orientações personalizadas.";
    }
  }

  async analyzeNutrition(userData: UserData): Promise<NutritionResult> {
    try {
      // Calculate basic metrics
      const { imc, classification } = this.calculateIMC(userData.weight, userData.height);
      const tmb = this.calculateTMB(userData.weight, userData.height);
      const dailyCaloricNeeds = this.calculateDailyCaloricNeeds(tmb, userData.goal);
      
      const analysis: NutritionAnalysis = {
        imc: imc.toFixed(2),
        imcClassification: classification,
        tmb: Math.round(tmb),
        dailyCaloricNeeds: Math.round(dailyCaloricNeeds)
      };

      // Prepare prompt for DeepSeek AI
      const prompt = this.createNutritionPrompt(userData, analysis);
      
      // Get AI-powered recommendations and diet plans
      const aiResponse = await this.callDeepSeekAPI(prompt);
      const parsedResponse = this.parseAIResponse(aiResponse);
      
      return {
        analysis,
        diets: parsedResponse.diets || this.generateDiets(userData.goal), // Fallback to local generation
        recommendations: parsedResponse.recommendations || this.generateRecommendations(userData.goal)
      };
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      // Fallback to local generation if API fails
      return this.generateLocalAnalysis(userData);
    }
  }

  private createNutritionPrompt(userData: UserData, analysis: NutritionAnalysis): string {
    return `Como nutricionista especializado, analise os seguintes dados do paciente e forneça recomendações personalizadas:

Dados do Paciente:
- Peso: ${userData.weight}kg
- Altura: ${userData.height}cm
- Gordura corporal: ${userData.bodyFat || 'Não informado'}%
- Objetivo: ${this.translateGoal(userData.goal)}

Análise Calculada:
- IMC: ${analysis.imc} (${analysis.imcClassification})
- Taxa Metabólica Basal: ${analysis.tmb} kcal/dia
- Necessidades Calóricas Diárias: ${analysis.dailyCaloricNeeds} kcal/dia

Por favor, forneça:
1. Recomendações nutricionais específicas e personalizadas
2. 3 planos alimentares detalhados (café da manhã, almoço, jantar e lanches)

Formato de resposta em JSON:
{
  "recommendations": "suas recomendações detalhadas aqui",
  "diets": [
    {
      "name": "Nome do Plano 1",
      "meals": {
        "breakfast": "descrição detalhada",
        "lunch": "descrição detalhada",
        "dinner": "descrição detalhada",
        "snacks": "descrição detalhada"
      }
    }
  ]
}`;
  }

  private async callDeepSeekAPI(prompt: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.API_KEY}`
    });

    const body = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista especializado com vasta experiência em planejamento alimentar personalizado. Forneça sempre respostas em português brasileiro.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    };

    const response = await this.http.post<any>(this.DEEPSEEK_API_URL, body, { headers }).toPromise();
    return response.choices[0].message.content;
  }

  private parseAIResponse(response: string): { recommendations: string; diets: DietPlan[] } {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          recommendations: parsed.recommendations || '',
          diets: parsed.diets || []
        };
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }
    
    // If JSON parsing fails, return the raw response as recommendations
    return {
      recommendations: response,
      diets: []
    };
  }

  private generateLocalAnalysis(userData: UserData): NutritionResult {
    const { imc, classification } = this.calculateIMC(userData.weight, userData.height);
    const tmb = this.calculateTMB(userData.weight, userData.height);
    const dailyCaloricNeeds = this.calculateDailyCaloricNeeds(tmb, userData.goal);
    
    const analysis: NutritionAnalysis = {
      imc: imc.toFixed(2),
      imcClassification: classification,
      tmb: Math.round(tmb),
      dailyCaloricNeeds: Math.round(dailyCaloricNeeds)
    };
    
    return {
      analysis,
      diets: this.generateDiets(userData.goal),
      recommendations: this.generateRecommendations(userData.goal) + '\n\n⚠️ Nota: Usando análise local devido a erro na API de IA.'
    };
  }

  private translateGoal(goal: string): string {
    const translations: { [key: string]: string } = {
      'weight_loss': 'Perda de peso',
      'muscle_gain': 'Ganho de massa muscular',
      'maintenance': 'Manutenção do peso',
      'health_improvement': 'Melhoria da saúde'
    };
    return translations[goal] || goal;
  }
}
