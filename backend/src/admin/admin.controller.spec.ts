import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as request from 'supertest';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { JwtRoleGuard } from 'src/auth/jwtrole.guard';
import { UserObject } from 'src/types';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

/** A minimal IDIR user injected via req.user for tests that need @User(). */
const mockIdirUser = {
  idir_username: 'TEST_USER',
  given_name: 'Test',
  family_name: 'User',
  email: 'test.user@gov.bc.ca',
  client_roles: ['ticdi_admin'],
};

/** Guards that unconditionally allow every request. */
const allowAll: CanActivate = { canActivate: () => true };

/** Guard that simulates a missing / invalid JWT (HTTP 401). */
const rejectUnauthorized: CanActivate = {
  canActivate: () => {
    throw new UnauthorizedException('No valid JWT');
  },
};

/** Guard that simulates a valid JWT but insufficient role (HTTP 403). */
const rejectForbidden: CanActivate = {
  canActivate: () => {
    throw new ForbiddenException('Insufficient role');
  },
};

/**
 * A role-aware guard that mirrors the real JwtRoleGuard logic:
 * reads client_roles from req.user and checks them against the required role.
 * Returns false (→ 403) when the user lacks the role rather than throwing.
 */
const roleAwareGuard = (userRoles: string[]): CanActivate => ({
  canActivate: (context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;
    return (user?.client_roles as string[])?.some((r) => userRoles.includes(r)) ?? false;
  },
});

// ---------------------------------------------------------------------------
// Mock AdminService – every method is a no-op jest.fn() unless overridden
// ---------------------------------------------------------------------------

const mockAdminService = {
  activateTemplate: jest.fn(),
  updateTemplate: jest.fn(),
  getPreviewPdf: jest.fn(),
  downloadTemplate: jest.fn(),
  removeTemplate: jest.fn(),
  uploadTemplate: jest.fn(),
  getAdminUsers: jest.fn(),
  getExportData: jest.fn(),
  addAdmin: jest.fn(),
  searchUsers: jest.fn(),
  removeAdmin: jest.fn(),
  getDocumentTemplates: jest.fn(),
  getProvisions: jest.fn(),
  getDocumentVariables: jest.fn(),
  enableProvision: jest.fn(),
  disableProvision: jest.fn(),
  addDocumentType: jest.fn(),
  removeDocumentType: jest.fn(),
};

// ---------------------------------------------------------------------------
// Helper – builds an app with the supplied guard overrides
// ---------------------------------------------------------------------------

async function buildApp(
  authGuard: CanActivate = allowAll,
  roleGuard: CanActivate = allowAll
): Promise<INestApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [AdminController],
    providers: [{ provide: AdminService, useValue: mockAdminService }],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(authGuard)
    .overrideGuard(JwtRoleGuard)
    .useValue(roleGuard)
    .compile();

  const app = moduleRef.createNestApplication();

  // Inject the mock IDIR user so that @User() resolves in controller methods.
  app.use((req, _res, next) => {
    req.user = mockIdirUser;
    next();
  });

  await app.init();
  return app;
}

// ---------------------------------------------------------------------------
// Guard-enforcement tests
// ---------------------------------------------------------------------------

describe('AdminController – guard enforcement', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 401 when JwtAuthGuard rejects (no valid JWT)', async () => {
    const app = await buildApp(rejectUnauthorized, allowAll);
    await request(app.getHttpServer()).get('/admin/get-admins').expect(401);
    await app.close();
  });

  it('returns 403 when JwtRoleGuard rejects (authenticated but not TICDI_ADMIN)', async () => {
    const app = await buildApp(allowAll, rejectForbidden);
    await request(app.getHttpServer()).get('/admin/get-admins').expect(403);
    await app.close();
  });

  it('returns 403 when user has ticdi_user role instead of ticdi_admin', async () => {
    // Build an app where req.user has only the 'ticdi_user' role and the
    // role guard mirrors the real JwtRoleGuard logic (checks client_roles).
    const moduleRef = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(allowAll)
      .overrideGuard(JwtRoleGuard)
      .useValue(roleAwareGuard(['ticdi_admin']))
      .compile();

    const app = moduleRef.createNestApplication();
    app.use((req, _res, next) => {
      req.user = { ...mockIdirUser, client_roles: ['ticdi_user'] };
      next();
    });
    await app.init();

    await request(app.getHttpServer()).get('/admin/get-admins').expect(403);
    await app.close();
  });

  it('allows access when user has both ticdi_user and ticdi_admin roles', async () => {
    mockAdminService.getAdminUsers.mockResolvedValue([]);

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(allowAll)
      .overrideGuard(JwtRoleGuard)
      .useValue(roleAwareGuard(['ticdi_admin']))
      .compile();

    const app = moduleRef.createNestApplication();
    app.use((req, _res, next) => {
      req.user = { ...mockIdirUser, client_roles: ['ticdi_user', 'ticdi_admin'] };
      next();
    });
    await app.init();

    await request(app.getHttpServer()).get('/admin/get-admins').expect(200);
    await app.close();
  });
});

// ---------------------------------------------------------------------------
// Controller-logic tests (both guards mocked to pass-through)
// ---------------------------------------------------------------------------

describe('AdminController - controller logic', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  // ── Template management ────────────────────────────────────────────────

  describe('GET /admin/activate-template/:id/:document_type_id', () => {
    it('calls adminService.activateTemplate with correct params including idir_username', async () => {
      mockAdminService.activateTemplate.mockResolvedValue({ success: true });

      await request(app.getHttpServer()).get('/admin/activate-template/5/2').expect(200);

      expect(mockAdminService.activateTemplate).toHaveBeenCalledWith({
        id: '5',
        update_userid: mockIdirUser.idir_username,
        document_type_id: '2',
      });
    });
  });

  describe('GET /admin/remove-template/:id/:document_type_id', () => {
    it('calls adminService.removeTemplate with correct params', async () => {
      mockAdminService.removeTemplate.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/admin/remove-template/7/3').expect(200);

      expect(mockAdminService.removeTemplate).toHaveBeenCalledWith('3', '7');
    });
  });

  describe('GET /admin/get-templates/:document_type_id', () => {
    it('returns document templates for the given type', async () => {
      const templates = [{ id: 1, file_name: 'template.docx' }];
      mockAdminService.getDocumentTemplates.mockResolvedValue(templates);

      const res = await request(app.getHttpServer()).get('/admin/get-templates/4').expect(200);

      expect(res.body).toEqual(templates);
      expect(mockAdminService.getDocumentTemplates).toHaveBeenCalledWith('4');
    });
  });

  // preview-template and download-template use @Res() to stream binary data;
  // we verify the service is invoked and a non-5xx response is produced.

  describe('GET /admin/preview-template/:id', () => {
    it('returns 200 and streams PDF when service resolves', async () => {
      // Minimal valid PDF bytes so the PassThrough stream has content
      const pdfBuffer = Buffer.from('%PDF-1.4 test');
      mockAdminService.getPreviewPdf.mockResolvedValue(pdfBuffer);

      const res = await request(app.getHttpServer()).get('/admin/preview-template/1').expect(200);

      expect(res.headers['content-type']).toMatch(/pdf/);
      expect(mockAdminService.getPreviewPdf).toHaveBeenCalledWith('1');
    });

    it('returns 500 when service throws', async () => {
      mockAdminService.getPreviewPdf.mockRejectedValue(new Error('DB error'));

      await request(app.getHttpServer()).get('/admin/preview-template/99').expect(500);
    });
  });

  describe('GET /admin/download-template/:id', () => {
    it('returns 200 and streams DOCX when service resolves', async () => {
      mockAdminService.downloadTemplate.mockResolvedValue({
        the_file: Buffer.from('fake-docx-content').toString('base64'),
      });

      const res = await request(app.getHttpServer()).get('/admin/download-template/2').expect(200);

      expect(res.headers['content-type']).toMatch(/wordprocessingml/);
      expect(mockAdminService.downloadTemplate).toHaveBeenCalledWith('2');
    });
  });

  // ── Provision management ───────────────────────────────────────────────

  describe('GET /admin/provisions', () => {
    it('returns the provisions list', async () => {
      const provisions = [{ id: 1, provision_name: 'Prov A' }];
      mockAdminService.getProvisions.mockResolvedValue(provisions);

      const res = await request(app.getHttpServer()).get('/admin/provisions').expect(200);

      expect(res.body).toEqual(provisions);
    });
  });

  describe('GET /admin/enable-provision/:provisionId', () => {
    it('calls adminService.enableProvision with the correct id', async () => {
      mockAdminService.enableProvision.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/admin/enable-provision/10').expect(200);

      expect(mockAdminService.enableProvision).toHaveBeenCalledWith('10');
    });
  });

  describe('GET /admin/disable-provision/:provisionId', () => {
    it('calls adminService.disableProvision with the correct id', async () => {
      mockAdminService.disableProvision.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/admin/disable-provision/10').expect(200);

      expect(mockAdminService.disableProvision).toHaveBeenCalledWith('10');
    });
  });

  // ── Document variables ─────────────────────────────────────────────────

  describe('GET /admin/document-variables', () => {
    it('returns document variables', async () => {
      const variables = [{ id: 1, variable_name: 'VAR_A' }];
      mockAdminService.getDocumentVariables.mockResolvedValue(variables);

      const res = await request(app.getHttpServer()).get('/admin/document-variables').expect(200);

      expect(res.body).toEqual(variables);
    });
  });

  // ── Admin user management ──────────────────────────────────────────────

  describe('GET /admin/get-admins', () => {
    it('returns the list of admin users', async () => {
      const admins: UserObject[] = [
        { name: 'Alice', username: 'alice', email: 'alice@gov.bc.ca', remove: '', idirUsername: 'ALICE' },
      ];
      mockAdminService.getAdminUsers.mockResolvedValue(admins);

      const res = await request(app.getHttpServer()).get('/admin/get-admins').expect(200);

      expect(res.body).toEqual(admins);
    });
  });

  describe('POST /admin/add-admin', () => {
    it('returns { error: null } on success', async () => {
      mockAdminService.addAdmin.mockResolvedValue(undefined);

      const res = await request(app.getHttpServer())
        .post('/admin/add-admin')
        .send({ idirUsername: 'NEW_ADMIN' })
        .expect(201);

      expect(res.body).toEqual({ error: null });
      expect(mockAdminService.addAdmin).toHaveBeenCalledWith('NEW_ADMIN');
    });

    it('returns { error: <message> } when service throws', async () => {
      mockAdminService.addAdmin.mockRejectedValue(new Error('User not found'));

      const res = await request(app.getHttpServer())
        .post('/admin/add-admin')
        .send({ idirUsername: 'UNKNOWN' })
        .expect(201);

      expect(res.body).toEqual({ error: 'User not found' });
    });
  });

  describe('POST /admin/remove-admin', () => {
    it('delegates to adminService.removeAdmin', async () => {
      mockAdminService.removeAdmin.mockResolvedValue({ error: null });

      const res = await request(app.getHttpServer())
        .post('/admin/remove-admin')
        .send({ idirUsername: 'OLD_ADMIN' })
        .expect(201);

      expect(res.body).toEqual({ error: null });
      expect(mockAdminService.removeAdmin).toHaveBeenCalledWith('OLD_ADMIN');
    });
  });

  describe('POST /admin/search-users', () => {
    it('returns userObject and null error on success', async () => {
      const found = {
        firstName: 'Bob',
        lastName: 'Builder',
        username: 'bobbuilder',
        idirUsername: 'BOB',
      };
      mockAdminService.searchUsers.mockResolvedValue(found);

      const res = await request(app.getHttpServer())
        .post('/admin/search-users')
        .send({ email: 'bob@gov.bc.ca' })
        .expect(201);

      expect(res.body).toEqual({ userObject: found, error: null });
    });

    it('returns null userObject and error message on failure', async () => {
      mockAdminService.searchUsers.mockRejectedValue(new Error('Not found'));

      const res = await request(app.getHttpServer())
        .post('/admin/search-users')
        .send({ email: 'nobody@gov.bc.ca' })
        .expect(201);

      expect(res.body).toEqual({ userObject: null, error: 'Not found' });
    });
  });

  // ── Export ─────────────────────────────────────────────────────────────

  describe('GET /admin/get-export-data', () => {
    it('returns the export data string', async () => {
      mockAdminService.getExportData.mockResolvedValue('csv,data,here');

      const res = await request(app.getHttpServer()).get('/admin/get-export-data').expect(200);

      expect(res.text).toBe('csv,data,here');
    });
  });

  // ── Document type management ───────────────────────────────────────────

  describe('POST /admin/add-document-type', () => {
    it('calls addDocumentType with correct args including idir_username from token', async () => {
      mockAdminService.addDocumentType.mockResolvedValue({ id: 42 });

      const payload = {
        name: 'Licence',
        prefix: 'LIC',
        created_by: 'system',
        created_date: '2026-01-01',
      };

      const res = await request(app.getHttpServer()).post('/admin/add-document-type').send(payload).expect(201);

      expect(res.body).toEqual({ id: 42 });
      expect(mockAdminService.addDocumentType).toHaveBeenCalledWith(
        payload.name,
        payload.prefix,
        payload.created_by,
        payload.created_date,
        mockIdirUser.idir_username
      );
    });
  });

  describe('GET /admin/remove-document-type/:id', () => {
    it('calls adminService.removeDocumentType with the correct id', async () => {
      mockAdminService.removeDocumentType.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/admin/remove-document-type/8').expect(200);

      expect(mockAdminService.removeDocumentType).toHaveBeenCalledWith('8');
    });
  });
});
