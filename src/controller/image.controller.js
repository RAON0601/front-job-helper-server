import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';

export class ImageController {
  constructor(imageUploader) {
    this.imageUploader = imageUploader;
    this.router = Router();
    this.path = '/api/images';
    this.initRoute();
  }

  initRoute() {
    const router = Router();

    router.post('/upload', auth, this.imageUploader.instance.single('image'), (req, res) => {
      res.json({
        status: 'SUCCESS',
        url: req.file.location,
      });
    });

    this.router.use(this.path, router);
  }
}
