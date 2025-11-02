// Configuración base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Tipos de datos
export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  user_id: string;
  status: 'active' | 'completed' | 'error';
}

export interface Dataset {
  id: string;
  project_id: string;
  filename: string;
  size: number;
  rows: number;
  columns: number;
  uploaded_at: string;
}

export interface CleaningOptions {
  missingValues: string;
  normalization: string;
  encoding: string;
  removeOutliers: boolean;
}

export interface ModelConfig {
  modelType: string;
  testSize: number;
  randomState: number;
  epochs?: number;
  learningRate?: number;
}

// Funciones de API
export const api = {
  // Proyectos
  getProjects: async (): Promise<Project[]> => {
    // Aquí conectarás con tu backend
    // const response = await fetch(`${API_URL}/projects`);
    // return response.json();
    
    // Datos simulados por ahora
    return [
      {
        id: '1',
        name: 'Proyecto Demo',
        description: 'Dataset de prueba',
        created_at: new Date().toISOString(),
        user_id: '1',
        status: 'active'
      }
    ];
  },

  createProject: async (name: string, description: string): Promise<Project> => {
    // const response = await fetch(`${API_URL}/projects`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, description })
    // });
    // return response.json();
    
    return {
      id: Date.now().toString(),
      name,
      description,
      created_at: new Date().toISOString(),
      user_id: '1',
      status: 'active'
    };
  },

  // Datasets
  uploadDataset: async (file: File, projectId: string): Promise<Dataset> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);

    // const response = await fetch(`${API_URL}/datasets/upload`, {
    //   method: 'POST',
    //   body: formData
    // });
    // return response.json();

    return {
      id: Date.now().toString(),
      project_id: projectId,
      filename: file.name,
      size: file.size,
      rows: 1000,
      columns: 10,
      uploaded_at: new Date().toISOString()
    };
  },

  // Limpieza de datos
  cleanData: async (datasetId: string, options: CleaningOptions) => {
    // const response = await fetch(`${API_URL}/datasets/${datasetId}/clean`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(options)
    // });
    // return response.json();

    return { success: true, cleaned_dataset_id: datasetId };
  },

  // Entrenamiento
  trainModel: async (datasetId: string, config: ModelConfig) => {
    // const response = await fetch(`${API_URL}/train`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ dataset_id: datasetId, ...config })
    // });
    // return response.json();

    return {
      model_id: Date.now().toString(),
      status: 'training',
      progress: 0
    };
  },

  // Resultados
  getResults: async (modelId: string) => {
    // const response = await fetch(`${API_URL}/results/${modelId}`);
    // return response.json();

    return {
      accuracy: 0.89,
      precision: 0.87,
      recall: 0.86,
      f1_score: 0.86,
      training_history: [
        { epoch: 1, accuracy: 65, loss: 0.89 },
        { epoch: 2, accuracy: 72, loss: 0.67 },
        { epoch: 3, accuracy: 78, loss: 0.54 },
        { epoch: 4, accuracy: 82, loss: 0.43 },
        { epoch: 5, accuracy: 85, loss: 0.35 },
        { epoch: 6, accuracy: 87, loss: 0.29 },
        { epoch: 7, accuracy: 88, loss: 0.25 },
        { epoch: 8, accuracy: 89, loss: 0.22 },
      ]
    };
  }
};
