import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NutritionService, UserData, NutritionResult } from './services/nutrition.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'nutriai-system';
  
  userData: UserData = {
    weight: 0,
    height: 0,
    bodyFat: 0,
    goal: 'weight_loss'
  };
  
  result: NutritionResult | null = null;
  loading = false;
  jsonData: any = null;
  
  constructor(private nutritionService: NutritionService) {}
  
  async analyzeNutrition() {
    if (!this.userData.weight || !this.userData.height || !this.userData.goal) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    this.loading = true;
    
    try {
      // Simula delay de processamento da IA
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      this.result = await this.nutritionService.analyzeNutrition(this.userData);
      
      // Prepara dados para JSON
      this.jsonData = {
        userData: this.userData,
        analysis: this.result?.analysis,
        diets: this.result?.diets,
        recommendations: this.result?.recommendations,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Erro na análise:', error);
      alert('Erro ao processar análise. Tente novamente.');
    } finally {
      this.loading = false;
    }
  }
  
  downloadJson() {
    if (!this.jsonData) return;
    
    const dataStr = JSON.stringify(this.jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `nutriai-analysis-${new Date().getTime()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}
