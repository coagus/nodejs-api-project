import express from 'express';

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: 'v1',
    environment: 'development',
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});