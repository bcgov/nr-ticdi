import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { DocumentTypeController } from './document_type.controller';
import { DocumentTypeService } from './document_type.service';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockIdirUser = {
  idir_username: 'TEST_USER',
  given_name: 'Test',
  family_name: 'User',
  email: 'test@gov.bc.ca',
};

const allowAll: CanActivate = { canActivate: () => true };

const rejectUnauthorized: CanActivate = {
  canActivate: () => {
    throw new UnauthorizedException('No valid JWT');
  },
};

const mockDocumentTypeService = {
  update: jest.fn(),
  findAll: jest.fn(),
  findActiveDocTypes: jest.fn(),
  getGroupMaxByDocTypeId: jest.fn(),
  addProvisionGroup: jest.fn(),
  updateProvisionGroups: jest.fn(),
  removeProvisionGroup: jest.fn(),
  activateDocType: jest.fn(),
  deactivateDocType: jest.fn(),
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function buildApp(authGuard: CanActivate = allowAll): Promise<INestApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [DocumentTypeController],
    providers: [{ provide: DocumentTypeService, useValue: mockDocumentTypeService }],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(authGuard)
    .compile();

  const app = moduleRef.createNestApplication();
  app.use((req, _res, next) => {
    req.user = mockIdirUser;
    next();
  });
  await app.init();
  return app;
}

// ---------------------------------------------------------------------------
// Guard enforcement
// ---------------------------------------------------------------------------

describe('DocumentTypeController – guard enforcement', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 401 when JwtAuthGuard rejects', async () => {
    const app = await buildApp(rejectUnauthorized);
    await request(app.getHttpServer()).get('/document-type').expect(401);
    await app.close();
  });
});

// ---------------------------------------------------------------------------
// Controller logic
// ---------------------------------------------------------------------------

describe('DocumentTypeController – controller logic', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  describe('GET /document-type', () => {
    it('returns all document types', async () => {
      const types = [{ id: 1, name: 'Licence' }];
      mockDocumentTypeService.findAll.mockResolvedValue(types);

      const res = await request(app.getHttpServer()).get('/document-type').expect(200);
      expect(res.body).toEqual(types);
    });
  });

  describe('GET /document-type/active-doc-types', () => {
    it('returns active document types', async () => {
      const types = [{ id: 2, name: 'Active Licence', active: true }];
      mockDocumentTypeService.findActiveDocTypes.mockResolvedValue(types);

      const res = await request(app.getHttpServer()).get('/document-type/active-doc-types').expect(200);
      expect(res.body).toEqual(types);
    });
  });

  describe('GET /document-type/get-group-max/:document_type_id', () => {
    it('returns group max for the given doc type', async () => {
      mockDocumentTypeService.getGroupMaxByDocTypeId.mockResolvedValue({ max: 5 });

      const res = await request(app.getHttpServer()).get('/document-type/get-group-max/3').expect(200);
      expect(res.body).toEqual({ max: 5 });
      expect(mockDocumentTypeService.getGroupMaxByDocTypeId).toHaveBeenCalledWith('3');
    });
  });

  describe('GET /document-type/activate/:document_type_id', () => {
    it('calls activateDocType with the correct id', async () => {
      mockDocumentTypeService.activateDocType.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/document-type/activate/4').expect(200);
      expect(mockDocumentTypeService.activateDocType).toHaveBeenCalledWith('4');
    });
  });

  describe('GET /document-type/deactivate/:document_type_id', () => {
    it('calls deactivateDocType with the correct id', async () => {
      mockDocumentTypeService.deactivateDocType.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).get('/document-type/deactivate/4').expect(200);
      expect(mockDocumentTypeService.deactivateDocType).toHaveBeenCalledWith('4');
    });
  });

  describe('POST /document-type/update', () => {
    it('calls update with correct args including idir_username from token', async () => {
      mockDocumentTypeService.update.mockResolvedValue({ id: 1 });

      const payload = { id: 1, name: 'Updated', prefix: 'UPD', created_by: 'sys', created_date: '2026-01-01' };

      await request(app.getHttpServer()).post('/document-type/update').send(payload).expect(201);

      expect(mockDocumentTypeService.update).toHaveBeenCalledWith(
        payload.id,
        payload.name,
        payload.prefix,
        payload.created_by,
        payload.created_date,
        mockIdirUser.idir_username
      );
    });
  });

  describe('POST /document-type/add-provision-group', () => {
    it('calls addProvisionGroup with the correct args', async () => {
      mockDocumentTypeService.addProvisionGroup.mockResolvedValue({ id: 10 });

      const payload = { provision_group: 1, provision_group_text: 'Group A', max: 3, document_type_id: 2 };

      const res = await request(app.getHttpServer())
        .post('/document-type/add-provision-group')
        .send(payload)
        .expect(201);

      expect(res.body).toEqual({ id: 10 });
      expect(mockDocumentTypeService.addProvisionGroup).toHaveBeenCalledWith(
        payload.provision_group,
        payload.provision_group_text,
        payload.max,
        payload.document_type_id
      );
    });
  });

  describe('POST /document-type/update-provision-groups', () => {
    it('delegates to updateProvisionGroups', async () => {
      mockDocumentTypeService.updateProvisionGroups.mockResolvedValue([]);

      const payload = { document_type_id: 1, provision_groups: [] };
      await request(app.getHttpServer()).post('/document-type/update-provision-groups').send(payload).expect(201);

      expect(mockDocumentTypeService.updateProvisionGroups).toHaveBeenCalledWith(
        payload.document_type_id,
        payload.provision_groups
      );
    });
  });

  describe('POST /document-type/remove-provision-group', () => {
    it('delegates to removeProvisionGroup', async () => {
      mockDocumentTypeService.removeProvisionGroup.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer())
        .post('/document-type/remove-provision-group')
        .send({ provision_group_id: 5 })
        .expect(201);

      expect(mockDocumentTypeService.removeProvisionGroup).toHaveBeenCalledWith(5);
    });
  });
});
