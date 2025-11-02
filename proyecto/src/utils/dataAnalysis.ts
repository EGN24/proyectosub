// Interface for generic data rows
interface DataRow {
  [key: string]: any;
}

export interface ColumnStatistics {
  name: string;
  type: 'numeric' | 'categorical' | 'text';
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  mode?: string | number;
  uniqueValues?: number;
  nullCount: number;
  distribution?: { label: string; value: number }[];
}

export const analyzeDataset = (data: DataRow[], columns: string[]): ColumnStatistics[] => {
  return columns.map(column => {
    const values = data.map(row => row[column]).filter(v => v !== null && v !== undefined && v !== '');
    const nullCount = data.length - values.length;
    
    // Determinar tipo de columna
    const isNumeric = values.every(v => !isNaN(Number(v)));
    
    if (isNumeric && values.length > 0) {
      const numericValues = values.map(v => Number(v));
      const sorted = [...numericValues].sort((a, b) => a - b);
      const sum = numericValues.reduce((a, b) => a + b, 0);
      
      return {
        name: column,
        type: 'numeric',
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean: sum / numericValues.length,
        median: sorted[Math.floor(sorted.length / 2)],
        uniqueValues: new Set(numericValues).size,
        nullCount
      };
    } else {
      // Columna categórica
      const frequency = new Map<string, number>();
      values.forEach(v => {
        const key = String(v);
        frequency.set(key, (frequency.get(key) || 0) + 1);
      });
      
      // Top 5 categorías para el gráfico
      const distribution = Array.from(frequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }));
      
      const mode = Array.from(frequency.entries()).reduce((a, b) => a[1] > b[1] ? a : b)?.[0];
      
      return {
        name: column,
        type: values.length < 50 ? 'categorical' : 'text',
        mode,
        uniqueValues: frequency.size,
        nullCount,
        distribution
      };
    }
  });
};

export const getNumericColumns = (stats: ColumnStatistics[]): ColumnStatistics[] => {
  return stats.filter(s => s.type === 'numeric');
};

export const getCategoricalColumns = (stats: ColumnStatistics[]): ColumnStatistics[] => {
  return stats.filter(s => s.type === 'categorical' && s.distribution);
};

export const generateCorrelationData = (data: DataRow[], numericColumns: string[]): any[] => {
  if (numericColumns.length < 2) return [];
  
  // Tomar las primeras 2 columnas numéricas para correlación
  const col1 = numericColumns[0];
  const col2 = numericColumns[1];
  
  return data.slice(0, 100).map(row => ({
    [col1]: Number(row[col1]),
    [col2]: Number(row[col2])
  })).filter(item => !isNaN(item[col1]) && !isNaN(item[col2]));
};
