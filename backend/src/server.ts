import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// ============ MIDDLEWARE ============
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============ ROUTES ============
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Library Management System API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      users: '/api/users',
      borrows: '/api/borrows',
      statistics: '/api/statistics'
    }
  });
});

app.use('/api', routes);

// ============ ERROR HANDLING ============
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint không tồn tại'
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Lỗi server nội bộ'
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`========================================\n`);
});

export default app;
