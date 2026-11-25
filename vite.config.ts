import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';
import {
  getAllProjects,
  createProjectRecord,
  deleteProjectRecord,
} from './src/server/projectsController.ts';
import {
  getAllReviews,
  createReviewRecord,
  updateReviewRecord,
  deleteReviewRecord,
} from './src/server/reviewsController.ts';
import { getAllTeamMembers } from './src/server/teamController.ts';
import { checkNeonServices } from './src/server/neonHealth.ts';
import { uploadToNeonStorage } from './src/lib/neon.ts';
import {
  getAllUsers,
  createUserRecord,
  updateUserRecord,
  deleteUserRecord,
  authenticateUser,
} from './src/server/usersController.ts';

dotenv.config();

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'nexora-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // GET /api/health (Tests Postgres, Auth, Object Storage)
        if (url === '/api/health' && req.method === 'GET') {
          try {
            const health = await checkNeonServices();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(health));
          } catch (err: any) {
            console.error('Health check error:', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // POST /api/storage/upload (Upload to Neon Object Storage)
        if (url === '/api/storage/upload' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const filename = body.filename || `project-${Date.now()}.png`;
              const base64Data = body.data || '';
              const buffer = Buffer.from(base64Data, 'base64');
              const contentType = body.contentType || 'image/png';

              const publicUrl = await uploadToNeonStorage(filename, buffer, contentType);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({ success: true, url: publicUrl, filename }));
            } catch (err: any) {
              console.error('Storage upload error:', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // GET /api/projects
        if (url === '/api/projects' && req.method === 'GET') {
          try {
            const projects = await getAllProjects();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(projects));
          } catch (err: any) {
            console.error('API Error (GET /api/projects):', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Database query failed',
                details: err.message,
              })
            );
          }
          return;
        }

        // POST /api/projects
        if (url === '/api/projects' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const project = await createProjectRecord(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(project));
            } catch (err: any) {
              console.error('API Error (POST /api/projects):', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  error: 'Failed to create project',
                  details: err.message,
                })
              );
            }
          });
          return;
        }

        // DELETE /api/projects/[id]
        if (url.startsWith('/api/projects/') && req.method === 'DELETE') {
          const id = url.replace('/api/projects/', '').trim();
          try {
            const result = await deleteProjectRecord(id);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('API Error (DELETE /api/projects/:id):', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to delete project',
                details: err.message,
              })
            );
          }
          return;
        }

        // GET /api/reviews
        if (url === '/api/reviews' && req.method === 'GET') {
          try {
            const reviews = await getAllReviews();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(reviews));
          } catch (err: any) {
            console.error('API Error (GET /api/reviews):', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to fetch reviews',
                details: err.message,
              })
            );
          }
          return;
        }

        // POST /api/reviews
        if (url === '/api/reviews' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const review = await createReviewRecord(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(review));
            } catch (err: any) {
              console.error('API Error (POST /api/reviews):', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  error: 'Failed to create review',
                  details: err.message,
                })
              );
            }
          });
          return;
        }

        // PUT or PATCH /api/reviews/[id] (Update / Toggle Featured)
        if (url.startsWith('/api/reviews/') && (req.method === 'PUT' || req.method === 'PATCH')) {
          const id = url.replace('/api/reviews/', '').trim();
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const updated = await updateReviewRecord(id, body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(updated));
            } catch (err: any) {
              console.error('API Error (PATCH /api/reviews/:id):', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  error: 'Failed to update review',
                  details: err.message,
                })
              );
            }
          });
          return;
        }

        // DELETE /api/reviews/[id]
        if (url.startsWith('/api/reviews/') && req.method === 'DELETE') {
          const id = url.replace('/api/reviews/', '').trim();
          try {
            const result = await deleteReviewRecord(id);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('API Error (DELETE /api/reviews/:id):', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to delete review',
                details: err.message,
              })
            );
          }
          return;
        }

        // GET /api/team
        if (url === '/api/team' && req.method === 'GET') {
          try {
            const members = await getAllTeamMembers();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(members));
          } catch (err: any) {
            console.error('API Error (GET /api/team):', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to fetch team members',
                details: err.message,
              })
            );
          }
          return;
        }

        // GET /api/users (Fetch all DB users)
        if (url === '/api/users' && req.method === 'GET') {
          try {
            const users = await getAllUsers();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(users));
          } catch (err: any) {
            console.error('API Error (GET /api/users):', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error: 'Failed to fetch users from database',
                details: err.message,
              })
            );
          }
          return;
        }

        // POST /api/users (Super Admin creates a new user & assigns roles)
        if (url === '/api/users' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const newUser = await createUserRecord(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify(newUser));
            } catch (err: any) {
              console.error('API Error (POST /api/users):', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  error: err.message || 'Failed to create user',
                })
              );
            }
          });
          return;
        }

        // PATCH or PUT /api/users/[id] (Super Admin updates user or roles)
        if (url.startsWith('/api/users/') && (req.method === 'PATCH' || req.method === 'PUT')) {
          const id = url.replace('/api/users/', '').trim();
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const updated = await updateUserRecord(id, body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(updated));
            } catch (err: any) {
              console.error('API Error (PATCH /api/users/:id):', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  error: err.message || 'Failed to update user',
                })
              );
            }
          });
          return;
        }

        // DELETE /api/users/[id] (Super Admin deletes user)
        if (url.startsWith('/api/users/') && req.method === 'DELETE') {
          const id = url.replace('/api/users/', '').trim();
          try {
            const result = await deleteUserRecord(id);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('API Error (DELETE /api/users/:id):', err.message);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(
              JSON.stringify({
                error: err.message || 'Failed to delete user',
              })
            );
          }
          return;
        }

        // POST /api/auth/login (Authenticate user against database)
        if (url === '/api/auth/login' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const user = await authenticateUser(body.email, body.password);
              if (!user) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 401;
                res.end(
                  JSON.stringify({
                    error: 'Invalid email or password. Please verify credentials.',
                  })
                );
                return;
              }
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, user }));
            } catch (err: any) {
              console.error('API Error (POST /api/auth/login):', err.message);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: err.message || 'Authentication error',
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMiddlewarePlugin()],
});
