let finalJson;

function handleFiles() {
    const files = document.getElementById('fileInput').files;
    const result = {
        "Name": "nombre general",
        "abbreviation": "NGR",
        "copyright": "public domain",
        "books": [],
        "scriptures": []
    };
    // Función para calcular el hash SHA-256
    function calculateHash(text) {
        return CryptoJS.SHA256(text).toString();
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(event) {
            const text = event.target.result;
            const lines = text.split('\n');
            let currentBookId = result.books.length + 1;

            for (let j = 0; j < lines.length; j++) {
                const line = lines[j].trim();

                if (line.startsWith("Subtitulo")) {
                    result.books.push({
                        "id": currentBookId,
                        "name": line
                    });
                } else if (line !== "") {
                    const [chapter, verse, text] = line.split('.');
                    const hash = calculateHash(text); // Calcula el hash
                    result.scriptures.push({
                        "id": result.scriptures.length + 1,
                        "bookId": currentBookId,
                        "chapter": parseInt(chapter),
                        "verse": parseInt(verse),
                        "text": text,
                        "hash": hash // Calcula el hash aquí si es necesario
                    });
                }
            }
        };

        reader.readAsText(file);
        
        finalJson = result;

        console.log(JSON.stringify(result, null, 2)); // Muestra el resultado en la consola
    }
}
function downloadJSON() {
  result = finalJson
  if (!result) {
    console.error("No hay resultado para descargar.");
    return;
  }

  const resultJSON = JSON.stringify(result, null, 2);
  const filename = result.Name.toLowerCase().replace(/\s/g, '-') + '.js';
  const fileContent = `ObsBiblePlugin.importBible(${resultJSON});`;

  // Crear y descargar el archivo
  const blob = new Blob([fileContent], { type: 'text/javascript' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}