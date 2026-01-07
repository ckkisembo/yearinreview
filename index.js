import express from "express";
import fs from 'fs'; 
import path from 'path'; 
import sharp from "sharp";
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/easter", (req, res) => {
  res.render("easter.ejs", )
})

app.get("/spinning", (req, res) => {
  const baseDir = path.join(__dirname, "/public/images/spinning");

  const imageDir = path.join(baseDir, "images");
  const videoDir = path.join(baseDir, "videos");

  // Read files
  const imageFiles = fs.readdirSync(imageDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  const videoFiles = fs.readdirSync(videoDir);

  // Separate spin videos from spa video
  const spinVideos = videoFiles
    .filter(f => f.toLowerCase().includes("spin"))
    .map(filename => ({
      url: `/images/spinning/videos/${filename}`,
      alt: filename.split('.')[0].replace(/[-_]/g, ' '),
      type: "spin"
    }));

  const spaVideoFile = videoFiles.find(f =>
    f.toLowerCase().includes("steam") ||
    f.toLowerCase().includes("sauna") ||
    f.toLowerCase().includes("spa")
  );

  const spaVideo = spaVideoFile
    ? {
        url: `/images/spinning/videos/${spaVideoFile}`,
        alt: "steam and sauna",
        type: "spa"
      }
    : null;

  // Two photos
  const photos = imageFiles.map(filename => ({
    url: `/images/spinning/images/${filename}`,
    alt: filename.split('.')[0].replace(/[-_]/g, ' '),
    type: "photo"
  }));

  res.render("fitness.ejs", {
    spinVideos,
    photos,
    spaVideo
  });
});

app.get("/trip", async (req, res) => { 
    const imageDir = path.join(__dirname, '/public/images/jinja'); 
    const filenames = fs.readdirSync(imageDir); 
    const photos = await Promise.all( filenames.map(async filename => { 
        const filePath = path.join(imageDir, filename); 
        const { width, height } = await sharp(filePath).metadata(); 
        const orientation = height > width ? 'portrait' : 'landscape'; 

        return { 
            url: `/images/jinja/${filename}`, 
            alt: filename.split('.')[0].replace(/[-_]/g, ' '), 
            frameStyle: filename.includes('gold') ? 'gold' : 'black', orientation }; }) ); 
            const portraits = photos.filter(p => p.orientation === 'portrait'); 
            const landscapes = photos.filter(p => p.orientation === 'landscape'); 
            res.render('trip.ejs', { portraits, landscapes }); 
        }
    );

app.get("/christmas", (req, res) => {
  const baseDir = path.join(__dirname, "/public/images/christmas");

  const photoDir = path.join(baseDir, "images");
  const videoDir = path.join(baseDir, "videos");

  // Read files
  const photoFiles = fs.readdirSync(photoDir)
    .filter(f => f.match(/\.(jpg|jpeg|png)$/i));

  const videoFiles = fs.readdirSync(videoDir)
    .filter(f => f.match(/\.(mp4|mov|m4v)$/i));

  // --- Assign Photos ---

  // Invitation card
  const inviteCardFile = photoFiles.find(f =>
    f.toLowerCase().includes("invite") ||
    f.toLowerCase().includes("card")
  );

  const inviteCard = inviteCardFile ? {
    url: `/images/christmas/images/${inviteCardFile}`,
    type: "image"
  } : null;

  // Group photo
  const groupPhotoFile = photoFiles.find(f =>
    f.toLowerCase().includes("group")
  );

  const groupPhoto = groupPhotoFile ? {
    url: `/images/christmas/images/${groupPhotoFile}`,
    type: "image"
  } : null;

  // Cake photos
  const cakePhotos = photoFiles
    .filter(f => f.toLowerCase().includes("cake"))
    .map(f => ({
      url: `/images/christmas/images/${f}`,
      type: "image"
    }));

  // Gift sharing photos
  const giftPhotos = photoFiles
    .filter(f => f.toLowerCase().includes("gift"))
    .map(f => ({
      url: `/images/christmas/images/${f}`,
      type: "image"
    }));

  // --- Assign Videos ---

  // Carol videos (2)
  const carolVideos = videoFiles
    .filter(f => f.toLowerCase().includes("carol"))
    .map(f => ({
      url: `/images/christmas/videos/${f}`,
      type: "video"
    }));

  // Gratitude speech video
  const gratitudeFile = videoFiles.find(f =>
    f.toLowerCase().includes("gratitude") ||
    f.toLowerCase().includes("speech")
  );

  const gratitudeVideo = gratitudeFile ? {
    url: `/images/christmas/videos/${gratitudeFile}`,
    type: "video"
  } : null;

  // Render page
  res.render("christmas.ejs", {
    inviteCard,
    groupPhoto,
    cakePhotos,
    giftPhotos,
    carolVideos,
    gratitudeVideo
  });
});


app.get("/ahead", (req, res) => {    
    res.render("ahead.ejs");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})