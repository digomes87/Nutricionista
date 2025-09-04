ferramentas:
     angular
     typescript
     node
     express
     sequelize


# Sistema de Nutrição Saudável - Angular

Vou criar um sistema completo de nutrição saudável em Angular que simula a interação com uma IA (no caso, o DeepSeek) para gerar planos alimentares personalizados.

## Funcionalidades:
- Coleta de dados do usuário (peso, gordura corporal, altura, objetivo)
- Geração de 3 opções de dieta personalizadas
- Armazenamento dos resultados em JSON
- Interface amigável e responsiva

Abaixo está o código completo da aplicação:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutriAI - Sistema de Nutrição Saudável</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
    <style>
        :root {
            --primary: #4CAF50;
            --secondary: #2196F3;
            --accent: #FF9800;
            --light: #F5F5F5;
            --dark: #333;
        }
        
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f8f9fa;
            color: #333;
            padding-top: 20px;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .card {
            border-radius: 12px;
            box-shadow: 0 6px 15px rgba(0,0,0,0.08);
            margin-bottom: 25px;
            border: none;
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-header {
            background: linear-gradient(135deg, var(--secondary), var(--primary));
            color: white;
            border-radius: 12px 12px 0 0 !important;
            padding: 15px 20px;
            font-weight: 500;
        }
        
        .form-label {
            font-weight: 500;
            color: var(--dark);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border: none;
            padding: 12px 25px;
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.3s;
        }
        
        .btn-primary:hover {
            transform: scale(1.03);
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        
        .diet-option {
            border-left: 4px solid var(--accent);
            padding-left: 15px;
            margin-bottom: 20px;
        }
        
        .diet-title {
            color: var(--secondary);
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .result-container {
            background-color: var(--light);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        
        .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--primary);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .json-view {
            background-color: #2d2d2d;
            color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            max-height: 300px;
            overflow-y: auto;
        }
    </style>
</head>
<body ng-app="nutritionApp" ng-controller="NutritionController as vm">
    <div class="container">
        <div class="header">
            <h1>NutriAI</h1>
            <p class="lead">Sistema de Nutrição Saudável com IA</p>
            <p>Obtenha um plano alimentar personalizado baseado em suas informações</p>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h3 class="mb-0">Suas Informações</h3>
                    </div>
                    <div class="card-body">
                        <form ng-submit="vm.analyzeNutrition()">
                            <div class="mb-3">
                                <label for="weight" class="form-label">Peso (kg)</label>
                                <input type="number" class="form-control" id="weight" ng-model="vm.userData.weight" required min="30" max="200">
                            </div>
                            
                            <div class="mb-3">
                                <label for="bodyFat" class="form-label">Gordura Corporal (%)</label>
                                <input type="number" class="form-control" id="bodyFat" ng-model="vm.userData.bodyFat" min="5" max="50">
                                <div class="form-text">Opcional - se não souber, deixe em branco</div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="height" class="form-label">Altura (cm)</label>
                                <input type="number" class="form-control" id="height" ng-model="vm.userData.height" required min="100" max="250">
                            </div>
                            
                            <div class="mb-3">
                                <label for="goal" class="form-label">Objetivo</label>
                                <select class="form-select" id="goal" ng-model="vm.userData.goal" required>
                                    <option value="">Selecione seu objetivo</option>
                                    <option value="weight_loss">Perder peso</option>
                                    <option value="muscle_gain">Ganhar massa muscular</option>
                                    <option value="maintenance">Manter peso</option>
                                    <option value="health_improvement">Melhorar saúde</option>
                                </select>
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-100" ng-disabled="vm.loading">
                                <span ng-if="!vm.loading">Analisar e Gerar Dieta</span>
                                <span ng-if="vm.loading">Processando...</span>
                            </button>
                        </form>
                    </div>
                </div>
                
                <div class="card" ng-if="vm.result">
                    <div class="card-header">
                        <h3 class="mb-0">Dados Armazenados (JSON)</h3>
                    </div>
                    <div class="card-body">
                        <p>Seus dados e plano alimentar foram armazenados com sucesso!</p>
                        <div class="json-view">
                            {{ vm.jsonData | json }}
                        </div>
                        <button class="btn btn-outline-primary mt-3" ng-click="vm.downloadJson()">
                            Download JSON
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card" ng-if="vm.loading">
                    <div class="card-header">
                        <h3 class="mb-0">Processando</h3>
                    </div>
                    <div class="card-body text-center">
                        <p>Analisando suas informações e gerando planos alimentares personalizados...</p>
                        <div class="loader"></div>
                        <p class="mt-2">Isso pode levar alguns segundos</p>
                    </div>
                </div>
                
                <div class="card" ng-if="vm.result && !vm.loading">
                    <div class="card-header">
                        <h3 class="mb-0">Resultado da Análise</h3>
                    </div>
                    <div class="card-body">
                        <div class="result-container">
                            <h4>Análise Inicial</h4>
                            <p><strong>IMC:</strong> {{ vm.result.analysis.imc }} ({{ vm.result.analysis.imcClassification }})</p>
                            <p><strong>Taxa Metabólica Basal (TMB):</strong> {{ vm.result.analysis.tmb }} calorias</p>
                            <p><strong>Gasto Calórico Diário:</strong> {{ vm.result.analysis.dailyCaloricNeeds }} calorias</p>
                        </div>
                        
                        <h4 class="mt-4">Opções de Dieta</h4>
                        <p>Com base nas suas informações, geramos 3 opções de planos alimentares:</p>
                        
                        <div ng-repeat="diet in vm.result.diets" class="diet-option">
                            <h5 class="diet-title">{{ diet.name }}</h5>
                            <p><strong>Café da manhã:</strong> {{ diet.meals.breakfast }}</p>
                            <p><strong>Almoço:</strong> {{ diet.meals.lunch }}</p>
                            <p><strong>Jantar:</strong> {{ diet.meals.dinner }}</p>
                            <p><strong>Lanches:</strong> {{ diet.meals.snacks }}</p>
                        </div>
                        
                        <div class="result-container mt-3">
                            <h4>Recomendações Gerais</h4>
                            <p>{{ vm.result.recommendations }}</p>
                        </div>
                    </div>
                </div>
                
                <div class="card" ng-if="!vm.result && !vm.loading">
                    <div class="card-header">
                        <h3 class="mb-0">Como Funciona</h3>
                    </div>
                    <div class="card-body">
                        <p>O NutriAI analisa suas informações físicas e objetivos para criar um plano alimentar personalizado.</p>
                        <ol>
                            <li>Preencha seus dados no formulário ao lado</li>
                            <li>Clique em "Analisar e Gerar Dieta"</li>
                            <li>Receba 3 opções de planos alimentares</li>
                            <li>Os resultados serão armazenados em JSON para referência futura</li>
                        </ol>
                        <p>Nosso sistema simula a análise de uma IA avançada para fornecer recomendações nutricionais adequadas ao seu perfil.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>NutriAI - Sistema de Nutrição Saudável | Simulação de IA com Angular</p>
            <p>© 2023 - Todos os direitos reservados</p>
        </div>
    </div>

    <script>
        angular.module('nutritionApp', [])
        .controller('NutritionController', function() {
            var vm = this;
            
            // Inicializar dados do usuário
            vm.userData = {
                weight: 70,
                bodyFat: 20,
                height: 175,
                goal: 'weight_loss'
            };
            
            vm.loading = false;
            vm.result = null;
            vm.jsonData = null;
            
            // Função para analisar os dados e gerar a dieta
            vm.analyzeNutrition = function() {
                vm.loading = true;
                vm.result = null;
                
                // Simular processamento da IA (em um caso real, seria uma requisição HTTP)
                setTimeout(function() {
                    // Calcular IMC
                    var heightInMeters = vm.userData.height / 100;
                    var imc = vm.userData.weight / (heightInMeters * heightInMeters);
                    
                    // Classificar IMC
                    var imcClassification = '';
                    if (imc < 18.5) {
                        imcClassification = 'Abaixo do peso';
                    } else if (imc < 25) {
                        imcClassification = 'Peso normal';
                    } else if (imc < 30) {
                        imcClassification = 'Sobrepeso';
                    } else {
                        imcClassification = 'Obesidade';
                    }
                    
                    // Calcular TMB (Taxa Metabólica Basal) - Fórmula de Mifflin-St Jeor
                    var tmb = 10 * vm.userData.weight + 6.25 * vm.userData.height - 5 * 30 + 5; // 30 é idade estimada, 5 é constante para homens
                    
                    // Ajustar TMB com base no objetivo
                    var dailyCaloricNeeds;
                    switch(vm.userData.goal) {
                        case 'weight_loss':
                            dailyCaloricNeeds = tmb * 1.2 - 500; // Déficit calórico
                            break;
                        case 'muscle_gain':
                            dailyCaloricNeeds = tmb * 1.4 + 300; // Superávit calórico
                            break;
                        case 'maintenance':
                            dailyCaloricNeeds = tmb * 1.3; // Manutenção
                            break;
                        case 'health_improvement':
                            dailyCaloricNeeds = tmb * 1.35; // Leve superávit
                            break;
                        default:
                            dailyCaloricNeeds = tmb * 1.3;
                    }
                    
                    // Gerar dietas baseadas no objetivo
                    var diets = generateDiets(vm.userData.goal);
                    
                    // Gerar recomendações
                    var recommendations = generateRecommendations(vm.userData.goal, imcClassification);
                    
                    // Criar resultado
                    vm.result = {
                        analysis: {
                            imc: imc.toFixed(2),
                            imcClassification: imcClassification,
                            tmb: Math.round(tmb),
                            dailyCaloricNeeds: Math.round(dailyCaloricNeeds)
                        },
                        diets: diets,
                        recommendations: recommendations
                    };
                    
                    // Criar JSON para armazenamento
                    vm.jsonData = {
                        userData: angular.copy(vm.userData),
                        generatedAt: new Date().toISOString(),
                        result: vm.result
                    };
                    
                    vm.loading = false;
                }, 2000); // Simular 2 segundos de processamento
            };
            
            // Função para gerar dietas baseadas no objetivo
            function generateDiets(goal) {
                var diets = [];
                
                switch(goal) {
                    case 'weight_loss':
                        diets = [
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
                        break;
                    
                    case 'muscle_gain':
                        diets = [
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
                        break;
                    
                    default:
                        diets = [
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
                
                return diets;
            }
            
            // Função para gerar recomendações
            function generateRecommendations(goal, imcClassification) {
                var recommendations = "";
                
                switch(goal) {
                    case 'weight_loss':
                        recommendations = "Para perder peso de forma saudável, recomendamos um déficit calórico de aproximadamente 500 calorias por dia. Mantenha-se hidratado, priorize proteínas magras e fibras, e pratique exercícios físicos regularmente. Evite alimentos ultraprocessados e bebidas açucaradas.";
                        break;
                    
                    case 'muscle_gain':
                        recommendations = "Para ganho de massa muscular, é importante consumir proteínas em todas as refeições e manter um superávit calórico moderado. Combine sua dieta com treinamento de força adequado e descanse o suficiente para permitir a recuperação muscular.";
                        break;
                    
                    case 'maintenance':
                        recommendations = "Para manter seu peso atual, foque em uma alimentação balanceada e na prática regular de atividade física. Monitore seu peso regularmente e faça ajustes conforme necessário. Inclua variedade de alimentos para garantir todos os nutrientes necessários.";
                        break;
                    
                    case 'health_improvement':
                        recommendations = "Para melhorar sua saúde geral, priorize alimentos integrais, frutas, legumes e verduras. Reduza o consumo de alimentos processados, açúcar e gordura saturada. Mantenha-se ativo e hidratado, e considere gerenciar o estresse com técnicas como meditação.";
                        break;
                    
                    default:
                        recommendations = "Mantenha uma alimentação balanceada com variedade de nutrientes. Hidrate-se adequadamente e pratique atividades físicas regularmente. Consulte um nutricionista para orientações personalizadas.";
                }
                
                return recommendations;
            }
            
            // Função para download do JSON
            vm.downloadJson = function() {
                if (!vm.jsonData) return;
                
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vm.jsonData, null, 2));
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "plano_nutricional.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            };
        });
    </script>
</body>
</html>
```

## Como usar:

1. Preencha os dados solicitados (peso, gordura corporal, altura e objetivo)
2. Clique em "Analisar e Gerar Dieta"
3. O sistema simulará o processamento da IA e exibirá três opções de dieta
4. Os resultados serão armazenados em formato JSON, que pode ser visualizado e baixado

## Funcionalidades implementadas:

- Interface amigável e responsiva com AngularJS
- Coleta de dados do usuário com validação
- Simulação de processamento por IA (com delay de 2 segundos)
- Geração de 3 opções de dieta baseadas no objetivo
- Cálculo de IMC e necessidades calóricas
- Armazenamento dos resultados em JSON
- Opção para download do JSON gerado

Este sistema é uma simulação que funciona completamente no navegador, sem necessidade de backend ou API.