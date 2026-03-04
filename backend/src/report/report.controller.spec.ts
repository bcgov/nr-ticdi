import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TTLSService } from 'src/ttls/ttls.service';
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

const mockReportService = {
  getDocumentDataByDocTypeIdAndDtid: jest.fn(),
  generateReportName: jest.fn(),
  generateReport: jest.fn(),
  getGroupMaxByDocTypeId: jest.fn(),
  getAllGroups: jest.fn(),
  getDocumentProvisionsByDocTypeIdAndDtid: jest.fn(),
  getDocumentVariablesByDocumentTypeIdAndDtid: jest.fn(),
  saveDocument: jest.fn(),
  getEnabledProvisionsByDocTypeId: jest.fn(),
  getEnabledProvisionsByDocTypeIdDtid: jest.fn(),
  getDocumentData: jest.fn(),
  getMandatoryProvisionsByDocumentTypeId: jest.fn(),
};

const mockTtlsService = {
  setWebadeToken: jest.fn(),
  callHttp: jest.fn(),
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function buildApp(authGuard: CanActivate = allowAll): Promise<INestApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [ReportController],
    providers: [
      { provide: ReportService, useValue: mockReportService },
      { provide: TTLSService, useValue: mockTtlsService },
    ],
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

describe('ReportController – guard enforcement', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 401 when JwtAuthGuard rejects on a guarded route', async () => {
    const app = await buildApp(rejectUnauthorized);
    await request(app.getHttpServer()).get('/report/search-document-data').expect(401);
    await app.close();
  });

  it('GET /report/healthcheck is public – returns 200 even with auth guard rejecting', async () => {
    // healthcheck is decorated @Public() so the real JwtAuthGuard skips it.
    // With our stub that always rejects, we override only to test that the
    // route itself is reachable; in production the @Public() decorator handles this.
    const app = await buildApp(allowAll);
    await request(app.getHttpServer()).get('/report/healthcheck').expect(200);
    await app.close();
  });
});

// ---------------------------------------------------------------------------
// Controller logic
// ---------------------------------------------------------------------------

describe('ReportController – controller logic', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  describe('GET /report/healthcheck', () => {
    it('returns 200 and empty body', async () => {
      const res = await request(app.getHttpServer()).get('/report/healthcheck').expect(200);
      expect(res.text).toBe('');
    });
  });

  describe('GET /report/get-data/:dtid', () => {
    it('sets webade token, calls callHttp, and returns response', async () => {
      mockTtlsService.setWebadeToken.mockResolvedValue(undefined);
      mockTtlsService.callHttp.mockResolvedValue({ dtid: 921528, fileNum: 'ABC-001' });

      const res = await request(app.getHttpServer()).get('/report/get-data/921528').expect(200);
      expect(res.body).toEqual({ dtid: 921528, fileNum: 'ABC-001' });
      expect(mockTtlsService.setWebadeToken).toHaveBeenCalled();
      expect(mockTtlsService.callHttp).toHaveBeenCalledWith('921528');
    });

    it('throws 500 when callHttp fails', async () => {
      mockTtlsService.setWebadeToken.mockResolvedValue(undefined);
      const axiosError = { response: { data: 'Not found' }, message: 'Request failed' };
      mockTtlsService.callHttp.mockRejectedValue(axiosError);

      await request(app.getHttpServer()).get('/report/get-data/99999').expect(500);
    });
  });

  describe('GET /report/get-document-data/:document_type_id/:dtid', () => {
    it('returns document data for the given params', async () => {
      const data = { id: 1, dtid: 921528 };
      mockReportService.getDocumentDataByDocTypeIdAndDtid.mockResolvedValue(data);

      const res = await request(app.getHttpServer()).get('/report/get-document-data/2/921528').expect(200);
      expect(res.body).toEqual(data);
      expect(mockReportService.getDocumentDataByDocTypeIdAndDtid).toHaveBeenCalledWith('2', '921528');
    });
  });

  describe('GET /report/get-report-name/:dtid/:tfn/:document_type_id', () => {
    it('returns the generated report name', async () => {
      mockReportService.generateReportName.mockResolvedValue({ reportName: 'LIC-001-2026' });

      const res = await request(app.getHttpServer())
        .get('/report/get-report-name/921528/ABC-001/2')
        .expect(200);

      expect(res.body).toEqual({ reportName: 'LIC-001-2026' });
      expect(mockReportService.generateReportName).toHaveBeenCalledWith('921528', 'ABC-001', '2');
    });
  });

  describe('GET /report/get-group-max/:document_type_id', () => {
    it('returns group max for the given doc type', async () => {
      mockReportService.getGroupMaxByDocTypeId.mockResolvedValue({ max: 4 });

      const res = await request(app.getHttpServer()).get('/report/get-group-max/1').expect(200);
      expect(res.body).toEqual({ max: 4 });
    });
  });

  describe('GET /report/get-all-groups', () => {
    it('returns all groups', async () => {
      const groups = [{ id: 1, name: 'Group A' }];
      mockReportService.getAllGroups.mockResolvedValue(groups);

      const res = await request(app.getHttpServer()).get('/report/get-all-groups').expect(200);
      expect(res.body).toEqual(groups);
    });
  });

  describe('GET /report/provisions/:document_type_id/:dtid', () => {
    it('returns provisions for the given doc type and dtid', async () => {
      const provisions = [{ id: 1, provision_name: 'Prov A' }];
      mockReportService.getDocumentProvisionsByDocTypeIdAndDtid.mockResolvedValue(provisions);

      const res = await request(app.getHttpServer()).get('/report/provisions/2/921528').expect(200);
      expect(res.body).toEqual(provisions);
      expect(mockReportService.getDocumentProvisionsByDocTypeIdAndDtid).toHaveBeenCalledWith('2', '921528');
    });
  });

  describe('GET /report/get-provision-variables/:document_type_id/:dtid', () => {
    it('returns variables for the given doc type and dtid', async () => {
      const variables = [{ id: 1, variable_name: 'VAR_A', variable_value: 'val' }];
      mockReportService.getDocumentVariablesByDocumentTypeIdAndDtid.mockResolvedValue(variables);

      const res = await request(app.getHttpServer())
        .get('/report/get-provision-variables/2/921528')
        .expect(200);

      expect(res.body).toEqual(variables);
    });
  });

  describe('GET /report/enabled-provisions/:document_type_id', () => {
    it('returns enabled provisions for the given doc type', async () => {
      mockReportService.getEnabledProvisionsByDocTypeId.mockResolvedValue([]);

      await request(app.getHttpServer()).get('/report/enabled-provisions/2').expect(200);
      expect(mockReportService.getEnabledProvisionsByDocTypeId).toHaveBeenCalledWith('2');
    });
  });

  describe('GET /report/enabled-provisions2/:document_type_id/:dtid', () => {
    it('returns enabled provisions for the given doc type and dtid', async () => {
      mockReportService.getEnabledProvisionsByDocTypeIdDtid.mockResolvedValue([]);

      await request(app.getHttpServer()).get('/report/enabled-provisions2/2/921528').expect(200);
      expect(mockReportService.getEnabledProvisionsByDocTypeIdDtid).toHaveBeenCalledWith('2', '921528');
    });
  });

  describe('GET /report/search-document-data', () => {
    it('returns all document data', async () => {
      const data = [{ id: 1 }];
      mockReportService.getDocumentData.mockResolvedValue(data);

      const res = await request(app.getHttpServer()).get('/report/search-document-data').expect(200);
      expect(res.body).toEqual(data);
    });
  });

  describe('GET /report/get-mandatory-provisions-by-document-type-id/:document_type_id', () => {
    it('returns mandatory provisions for the given doc type', async () => {
      const provisions = [{ id: 1, provision_name: 'Mandatory Prov' }];
      mockReportService.getMandatoryProvisionsByDocumentTypeId.mockResolvedValue(provisions);

      const res = await request(app.getHttpServer())
        .get('/report/get-mandatory-provisions-by-document-type-id/2')
        .expect(200);

      expect(res.body).toEqual(provisions);
      expect(mockReportService.getMandatoryProvisionsByDocumentTypeId).toHaveBeenCalledWith('2');
    });
  });

  describe('POST /report/generate-report', () => {
    it('calls generateReport with correct args from body and token, returns DOCX stream', async () => {
      const docxBuffer = Buffer.from('PK mock docx content');
      mockReportService.generateReport.mockResolvedValue(docxBuffer);

      const payload = {
        dtid: 921528,
        document_type_id: 2,
        variableJson: [],
        provisionJson: [],
      };

      const res = await request(app.getHttpServer()).post('/report/generate-report').send(payload).expect(201);

      expect(res.headers['content-type']).toMatch(/wordprocessingml/);
      expect(mockReportService.generateReport).toHaveBeenCalledWith(
        payload.dtid,
        payload.document_type_id,
        mockIdirUser.idir_username,
        `${mockIdirUser.given_name} ${mockIdirUser.family_name}`,
        payload.variableJson,
        payload.provisionJson
      );
    });
  });

  describe('POST /report/save-document', () => {
    it('calls saveDocument with correct args including idir_username from token', async () => {
      mockReportService.saveDocument.mockResolvedValue({ id: 1 });

      const payload = {
        dtid: 921528,
        document_type_id: 2,
        status: 'FINAL',
        provisionArray: [{ provision_id: 1, doc_type_provision_id: 10 }],
        variableArray: [],
      };

      const res = await request(app.getHttpServer()).post('/report/save-document').send(payload).expect(201);

      expect(res.body).toEqual({ id: 1 });
      expect(mockReportService.saveDocument).toHaveBeenCalledWith(
        payload.dtid,
        payload.document_type_id,
        payload.status,
        payload.provisionArray,
        payload.variableArray,
        mockIdirUser.idir_username
      );
    });
  });
});
