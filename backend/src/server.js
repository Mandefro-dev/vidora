// import express from "express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = 5000;

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "/assets/index.html"));
// });

// app.get("/video", (req, res) => {
//   const filePath = path.join(__dirname, "..", "/assets/sample1.mp4"); //get path of the file
//   const range = req.headers.range; //partial content request, when the player starts it asks for a bit of the file in a bit not the whole file.

//   const fileSize = fs.statSync(filePath).size; //reading the stats of the file in bytes,for production use async

//   const chunkSize = 1 * 1e6; //buffering, sending the video in 1MB chunks if too low, the browser have to send many requests, if too much user waits forever,1mb IS FAST ENOUGH
//   const start = Number(range.replace(/\D/g, ""));
//   // replacinf that isn't a number to empty strng in the range header.then convert the string number to number.

//   const end = Math.min(start + chunkSize, fileSize - 1); //sending a chunk from start +1MB.  if the the video is 10.5MB, it reads(10-11) so we try to read  data tht doesn't exist.  so we use Math.min to pick the smaller of the two numbers Math(10+1,10.5), so it choose 10.5 .. why fileSize-1, compute countsfrom 0, so THE LAST byte fileSize-1

//   const contentLength = end - start + 1;
//   //the content we send in bytes for speciic packet(end -start +1), why +1, cause the, we read 10-12,  10,11,12 means 3 bytes, so 12-10=2 doesn't match so we add one.
//   const headers = {
//     //tellig the browser what we are sending..
//     "Content-Range": `bytes ${start}-${end}/${fileSize}`, //here is the byte and the total file is this. for grey buffred bar on the video player.

//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };
//   res.writeHead(206, headers);
//   // const head = {
//   //   "Content-length": fileSize,
//   //   "Content-Type": "video/mp4",
//   // };
//   // res.writeHead(200, head);
//   //200 ok, thewhole file
//   //206 ,partial content

//   const stream = fs.createReadStream(filePath, { start, end }); //readin the 1MB file into memory... if it is fs.readFIle(it read the whole file into RAM memory) if 1000users watch 1GB video at the same time usinf readFIe u need 1000GB ram.. server crash but in this 1000users=1GB
//   //   //we pass START ADN END in this to tell fs to only slice out that specif piece of video.
//   stream.pipe(res); //backpressure and piping
//   //   //pipe handles seed diffrence automativally  for slow and fast internet,
//   // });
//   // const readStream = fs.createReadStream(filePath);
//   // readStream.pipe(res);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
