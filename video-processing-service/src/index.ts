import express, { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Video Processing Service is up and running!');
});

app.post('/process-video', (req: Request, res: Response): void => {
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    res.status(400).send('Bad Request: Missing file path');
    return;
  }

  ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360') // 360p
    .on('end', () => {
      console.log('Processing finished successfully');
      res.status(200).send('Processing finished successfully');
    })
    .on('error', (err: any) => {
      console.error('An error occurred:', err.message);
      res.status(500).send('An error occurred: ' + err.message);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
