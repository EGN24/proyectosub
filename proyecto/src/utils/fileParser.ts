import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedData {
  columns: string[];
  data: Array<{ [key: string]: any }>;
  rows: number;
}

export const parseCSV = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columns = results.meta.fields || [];
        const data = results.data as Array<{ [key: string]: any }>;
        
        resolve({
          columns,
          data,
          rows: data.length
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const parseJSON = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const jsonData = JSON.parse(text);
        
        // Asegurar que sea un array
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        if (dataArray.length === 0) {
          reject(new Error('El archivo JSON está vacío'));
          return;
        }

        const columns = Object.keys(dataArray[0]);
        
        resolve({
          columns,
          data: dataArray,
          rows: dataArray.length
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

export const parseExcel = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Tomar la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        
        if (jsonData.length === 0) {
          reject(new Error('La hoja de Excel está vacía'));
          return;
        }

        const columns = Object.keys(jsonData[0] as object);
        
        resolve({
          columns,
          data: jsonData as Array<{ [key: string]: any }>,
          rows: jsonData.length
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export const parseFile = async (file: File): Promise<ParsedData> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'csv':
      return parseCSV(file);
    case 'json':
      return parseJSON(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    default:
      throw new Error(`Formato de archivo no soportado: ${extension}`);
  }
};
