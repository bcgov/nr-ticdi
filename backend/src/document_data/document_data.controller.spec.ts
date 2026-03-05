import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { DocumentDataController } from './document_data.controller';
import { DocumentDataService } from './document_data.service';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const allowAll: CanActivate = { canActivate: () => true };

const rejectUnauthorized: CanActivate = {
  canActivate: () => {
    throw new UnauthorizedException('No valid JWT');
  },
};

const mockDocumentDataService = {
  findAll: jest.fn(),
  findByDocumentDataId: jest.fn(),
  findDocumentDataByDocTypeIdAndDtid: jest.fn(),
  findViewByDocumentDataId: jest.fn(),
  getVariablesByDtidAndDocType: jest.fn(),
  getProvisionsByDocTypeIdAndDtid: jest.fn(),
  getEnabledProvisionsByDocTypeIdAndDtid: jest.fn(),
  getDocTypesByDtidWithStatus: jest.fn(),
  remove: jest.fn(),
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function buildApp(authGuard: CanActivate = allowAll): Promise<INestApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [DocumentDataController],
    providers: [{ provide: DocumentDataService, useValue: mockDocumentDataService }],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(authGuard)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

// ---------------------------------------------------------------------------
// Guard enforcement
// ---------------------------------------------------------------------------

describe('DocumentDataController – guard enforcement', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 401 when JwtAuthGuard rejects', async () => {
    const app = await buildApp(rejectUnauthorized);
    await request(app.getHttpServer()).get('/document-data').expect(401);
    await app.close();
  });
});

// ---------------------------------------------------------------------------
// Controller logic
// ---------------------------------------------------------------------------

describe('DocumentDataController – controller logic', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  describe('GET /document-data', () => {
    it('returns all document data', async () => {
      const data = [{ id: 1, dtid: 100 }];
      mockDocumentDataService.findAll.mockResolvedValue(data);

      const res = await request(app.getHttpServer()).get('/document-data').expect(200);
      expect(res.body).toEqual(data);
    });
  });

  describe('GET /document-data/:documentDataId', () => {
    it('calls findByDocumentDataId when id is non-zero', async () => {
      const doc = { id: 5, dtid: 200 };
      mockDocumentDataService.findByDocumentDataId.mockResolvedValue(doc);

      const res = await request(app.getHttpServer()).get('/document-data/5').expect(200);
      expect(res.body).toEqual(doc);
      expect(mockDocumentDataService.findByDocumentDataId).toHaveBeenCalledWith('5');
    });
  });

  describe('GET /document-data/dtid/:document_type_id/:dtid', () => {
    it('calls findDocumentDataByDocTypeIdAndDtid with correct params', async () => {
      const doc = { id: 3, dtid: 300 };
      mockDocumentDataService.findDocumentDataByDocTypeIdAndDtid.mockResolvedValue(doc);

      const res = await request(app.getHttpServer()).get('/document-data/dtid/2/300').expect(200);
      expect(res.body).toEqual(doc);
      expect(mockDocumentDataService.findDocumentDataByDocTypeIdAndDtid).toHaveBeenCalledWith('2', '300');
    });
  });

  describe('GET /document-data/view/:documentDataId', () => {
    it('calls findViewByDocumentDataId with the coerced numeric id', async () => {
      const view = { id: 6, dtid: 400 };
      mockDocumentDataService.findViewByDocumentDataId.mockResolvedValue(view);

      const res = await request(app.getHttpServer()).get('/document-data/view/6').expect(200);
      expect(res.body).toEqual(view);
      expect(mockDocumentDataService.findViewByDocumentDataId).toHaveBeenCalledWith(6);
    });
  });

  describe('GET /document-data/variables/:dtid/:document_type_id', () => {
    it('calls getVariablesByDtidAndDocType with correct params', async () => {
      const vars = [{ id: 1, variable_name: 'VAR_A' }];
      mockDocumentDataService.getVariablesByDtidAndDocType.mockResolvedValue(vars);

      const res = await request(app.getHttpServer()).get('/document-data/variables/500/3').expect(200);
      expect(res.body).toEqual(vars);
      expect(mockDocumentDataService.getVariablesByDtidAndDocType).toHaveBeenCalledWith('500', '3');
    });
  });

  describe('GET /document-data/provisions/:document_type_id/:dtid', () => {
    it('calls getProvisionsByDocTypeIdAndDtid with correct params', async () => {
      const provs = [{ id: 1, provision_name: 'Prov A' }];
      mockDocumentDataService.getProvisionsByDocTypeIdAndDtid.mockResolvedValue(provs);

      const res = await request(app.getHttpServer()).get('/document-data/provisions/3/500').expect(200);
      expect(res.body).toEqual(provs);
      expect(mockDocumentDataService.getProvisionsByDocTypeIdAndDtid).toHaveBeenCalledWith('3', '500');
    });
  });

  describe('GET /document-data/get-enabled-provisions/:document_type_id/:dtid', () => {
    it('calls getEnabledProvisionsByDocTypeIdAndDtid with correct params', async () => {
      mockDocumentDataService.getEnabledProvisionsByDocTypeIdAndDtid.mockResolvedValue([]);

      await request(app.getHttpServer()).get('/document-data/get-enabled-provisions/3/500').expect(200);
      expect(mockDocumentDataService.getEnabledProvisionsByDocTypeIdAndDtid).toHaveBeenCalledWith('3', '500');
    });
  });

  describe('GET /document-data/doc-types-by-dtid/:dtid', () => {
    it('returns doc types with status for the given dtid', async () => {
      const result = [{ document_type_id: 1, status: 'FINAL' }];
      mockDocumentDataService.getDocTypesByDtidWithStatus.mockResolvedValue(result);

      const res = await request(app.getHttpServer()).get('/document-data/doc-types-by-dtid/500').expect(200);
      expect(res.body).toEqual(result);
      expect(mockDocumentDataService.getDocTypesByDtidWithStatus).toHaveBeenCalledWith('500');
    });
  });

  describe('DELETE /document-data/:dtid', () => {
    it('calls remove with the coerced numeric dtid', async () => {
      mockDocumentDataService.remove.mockResolvedValue({ affected: 1 });

      await request(app.getHttpServer()).delete('/document-data/500').expect(200);
      expect(mockDocumentDataService.remove).toHaveBeenCalledWith(500);
    });
  });
});
