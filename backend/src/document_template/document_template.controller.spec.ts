import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, CanActivate, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { DocumentTemplateController } from './document_template.controller';
import { DocumentTemplateService } from './document_template.service';
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

const mockTemplateService = {
  create: jest.fn(),
  checkForActiveTemplates: jest.fn(),
  activateTemplate: jest.fn(),
  remove: jest.fn(),
  findAll: jest.fn(),
  findActiveByDocumentType: jest.fn(),
  findOne: jest.fn(),
  getTemplatesInfoByIds: jest.fn(),
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function buildApp(authGuard: CanActivate = allowAll): Promise<INestApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [DocumentTemplateController],
    providers: [{ provide: DocumentTemplateService, useValue: mockTemplateService }],
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

describe('DocumentTemplateController – guard enforcement', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 401 when JwtAuthGuard rejects', async () => {
    const app = await buildApp(rejectUnauthorized);
    await request(app.getHttpServer()).get('/document-template/1').expect(401);
    await app.close();
  });
});

// ---------------------------------------------------------------------------
// Controller logic
// ---------------------------------------------------------------------------

describe('DocumentTemplateController – controller logic', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  describe('GET /document-template/:document_type_id', () => {
    it('returns trimmed templates (the_file property stripped)', async () => {
      // the_file should be stripped from the returned objects
      mockTemplateService.findAll.mockResolvedValue([
        { id: 1, file_name: 'template.docx', the_file: Buffer.from('secret') },
        { id: 2, file_name: 'other.docx', the_file: Buffer.from('secret2') },
      ]);

      const res = await request(app.getHttpServer()).get('/document-template/3').expect(200);

      expect(res.body).toEqual([
        { id: 1, file_name: 'template.docx' },
        { id: 2, file_name: 'other.docx' },
      ]);
      expect(mockTemplateService.findAll).toHaveBeenCalledWith('3');
    });
  });

  describe('GET /document-template/get-active-report/:document_type', () => {
    it('returns the active template for the given doc type', async () => {
      const template = { id: 5, file_name: 'active.docx', active_flag: true };
      mockTemplateService.findActiveByDocumentType.mockResolvedValue(template);

      const res = await request(app.getHttpServer())
        .get('/document-template/get-active-report/2')
        .expect(200);

      expect(res.body).toEqual(template);
      expect(mockTemplateService.findActiveByDocumentType).toHaveBeenCalledWith('2');
    });
  });

  describe('GET /document-template/find-one/:id', () => {
    it('returns a single template by id', async () => {
      const template = { id: 7, file_name: 'single.docx' };
      mockTemplateService.findOne.mockResolvedValue(template);

      const res = await request(app.getHttpServer()).get('/document-template/find-one/7').expect(200);
      expect(res.body).toEqual(template);
      expect(mockTemplateService.findOne).toHaveBeenCalledWith('7');
    });
  });

  describe('GET /document-template/remove/:document_type/:id', () => {
    it('calls remove with correct params and returns the id', async () => {
      mockTemplateService.remove.mockResolvedValue({ id: 4 });

      const res = await request(app.getHttpServer()).get('/document-template/remove/2/4').expect(200);
      expect(res.body).toEqual({ id: 4 });
      expect(mockTemplateService.remove).toHaveBeenCalledWith('2', '4');
    });
  });

  describe('POST /document-template/activate-template', () => {
    it('delegates to templateService.activateTemplate', async () => {
      mockTemplateService.activateTemplate.mockResolvedValue(undefined);

      const payload = { id: 3, update_userid: 'TEST_USER', document_type_id: 1 };
      await request(app.getHttpServer()).post('/document-template/activate-template').send(payload).expect(201);

      expect(mockTemplateService.activateTemplate).toHaveBeenCalledWith(payload);
    });
  });

  describe('POST /document-template/document-template-info', () => {
    it('returns template info for the given ids', async () => {
      const info = [{ id: 1, file_name: 'a.docx' }, { id: 2, file_name: 'b.docx' }];
      mockTemplateService.getTemplatesInfoByIds.mockResolvedValue(info);

      const res = await request(app.getHttpServer())
        .post('/document-template/document-template-info')
        .send([1, 2])
        .expect(201);

      expect(res.body).toEqual(info);
      expect(mockTemplateService.getTemplatesInfoByIds).toHaveBeenCalledWith([1, 2]);
    });
  });
});
