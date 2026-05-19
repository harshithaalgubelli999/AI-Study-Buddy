// This makes pdfjsLib available in the scope
declare const pdfjsLib: any;

export const readTextFromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) {
          return reject(new Error("Failed to read PDF file."));
        }
        try {
          const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
          let textContent = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map((s: any) => s.str).join(' ') + '\n';
          }
          resolve(textContent);
        } catch (error) {
          reject(new Error("Could not parse the PDF file."));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file."));
      reader.readAsArrayBuffer(file);
    } else if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read text file."));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file."));
      reader.readAsText(file);
    } else {
      reject(new Error("Unsupported file type. Please upload a PDF or a plain text file."));
    }
  });
};
