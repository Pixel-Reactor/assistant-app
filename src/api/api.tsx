import { offlineMode } from '@/env';
import procedure from '@/mock-data/procedure.json';
import { ProcedureModel } from '@/models/ProcedureModel';



//TODO use axios instead of fetch
const getProcedure = async (src: string) => {
    if (offlineMode) {
        return procedure as ProcedureModel;
    } else {
        try {
            // Fetch the image file from the src
            const response = await fetch(src);
            const blob = await response.blob();

            // Create a new FormData object and append the image
            const form = new FormData();
            const mimeType = blob.type; // Get the MIME type of the image
            const fileName = src.split('/').pop() || 'image'; // Extract file name from src

              // Append the image with the correct MIME type and file name
              form.append('image', new Blob([blob], { type: mimeType }), fileName);

            // Send the request with the form data
            const uploadResponse = await fetch('http://52.86.38.208/image-to-text/', {
                method: 'POST',
                body: form,
            });

            // Check the response status
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            return await uploadResponse.json(); // Return the response as JSON
        } catch (error) {
            console.error('Error fetching procedure', error);
            return null;
        }
    }
};


export {
    getProcedure
};

