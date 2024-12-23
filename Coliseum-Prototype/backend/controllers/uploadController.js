const supabase = require('../supabaseClient');
require('dotenv').config();

// Function to handle image upload
async function uploadImage(req, res) {
    try {

        // log the incoming request headers and body
        console.log('Headers:', req.headers);
        console.log('Body length:', req.body.length);

        // extract the file name from the headers
        const fileName = req.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
        console.log('filename', fileName);

        const { data, error } = await supabase.storage
            .from('profile-images')
            .upload(`public/${Date.now()}_${fileName}`, req.body);
    
        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        console.log('data', data);
    
        /*
        // construct the image URL
        const imageUrl = supabase.storage
        .from('profile-images')
        .getPublicUrl(data.path).data.publicUrl;
        */
        console.log('imageUrl', data.path);
        res.json({ imageUrl: data.path });
    } catch (error) {
        console.log('Error during image upload:', error);
        res.status(500).json({ error: error });
    }

}

async function getTempLink(req, res){
    const { path } = req.query;

    try{
        const {data: tempUrl, error} = await supabase.storage
        .from('profile-images')
        .createSignedUrl(path, 300);
        console.log('tempUrl', tempUrl);
        res.status(200).json({ tempUrl });
    }
    catch(error){
        console.log('Error during image fetch:', error);
        res.status(500).json({ error: error });
    }
}

module.exports = { uploadImage, getTempLink };