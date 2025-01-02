import { Router } from 'express';
import { create } from '@auth/controller/signup';
import { imageUploadMiddleware } from '@auth/middleware/uploadImage.middleware';
import { forgotPassword, read, update, resetPassword, changePassword, getCurrentUser, resendEmail } from '@auth/controller/signin';
const router: Router = Router();

export function authRoutes(): Router {
  router.post('/signup', imageUploadMiddleware, create);
  router.post('/signin', read);
  router.patch('/verify-email', update);
  router.patch('/forgot-password', forgotPassword);
  router.patch('/reset-password/:token', resetPassword);
  router.patch('/change-password', changePassword);
  router.get('/current-user', getCurrentUser);
  router.get('/resend-email', resendEmail);
  // /api/auth/v1
  return router;
}
