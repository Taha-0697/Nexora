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
import {
  getAllInquiries,
  createInquiryRecord,
  updateInquiryStatus,
  deleteInquiryRecord,
} from './src/server/inquiriesController.ts';
import {
  getAllB2bLogos,
  createB2bLogo,
  updateB2bLogo,
  deleteB2bLogo,
  getAllB2bCaseStudies,
  createB2bCaseStudy,
  updateB2bCaseStudy,
  deleteB2bCaseStudy,
  getB2bMarqueeSettings,
  updateB2bMarqueeSettings,
} from './src/server/b2bCmsController.ts';
import {
  getAllMarketingCampaigns,
  createMarketingCampaign,
  updateMarketingCampaign,
  deleteMarketingCampaign,
  getAllMarketingPosts,
  createMarketingPost,
  updateMarketingPost,
  deleteMarketingPost,
  getAllAccountConnections,
  updateAccountConnection,
  getMarketingBannerPixel,
  updateMarketingBannerPixel,
} from './src/server/marketingController.ts';

dotenv.config();

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let bodyStr = '';
    req.on('data', (chunk: any) => {
      bodyStr += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(bodyStr || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: any, status: number, data: any) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

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
            return sendJson(res, 200, health);
          } catch (err: any) {
            console.error('Health check error:', err.message);
            return sendJson(res, 500, { error: err.message });
          }
        }

        // POST /api/upload
        if (url === '/api/upload' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const { fileBase64, fileName, contentType } = body;
            if (!fileBase64 || !fileName) {
              return sendJson(res, 400, { error: 'Missing fileBase64 or fileName in payload' });
            }
            const buffer = Buffer.from(fileBase64, 'base64');
            const result = await uploadToNeonStorage(buffer as any, fileName, contentType || 'application/octet-stream');
            return sendJson(res, 200, result);
          } catch (err: any) {
            console.error('API Upload error:', err.message);
            return sendJson(res, 500, { error: 'Failed to upload file', details: err.message });
          }
        }

        // --- PROJECTS ---
        if (url === '/api/projects' && req.method === 'GET') {
          try {
            const projects = await getAllProjects();
            return sendJson(res, 200, projects);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Database query failed', details: err.message });
          }
        }

        if (url === '/api/projects' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const project = await createProjectRecord(body);
            return sendJson(res, 201, project);
          } catch (err: any) {
            return sendJson(res, 400, { error: 'Failed to create project', details: err.message });
          }
        }

        if (url.startsWith('/api/projects/') && req.method === 'DELETE') {
          const id = url.replace('/api/projects/', '').trim();
          try {
            const result = await deleteProjectRecord(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to delete project', details: err.message });
          }
        }

        // --- REVIEWS ---
        if (url === '/api/reviews' && req.method === 'GET') {
          try {
            const reviews = await getAllReviews();
            return sendJson(res, 200, reviews);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch reviews', details: err.message });
          }
        }

        if (url === '/api/reviews' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const review = await createReviewRecord(body);
            return sendJson(res, 201, review);
          } catch (err: any) {
            return sendJson(res, 400, { error: 'Failed to create review', details: err.message });
          }
        }

        if (url.startsWith('/api/reviews/') && (req.method === 'PUT' || req.method === 'PATCH')) {
          const id = url.replace('/api/reviews/', '').trim();
          try {
            const body = await readJsonBody(req);
            const updated = await updateReviewRecord(id, body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: 'Failed to update review', details: err.message });
          }
        }

        if (url.startsWith('/api/reviews/') && req.method === 'DELETE') {
          const id = url.replace('/api/reviews/', '').trim();
          try {
            const result = await deleteReviewRecord(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to delete review', details: err.message });
          }
        }

        // --- TEAM ---
        if (url === '/api/team' && req.method === 'GET') {
          try {
            const members = await getAllTeamMembers();
            return sendJson(res, 200, members);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch team members', details: err.message });
          }
        }

        // --- USERS & AUTH ---
        if (url === '/api/users' && req.method === 'GET') {
          try {
            const users = await getAllUsers();
            return sendJson(res, 200, users);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch users from database', details: err.message });
          }
        }

        if (url === '/api/users' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const newUser = await createUserRecord(body);
            return sendJson(res, 201, newUser);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to create user' });
          }
        }

        if (url.startsWith('/api/users/') && (req.method === 'PATCH' || req.method === 'PUT')) {
          const id = url.replace('/api/users/', '').trim();
          try {
            const body = await readJsonBody(req);
            const updated = await updateUserRecord(id, body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update user' });
          }
        }

        if (url.startsWith('/api/users/') && req.method === 'DELETE') {
          const id = url.replace('/api/users/', '').trim();
          try {
            const result = await deleteUserRecord(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to delete user' });
          }
        }

        if (url === '/api/auth/login' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const user = await authenticateUser(body.email, body.password);
            if (!user) {
              return sendJson(res, 401, { error: 'Invalid email or password. Please verify credentials.' });
            }
            return sendJson(res, 200, { success: true, user });
          } catch (err: any) {
            return sendJson(res, 500, { error: err.message || 'Authentication error' });
          }
        }

        // --- INQUIRIES & LEADS ---
        if (url === '/api/inquiries' && req.method === 'GET') {
          try {
            const list = await getAllInquiries();
            return sendJson(res, 200, list);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch inquiries', details: err.message });
          }
        }

        if (url === '/api/inquiries' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const created = await createInquiryRecord(body);
            return sendJson(res, 201, created);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to create inquiry' });
          }
        }

        if (url.startsWith('/api/inquiries/') && (req.method === 'PATCH' || req.method === 'PUT')) {
          const id = url.replace('/api/inquiries/', '').trim();
          try {
            const body = await readJsonBody(req);
            const updated = await updateInquiryStatus(id, body.status, body.notes);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update inquiry' });
          }
        }

        if (url.startsWith('/api/inquiries/') && req.method === 'DELETE') {
          const id = url.replace('/api/inquiries/', '').trim();
          try {
            const result = await deleteInquiryRecord(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 500, { error: err.message || 'Failed to delete inquiry' });
          }
        }

        // --- B2B CONSOLE CMS ---
        // Logos
        if (url === '/api/b2b/logos' && req.method === 'GET') {
          try {
            const logos = await getAllB2bLogos();
            return sendJson(res, 200, logos);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch B2B logos', details: err.message });
          }
        }

        if (url === '/api/b2b/logos' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const created = await createB2bLogo(body);
            return sendJson(res, 201, created);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to create logo' });
          }
        }

        if (url.startsWith('/api/b2b/logos/') && (req.method === 'PATCH' || req.method === 'PUT')) {
          const id = url.replace('/api/b2b/logos/', '').trim();
          try {
            const body = await readJsonBody(req);
            const updated = await updateB2bLogo(id, body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update logo' });
          }
        }

        if (url.startsWith('/api/b2b/logos/') && req.method === 'DELETE') {
          const id = url.replace('/api/b2b/logos/', '').trim();
          try {
            const result = await deleteB2bLogo(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 500, { error: err.message || 'Failed to delete logo' });
          }
        }

        // Case Studies
        if (url === '/api/b2b/casestudies' && req.method === 'GET') {
          try {
            const studies = await getAllB2bCaseStudies();
            return sendJson(res, 200, studies);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch case studies', details: err.message });
          }
        }

        if (url === '/api/b2b/casestudies' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const created = await createB2bCaseStudy(body);
            return sendJson(res, 201, created);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to create case study' });
          }
        }

        if (url.startsWith('/api/b2b/casestudies/') && (req.method === 'PATCH' || req.method === 'PUT')) {
          const id = url.replace('/api/b2b/casestudies/', '').trim();
          try {
            const body = await readJsonBody(req);
            const updated = await updateB2bCaseStudy(id, body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update case study' });
          }
        }

        if (url.startsWith('/api/b2b/casestudies/') && req.method === 'DELETE') {
          const id = url.replace('/api/b2b/casestudies/', '').trim();
          try {
            const result = await deleteB2bCaseStudy(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 500, { error: err.message || 'Failed to delete case study' });
          }
        }

        // Marquee
        if (url === '/api/b2b/marquee' && req.method === 'GET') {
          try {
            const marquee = await getB2bMarqueeSettings();
            return sendJson(res, 200, marquee);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch marquee settings', details: err.message });
          }
        }

        if (url === '/api/b2b/marquee' && (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT')) {
          try {
            const body = await readJsonBody(req);
            const updated = await updateB2bMarqueeSettings(body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update marquee settings' });
          }
        }

        // --- MARKETING & ADS ---
        // Campaigns
        if (url === '/api/marketing/campaigns' && req.method === 'GET') {
          try {
            const campaigns = await getAllMarketingCampaigns();
            return sendJson(res, 200, campaigns);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch marketing campaigns', details: err.message });
          }
        }

        if (url === '/api/marketing/campaigns' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const created = await createMarketingCampaign(body);
            return sendJson(res, 201, created);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to create campaign' });
          }
        }

        if (url.startsWith('/api/marketing/campaigns/') && (req.method === 'PATCH' || req.method === 'PUT')) {
          const id = url.replace('/api/marketing/campaigns/', '').trim();
          try {
            const body = await readJsonBody(req);
            const updated = await updateMarketingCampaign(id, body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update campaign' });
          }
        }

        if (url.startsWith('/api/marketing/campaigns/') && req.method === 'DELETE') {
          const id = url.replace('/api/marketing/campaigns/', '').trim();
          try {
            const result = await deleteMarketingCampaign(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 500, { error: err.message || 'Failed to delete campaign' });
          }
        }

        // Posts
        if (url === '/api/marketing/posts' && req.method === 'GET') {
          try {
            const posts = await getAllMarketingPosts();
            return sendJson(res, 200, posts);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch posts', details: err.message });
          }
        }

        if (url === '/api/marketing/posts' && req.method === 'POST') {
          try {
            const body = await readJsonBody(req);
            const created = await createMarketingPost(body);
            return sendJson(res, 201, created);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to create post' });
          }
        }

        if (url.startsWith('/api/marketing/posts/') && (req.method === 'PATCH' || req.method === 'PUT')) {
          const id = url.replace('/api/marketing/posts/', '').trim();
          try {
            const body = await readJsonBody(req);
            const updated = await updateMarketingPost(id, body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update post' });
          }
        }

        if (url.startsWith('/api/marketing/posts/') && req.method === 'DELETE') {
          const id = url.replace('/api/marketing/posts/', '').trim();
          try {
            const result = await deleteMarketingPost(id);
            return sendJson(res, 200, result);
          } catch (err: any) {
            return sendJson(res, 500, { error: err.message || 'Failed to delete post' });
          }
        }

        // Connections
        if (url === '/api/marketing/connections' && req.method === 'GET') {
          try {
            const connections = await getAllAccountConnections();
            return sendJson(res, 200, connections);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch connections', details: err.message });
          }
        }

        if (url === '/api/marketing/connections' && (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT')) {
          try {
            const body = await readJsonBody(req);
            const updated = await updateAccountConnection(body.platform, body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update connection' });
          }
        }

        // Banner & Pixels
        if (url === '/api/marketing/banner-pixel' && req.method === 'GET') {
          try {
            const bannerPixel = await getMarketingBannerPixel();
            return sendJson(res, 200, bannerPixel);
          } catch (err: any) {
            return sendJson(res, 500, { error: 'Failed to fetch banner & pixel settings', details: err.message });
          }
        }

        if (url === '/api/marketing/banner-pixel' && (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT')) {
          try {
            const body = await readJsonBody(req);
            const updated = await updateMarketingBannerPixel(body);
            return sendJson(res, 200, updated);
          } catch (err: any) {
            return sendJson(res, 400, { error: err.message || 'Failed to update banner & pixel settings' });
          }
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
